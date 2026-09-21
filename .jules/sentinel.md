## 2024-10-24 - Unsanitized External Links in React UI
**Vulnerability:** Found multiple `a` tags rendering user-provided URLs in `href` attributes (`material.link`) without sanitization, creating a high-risk Stored XSS vulnerability via `javascript:` URIs.
**Learning:** While React automatically sanitizes children nodes, it does NOT sanitize string attributes like `href`. If a user provides a link starting with `javascript:`, React will render it as is, and the script will execute when clicked.
**Prevention:** Always wrap user-provided URLs in `href` attributes with a strict URL sanitizer (e.g., verifying `http:`/`https:` protocols) before rendering.
