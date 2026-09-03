## YYYY-MM-DD - [Hardcoded Credentials]
**Vulnerability:** Found valid credentials hardcoded directly as default values in the `src/pages/Login.jsx` state.
**Learning:** Development convenience features like auto-filling credentials can easily slip into production code and expose valid accounts.
**Prevention:** Avoid hardcoding credentials in the frontend. Use environment variables (which shouldn't be committed) or a dedicated test environment.
