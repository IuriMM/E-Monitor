## 2024-05-24 - Hardcoded Credentials in React state
**Vulnerability:** Found hardcoded student ID ('2024100') and password ('Demo@123') in the `src/pages/Login.jsx` file used as initial state for the login form.
**Learning:** Hardcoding credentials in source code exposes them to anyone with access to the code. While these might be intended for testing/demo, committing them is dangerous.
**Prevention:** Remove hardcoded values from initial states in React components; use environment variables or require users to enter credentials.
