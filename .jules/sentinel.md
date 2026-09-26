## 2025-02-23 - Remove Hardcoded Credentials from Login
**Vulnerability:** Hardcoded credentials (`matricula` and `senha`) were found in the state initialization of the `Login.jsx` component.
**Learning:** Hardcoding default credentials in frontend forms exposes them in the client-side bundle and source code, creating a critical security vulnerability where anyone can authenticate. It's a risk especially for demo/test accounts that might be accidentally deployed to production.
**Prevention:** Never hardcode credentials in source code. Default credentials for testing should be injected via secure CI/CD pipelines (e.g. environment variables specifically for E2E testing environments) or entered manually during manual testing. Production code should always default credential fields to empty strings.## 2026-09-26 - [Add URL Sanitization to Prevent XSS in Links]
**Vulnerability:** User-provided URLs in `href` attributes (like `material.link`) were not sanitized, allowing potential execution of `javascript:` or `data:` URIs.
**Learning:** React escapes content but doesn't validate or sanitize `href` attributes automatically. Explicit sanitization is required.
**Prevention:** Always use `sanitizeUrl` from `src/utils/security.js` for user-provided URLs in `href` or `src` attributes.
