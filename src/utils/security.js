export function sanitizeUrl(url) {
  if (!url) return '#';
  try {
    const parsedUrl = new URL(url, window.location.origin);
    if (['javascript:', 'data:', 'vbscript:'].includes(parsedUrl.protocol)) {
      return '#';
    }
    return parsedUrl.href;
  } catch {
    // Se a URL for inválida (ex: 'mailto:' relativo solto), retornamos '#'.
    // Em muitos casos uma URL relativa válida será parseada combinando com window.location.origin
    // Mas para manter simples e seguro:
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:')) {
       return url;
    }
    return '#';
  }
}
