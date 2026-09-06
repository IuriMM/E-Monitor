## 2024-09-06 - Hardcoded Credentials in Login
**Vulnerability:** Hardcoded credentials (matricula and senha) found in Login.jsx.
**Learning:** Hardcoded credentials even for demo purposes can easily leak to production builds, exposing potentially valid testing/admin accounts.
**Prevention:** Never hardcode credentials in source code. If demo credentials are required, they should be clearly documented outside the source or loaded via secure configuration/environment variables if absolutely necessary (though ideally avoid shipping them altogether).
