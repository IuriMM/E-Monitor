## 2025-02-23 - Remove Hardcoded Credentials from Login
**Vulnerability:** Hardcoded credentials (`matricula` and `senha`) were found in the state initialization of the `Login.jsx` component.
**Learning:** Hardcoding default credentials in frontend forms exposes them in the client-side bundle and source code, creating a critical security vulnerability where anyone can authenticate. It's a risk especially for demo/test accounts that might be accidentally deployed to production.
**Prevention:** Never hardcode credentials in source code. Default credentials for testing should be injected via secure CI/CD pipelines (e.g. environment variables specifically for E2E testing environments) or entered manually during manual testing. Production code should always default credential fields to empty strings.
## 2026-09-25 - [XSS via Material Links]
**Vulnerability:** User-provided material links (URL) were inserted directly into the `href` attribute of `<a>` tags without sanitization.
**Learning:** This exposes the application to Cross-Site Scripting (XSS) if a user creates a material with a `javascript:` URI (e.g. `javascript:alert(1)`), which executes when clicked.
**Prevention:** Always validate and sanitize user-provided URLs before using them in `href` attributes, ensuring they use safe protocols like `http:` or `https:`.
