## 2025-02-23 - Remove Hardcoded Credentials from Login
**Vulnerability:** Hardcoded credentials (`matricula` and `senha`) were found in the state initialization of the `Login.jsx` component.
**Learning:** Hardcoding default credentials in frontend forms exposes them in the client-side bundle and source code, creating a critical security vulnerability where anyone can authenticate. It's a risk especially for demo/test accounts that might be accidentally deployed to production.
**Prevention:** Never hardcode credentials in source code. Default credentials for testing should be injected via secure CI/CD pipelines (e.g. environment variables specifically for E2E testing environments) or entered manually during manual testing. Production code should always default credential fields to empty strings.
## $(date +%Y-%m-%d) - Prevent XSS in Material Download Links
**Vulnerability:** User-provided material URLs were being rendered directly into `href` attributes in `CardMaterial.jsx` and `Cadastro.jsx`, allowing for Stored XSS via `javascript:` or `data:` payloads.
**Learning:** Even simple `<a href={link}>` tags are dangerous if the link protocol isn't verified. React protects against HTML injection in children (`>...<`), but it *does not* validate `href` attributes against malicious protocols.
**Prevention:** All user-provided URLs must be sanitized before rendering. A utility like `sanitizeUrl` (which parses the URL and enforces an allowlist of safe protocols like `http:`/`https:`) should be standard for all external links in the frontend.
