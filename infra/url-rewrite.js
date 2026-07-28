// url-rewrite function for CloudFront function to rewrite valid client side routes to index.html
function handler(event) {
  const request = event.request;
  const uri = request.uri;

  // Let actual files and special paths reach S3 unchanged.
  if (
    uri.startsWith("/assets/") ||
    uri === "/favicon.ico" ||
    /\.[a-zA-Z0-9]{1,10}$/.test(uri)
  ) {
    return request;
  }

  // Keep in sync with the React Router route tree in src/App.tsx.
  const knownRoute =
    uri === "/" || uri === "/highscores" || uri.startsWith("/games/");

  if (knownRoute) {
    request.uri = "/index.html";
  }

  return request;
}
