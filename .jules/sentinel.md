## 2024-05-15 - [CRITICAL] Default Credentials in Frontend State
**Vulnerability:** Found hardcoded default credentials (`'2024100'` and `'Demo@123'`) initializing the state of the login form in `src/pages/Login.jsx`.
**Learning:** Developers sometimes hardcode credentials during development to speed up testing. If these aren't removed before committing, they might end up in the production build, potentially exposing valid testing credentials to end users, or at the very least, revealing an expected format for credentials which can aid attackers.
**Prevention:** Always use environment variables for credentials if necessary in development, or keep them completely separate from source code. Do not commit temporary test credentials to version control.
