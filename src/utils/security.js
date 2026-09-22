export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmedUrl = url.trim();
  try {
    const parsedUrl = new URL(trimmedUrl, 'http://localhost');
    if (['http:', 'https:'].includes(parsedUrl.protocol)) {
      return trimmedUrl;
    }
    return '#';
  } catch {
    return '#';
  }
}
