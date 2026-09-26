/**
 * Sanitizes a URL by ensuring it uses a safe protocol.
 * Prevents XSS attacks via javascript: or data: URIs.
 *
 * @param {string} url - The URL to sanitize.
 * @returns {string} The sanitized URL, or '#' if invalid/unsafe.
 */
export function sanitizeUrl(url) {
    if (!url) return '#';
    try {
        const parsed = new URL(url, window.location.origin);
        if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
            return parsed.href;
        }
    } catch {
        // Invalid URL
    }
    return '#';
}
