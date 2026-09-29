/**
 * Sanitizes a URL to prevent XSS vulnerabilities from malicious protocols like javascript:.
 * @param {string} url The URL to sanitize.
 * @returns {string} The sanitized URL, or '#' if invalid.
 */
export function sanitizeUrl(url) {
    if (!url) return '#';
    try {
        const parsedUrl = new URL(url, window.location.origin);
        // Only allow safe protocols
        const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
        if (safeProtocols.includes(parsedUrl.protocol)) {
            return url;
        }
        return '#';
    } catch {
        // If URL parsing fails, check if it's a relative path starting with '/'
        if (url.startsWith('/')) {
            return url;
        }
        return '#';
    }
}
