## 2024-05-24 - Hardcoded Credentials in React state
**Vulnerability:** Found hardcoded student ID ('2024100') and password ('Demo@123') in the `src/pages/Login.jsx` file used as initial state for the login form.
**Learning:** Hardcoding credentials in source code exposes them to anyone with access to the code. While these might be intended for testing/demo, committing them is dangerous.
**Prevention:** Remove hardcoded values from initial states in React components; use environment variables or require users to enter credentials.

## 2024-05-24 - CI failures due to high vulnerabilities in node modules
**Vulnerability:** Found vulnerable dependencies causing the CI pipeline to fail during `npm audit --audit-level=high` step.
**Learning:** Checking for dependency vulnerabilities is a necessary step during pipeline runs to ensure security standard is met.
**Prevention:** Always run `npm audit fix` periodically to patch known vulnerabilities and configure CI/CD pipelines to fail builds if high/critical vulnerabilities exist.
