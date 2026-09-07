## 2024-05-24 - Remove Hardcoded Demo Credentials
**Vulnerability:** Found hardcoded demo credentials (`matricula`: '2024100', `senha`: 'Demo@123') used to initialize the state in `src/pages/Login.jsx`.
**Learning:** Hardcoded credentials even for demo purposes can easily leak to production if not managed via environment variables or explicit demo flags.
**Prevention:** Always initialize login state as empty strings. If demo mode is required, use environment variables (e.g., `import.meta.env.VITE_DEMO_PASSWORD`) and strict conditional logic.
