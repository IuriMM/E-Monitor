## 2024-09-10 - Hardcoded Secrets in Default State
**Vulnerability:** A hardcoded matricula ('2024100') and password ('Demo@123') were found initialized as the default state variables in the login component (`src/pages/Login.jsx`).
**Learning:** Developers sometimes use hardcoded credentials during development and forget to remove them before pushing to the repository. This exposes legitimate credentials within the client-side code which can easily be extracted by malicious actors inspecting the source.
**Prevention:** Ensure that initial states for sensitive fields in authentication forms are always empty strings (`''`) or null. Implement pre-commit hooks to scan for common patterns of hardcoded test credentials or use tools like `trufflehog` or `git-secrets` in the CI pipeline.
