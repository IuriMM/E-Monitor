## 2025-02-14 - URL-based XSS via Material Links
**Vulnerability:** Unsanitized user input in `href` attributes for study materials links in `CardMaterial.jsx` and `Cadastro.jsx`, allowing potential XSS via javascript: URIs.
**Learning:** Stored user-provided URLs were directly rendered into link `href` attributes, which bypasses React's normal XSS protection because React considers the string safe to place inside the attribute, but the browser will execute `javascript:` links on click.
**Prevention:** Implement a central `sanitizeUrl` utility function in `src/utils/security.js` that parses the URL and ensures the protocol is safe (http, https, mailto) or is a relative path, and consistently use it wherever user-provided URLs are bound to `href` attributes.
