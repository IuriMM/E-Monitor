## 2024-05-24 - Hardcoded Demo Credentials
**Vulnerability:** Initial states of matricula and senha variables in src/pages/Login.jsx contained hardcoded demo credentials.
**Learning:** These defaults expose known credentials that can be exploited in production if not properly stripped or reset. Hardcoding demo credentials in login forms directly leaks working credentials if the accounts actually exist on the backend.
**Prevention:** Never use hardcoded values in components, use empty strings or load placeholders for inputs in components to prevent shipping any credential text directly in the codebase.
