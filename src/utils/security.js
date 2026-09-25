/**
 * Sanitizes a URL to prevent XSS attacks via javascript: or data: URIs.
 * Allows only http: and https: protocols (including relative URLs).
 *
 * @param {string} url - The URL to sanitize.
 * @returns {string} The sanitized URL, or '#' if the URL is unsafe.
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';

  try {
    // Use a dummy base URL to correctly parse relative URLs
    const parsedUrl = new URL(url, 'http://localhost');

    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return url;
    }
  } catch {
    // If URL parsing fails, fail secure
  }

  return '#';
}
