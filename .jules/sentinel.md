## 2024-10-27 - [CRITICAL] Fix hardcoded credentials in login
**Vulnerability:** Found hardcoded test credentials ('2024100' and 'Demo@123') directly in the `useState` hooks of `src/pages/Login.jsx`.
**Learning:** Development/demo credentials were left in the React state for convenience during development, but this leaks those credentials into the production bundle when the app is built, potentially giving attackers unauthorized access if these credentials are valid in production or other environments.
**Prevention:** Never leave fallback or default development credentials directly in source code. Use environment variables (e.g., `import.meta.env`) for test accounts if strictly necessary, or ideally, type them manually during development.
