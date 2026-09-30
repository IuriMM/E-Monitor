export function sanitizeUrl(url) {
  if (!url) return '#';
  try {
    const parsed = new URL(url, window.location.origin);
    const safeProtocols = ['http:', 'https:', 'mailto:'];
    if (safeProtocols.includes(parsed.protocol)) {
      return url;
    }
    return '#';
  } catch {
    // If it's a relative path and doesn't parse with a base, or parse fails for another reason.
    // Given the `window.location.origin` fallback, it should parse relative paths correctly.
    // If we reach here, it's safer to return '#'
    return '#';
  }
}
