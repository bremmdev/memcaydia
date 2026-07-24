#!/usr/bin/env bash
#
# Creates the static-hosting infrastructure for memcaydia via an idempotent script:
#
#   1. Private S3 bucket in eu-central-1 with all public access blocked
#   2. CloudFront Origin Access Control (OAC)
#   3. CloudFront distribution ("memcaydia-cdn") that serves the bucket via OAC,
#      with SPA-friendly 403/404 -> /index.html rewrites
#   4. Bucket policy that only allows reads from this specific distribution
#

set -euo pipefail

# Git Bash / MSYS on Windows: don't rewrite arguments that look like POSIX paths
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

REGION="${REGION:-eu-central-1}"
PROJECT="${PROJECT:-memcaydia}"
# account-namespace suffix used in the bucket name
SUFFIX="${SUFFIX:-an}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI not found on PATH. Install it and run 'aws configure' first." >&2
  exit 1
fi

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"

BUCKET="$PROJECT-$ACCOUNT_ID-$REGION-$SUFFIX"
OAC_NAME="$PROJECT-oac"
DIST_NAME="$PROJECT-cdn"   # applied as the Name tag (console name) and as Comment
ORIGIN_ID="s3-$BUCKET"

echo "Account: $ACCOUNT_ID"
echo "Bucket:  $BUCKET"
echo ""

# --- 1. S3 bucket ------------------------------------------------------------

if aws s3api head-bucket --bucket "$BUCKET" >/dev/null 2>&1; then
  echo "Bucket already exists, skipping creation."
else
  echo "Creating bucket..."
  # the -an name suffix puts the bucket in the account regional namespace,
  # which CreateBucket must opt into explicitly
  aws s3api create-bucket \
    --bucket "$BUCKET" \
    --bucket-namespace account-regional \
    --region "$REGION" \
    --create-bucket-configuration "LocationConstraint=$REGION" >/dev/null
fi

echo "Blocking all public access on the bucket..."
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# --- 2. Origin Access Control ------------------------------------------------

OAC_ID="$(aws cloudfront list-origin-access-controls \
  --query "OriginAccessControlList.Items[?Name=='$OAC_NAME'].Id | [0]" --output text)"

if [ -n "$OAC_ID" ] && [ "$OAC_ID" != "None" ]; then
  echo "OAC '$OAC_NAME' already exists ($OAC_ID), skipping creation."
else
  echo "Creating Origin Access Control '$OAC_NAME'..."
  OAC_CONFIG=$(cat <<EOF
{
  "Name": "$OAC_NAME",
  "Description": "OAC for $PROJECT S3 origin",
  "SigningProtocol": "sigv4",
  "SigningBehavior": "always",
  "OriginAccessControlOriginType": "s3"
}
EOF
)
  OAC_ID="$(aws cloudfront create-origin-access-control \
    --origin-access-control-config "$OAC_CONFIG" \
    --query "OriginAccessControl.Id" --output text)"
fi

# --- 3. CloudFront distribution ----------------------------------------------

DIST_ID="$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='$DIST_NAME'].Id | [0]" --output text)"

if [ -n "$DIST_ID" ] && [ "$DIST_ID" != "None" ]; then
  echo "Distribution '$DIST_NAME' already exists ($DIST_ID), skipping creation."
  read -r DIST_ID DIST_ARN DIST_DOMAIN <<<"$(aws cloudfront get-distribution \
    --id "$DIST_ID" --query 'Distribution.[Id,ARN,DomainName]' --output text)"
else
  echo "Creating CloudFront distribution '$DIST_NAME'..."
  DIST_CONFIG=$(cat <<EOF
{
  "CallerReference": "$DIST_NAME-$(date +%Y%m%d%H%M%S)",
  "Comment": "$DIST_NAME",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "PriceClass": "PriceClass_100",
  "HttpVersion": "http2and3",
  "IsIPV6Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "$ORIGIN_ID",
        "DomainName": "$BUCKET.s3.$REGION.amazonaws.com",
        "OriginAccessControlId": "$OAC_ID",
        "S3OriginConfig": { "OriginAccessIdentity": "" }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "$ORIGIN_ID",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true,
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] }
    }
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      }
    ]
  },
  "ViewerCertificate": { "CloudFrontDefaultCertificate": true },
  "Restrictions": { "GeoRestriction": { "RestrictionType": "none", "Quantity": 0 } }
}
EOF
)
  # CachePolicyId above is the AWS managed "CachingOptimized" policy
  read -r DIST_ID DIST_ARN DIST_DOMAIN <<<"$(aws cloudfront create-distribution \
    --distribution-config "$DIST_CONFIG" \
    --query 'Distribution.[Id,ARN,DomainName]' --output text)"
fi

# the console shows the Name tag as the distribution's name; the Comment is
# what the script itself uses to find the distribution on re-runs
echo "Tagging distribution with Name=$DIST_NAME..."
aws cloudfront tag-resource \
  --resource "$DIST_ARN" \
  --tags "Items=[{Key=Name,Value=$DIST_NAME}]"

# --- 4. Bucket policy: only this distribution may read -----------------------

echo "Applying bucket policy (read-only for CloudFront via OAC)..."
POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET/*",
      "Condition": { "StringEquals": { "AWS:SourceArn": "$DIST_ARN" } }
    }
  ]
}
EOF
)
aws s3api put-bucket-policy --bucket "$BUCKET" --policy "$POLICY"

# --- 5. Outputs (gitignored, contains account-specific values) ---------------

cat > "$SCRIPT_DIR/outputs.json" <<EOF
{
  "accountId": "$ACCOUNT_ID",
  "region": "$REGION",
  "bucket": "$BUCKET",
  "oacId": "$OAC_ID",
  "distributionId": "$DIST_ID",
  "distributionArn": "$DIST_ARN",
  "distributionDomain": "$DIST_DOMAIN"
}
EOF

echo ""
echo "Done. Outputs written to infra/outputs.json (gitignored)."
echo "Distribution: https://$DIST_DOMAIN (deployment takes ~5-10 minutes)"
echo ""
echo "Deploy the site with:"
echo "  npm run build"
echo "  aws s3 sync dist s3://$BUCKET --delete"
