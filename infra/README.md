# Infra

Hosting setup for memcaydia: a private S3 bucket fronted by CloudFront.

## What `create-infra.sh` creates

- **S3 bucket** `memcaydia-<account-id>-eu-central-1-an` in `eu-central-1` with
  all public access blocked. The account id is resolved at runtime from AWS
  credentials. The bucket lives in the
  [account regional namespace](https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html)
  (`--bucket-namespace account-regional`): the `-an` suffix follows AWS's
  required `{prefix}-{account-id}-{region}-an` convention and reserves the name
  for this account. Only bucket creation needs the namespace flag; all other
  operations work unchanged.
- **Origin Access Control** (`memcaydia-oac`) so CloudFront signs its requests
  to S3 so bucket can stay private.
- **CloudFront distribution** named `memcaydia-cdn`. The console-visible name
  is a `Name` resource tag (the script sets it); the same value is also stored
  as the distribution comment, which the script uses to find the distribution
  on re-runs. The distribution is configured with:
  - the private bucket as origin (via OAC)
  - `index.html` as default root object
  - 403/404 rewritten to `/index.html` with status 200 (SPA client-side routing)
  - HTTPS redirect, compression, the managed _CachingOptimized_ cache policy,
    the default CloudFront certificate and `PriceClass_100` (North America +
    Europe).
- **Bucket policy** that allows `s3:GetObject` only to the CloudFront service
  principal, and only for this specific distribution ARN — nothing else can
  read the bucket.

Note: CloudFront itself is a global service; "eu-central-1" applies to the S3
origin bucket.

## Pricing

Distributions created via the API/CLI are always on **pay-as-you-go** — the
flat-rate plans (Free, Pro, ...) can only be chosen in the console; there is no
API for them. Pay-as-you-go includes CloudFront's always-free tier (1 TB data
transfer + 10 M requests per month), so a small site typically costs nothing,
but traffic beyond that is billed.

To switch to the **Free plan** (1 M requests / 100 GB per month allowance, no
overage charges ever): CloudFront console → edit the distribution → choose the
Free pricing plan. Caveats: a plan attaches an AWS WAF web ACL to the
distribution, and a distribution subscribed to a plan can't be deleted until
the plan is cancelled.

## Usage

Requires bash (Git Bash works on Windows) and AWS CLI v2 with configured
credentials. The CLI must be recent enough to support `--bucket-namespace`
on `create-bucket` (added March 2026).

```bash
bash infra/create-infra.sh
```

The script is idempotent: it skips resources that already exist, so re-running
it is safe. Region, project name and bucket suffix can be overridden via the
`REGION`, `PROJECT` and `SUFFIX` environment variables.

## Outputs

Account-specific values (account id, bucket name, distribution id/domain) are
written to `infra/outputs.json`, which is **gitignored**. Everything else in
this folder is safe to commit.

## Deployment

Deploys run from GitHub Actions (`.github/workflows/deploy.yml`) on every push
to `main`, or manually via _Run workflow_. The pipeline builds the app
(`npm ci && npm run build`), syncs `dist/` to the bucket with `--delete`, and
invalidates the CloudFront cache (`/*`).

The workflow authenticates via **OIDC**: GitHub mints a short-lived token that
the workflow exchanges for AWS credentials with
`sts:AssumeRoleWithWebIdentity`, so no long-lived access keys are stored in
GitHub.

### One-time OIDC setup

Prerequisite: the GitHub OIDC identity provider
(`token.actions.githubusercontent.com`) exists in the AWS account (IAM →
Identity providers).

The deploy role is defined by two policy files in this folder, committed with
placeholders (`<my-aws-account-id>`, `<distribution-id>`) so account-specific
values stay out of git — substitute them at apply time:

- `github-actions-trust-policy.json` — who may assume the role: only workflows
  on the `main` branch of `bremmdev/memcaydia`.
- `github-actions-permissions-policy.json` — what the role may do: list and
  write/delete objects in the site bucket, and create invalidations on the
  distribution. Nothing else.

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

sed "s/<my-aws-account-id>/$ACCOUNT_ID/g" \
  infra/github-actions-trust-policy.json > /tmp/trust.json
aws iam create-role --role-name memcaydia-github-deploy \
  --assume-role-policy-document file:///tmp/trust.json

sed -e "s/<my-aws-account-id>/$ACCOUNT_ID/g" \
    -e "s/<distribution-id>/$(jq -r .distributionId infra/outputs.json)/" \
    infra/github-actions-permissions-policy.json > /tmp/perms.json
aws iam put-role-policy --role-name memcaydia-github-deploy \
  --policy-name deploy --policy-document file:///tmp/perms.json
```

Finally, set the repository secret `AWS_ROLE_ARN` (GitHub → Settings → Secrets
and variables → Actions) to
`arn:aws:iam::<account-id>:role/memcaydia-github-deploy` and the secrets for bucket
and CloudFront distribution.

### Manual deploy

The same steps the pipeline runs, from any machine with AWS credentials:

```bash
npm run build
aws s3 sync dist "s3://$(jq -r .bucket infra/outputs.json)" --delete
aws cloudfront create-invalidation \
  --distribution-id "$(jq -r .distributionId infra/outputs.json)" --paths "/*"
```

The cache invalidation is needed so CloudFront picks up the new files. (The
`jq` lookups are a convenience — the bucket name and distribution id are also
printed by `create-infra.sh` and stored in `infra/outputs.json`.)
