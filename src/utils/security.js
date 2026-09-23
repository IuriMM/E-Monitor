/**
 * Sanitizes URLs to prevent XSS attacks.
 * Rejects javascript:, vbscript:, and data: protocols.
 *
 * @param {string} url - The URL to sanitize.
 * @returns {string} The sanitized URL, or '#' if invalid.
 */
export function sanitizeUrl(url) {
    if (!url) return '#';
    try {
        const parsedUrl = new URL(url, window.location.origin);
        const protocol = parsedUrl.protocol.toLowerCase();

        if (['javascript:', 'vbscript:', 'data:'].includes(protocol)) {
            return '#';
        }

        return url;
    } catch {
        // Se a URL for completamente inválida para parsear, por segurança rejeitamos ou retornamos como está.
        // Já que esperamos URls válidas pro link (como http://), se der erro tentamos checar a string pura.
        const lowerUrl = String(url).trim().toLowerCase();
        if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('vbscript:') || lowerUrl.startsWith('data:')) {
            return '#';
        }
        return url;
    }
}
