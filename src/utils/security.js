/**
 * Sanitizes a URL to prevent javascript: and data: URI-based XSS attacks.
 * Only allows http: and https: protocols, or relative URLs.
 *
 * @param {string} url - The URL to sanitize
 * @returns {string} - The original URL if safe, or '#' if unsafe
 */
export function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '#';

    // Trim whitespace
    const trimmedUrl = url.trim();

    // Allow empty or relative paths (though in this context they should be full URLs)
    if (trimmedUrl === '') return '#';

    try {
        // Parse the URL. If it's a relative URL without a base, this will throw
        // an error, but that's handled in the catch block.
        const parsedUrl = new URL(trimmedUrl, 'https://example.com'); // Use a dummy base for parsing relative URLs

        // Allowed protocols
        const allowedProtocols = ['http:', 'https:'];

        // If the URL has a protocol and it's not allowed, block it
        if (parsedUrl.protocol && !allowedProtocols.includes(parsedUrl.protocol.toLowerCase())) {
            // Check specifically if the user tried to provide an absolute URL that
            // got incorrectly parsed with the dummy base (like 'javascript:alert(1)'
            // getting parsed as having protocol 'javascript:')
            return '#';
        }

        // Also check if the original string starts with a dangerous protocol (to be extra safe
        // in case the URL parser behaves unexpectedly)
        const lowerUrl = trimmedUrl.toLowerCase();
        if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:') || lowerUrl.startsWith('vbscript:')) {
            return '#';
        }

        return trimmedUrl;
    } catch {
        // If URL parsing fails, we fallback to a simpler regex/string check
        // to block common dangerous schemes
        const lowerUrl = trimmedUrl.toLowerCase();
        if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:') || lowerUrl.startsWith('vbscript:')) {
            return '#';
        }
        return trimmedUrl;
    }
}
