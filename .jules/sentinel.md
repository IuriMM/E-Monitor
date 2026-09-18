## 2026-07-12 - Prevent XSS in user-provided links
**Vulnerability:** XSS (Cross-Site Scripting) vulnerability via `href` attributes in `CardMaterial.jsx` and `Cadastro.jsx` that did not sanitize `javascript:` URIs.
**Learning:** React prevents XSS in text rendering by default but does not sanitize attributes like `href`. If a user controls the URL, they can provide a `javascript:` protocol URI to execute code.
**Prevention:** Always validate user-provided URLs before rendering them in `href`. Use a robust regex to catch variations like `/^\s*javascript:/i` or enforce `http`/`https` protocols.
