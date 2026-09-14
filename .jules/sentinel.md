## 2026-09-14 - Removed hardcoded credentials in Frontend
**Vulnerability:** Hardcoded login credentials found in src/pages/Login.jsx component initial state.
**Learning:** Hardcoded credentials on the frontend allow anyone viewing the site to extract and use those credentials.
**Prevention:** Never hardcode credentials in source code. Use empty strings for initial state and let the user enter their own credentials.
