## 2024-05-18 - Hardcoded Demo Credentials in Login Component
**Vulnerability:** Hardcoded demo credentials (matricula: '2024100', senha: 'Demo@123') were found initialized in the state of `src/pages/Login.jsx`.
**Learning:** Developers sometimes leave demo/test credentials hardcoded in frontend components for easier local development or testing, forgetting to remove them before deploying to production. This exposes valid credentials in the source code.
**Prevention:** Never hardcode credentials in source code. If demo credentials are needed for local development, use environment variables (e.g., `import.meta.env.VITE_DEMO_USER`) and ensure they are not bundled in production builds, or use a separate testing environment/script.
