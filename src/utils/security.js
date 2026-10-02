/**
 * Sanitizes a URL to prevent XSS attacks.
 * Rejects javascript:, data:, and vbscript: protocols.
 *
 * @param {string} url - The URL to sanitize.
 * @returns {string} - The original URL if safe, or a fallback safe URL ('#').
 */
export function sanitizeUrl(url) {
  if (!url) return '#';
  try {
    // If it's a relative URL, it will throw an error when parsing with a dummy base
    // unless we provide a dummy base. We use a dummy base just for protocol extraction.
    const parsed = new URL(url, 'https://dummy.base.local');
    const protocol = parsed.protocol.toLowerCase();

    if (['javascript:', 'data:', 'vbscript:'].includes(protocol)) {
      return '#';
    }

    return url;
  } catch {
    // If URL parsing fails entirely, return a safe fallback
    return '#';
  }
}
