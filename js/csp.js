// assets/js/csp.js

(function () {
  const meta = document.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = `
    default-src 'self';
    script-src 'self';
    style-src 'self';
    img-src 'self' data:;
    connect-src 'self' https://script.google.com https://script.googleusercontent.com https://api.ipify.org;
    frame-ancestors 'none';
  `.trim().replace(/\s+/g, ' '); // remove quebras de linha

  document.head.appendChild(meta);
})();