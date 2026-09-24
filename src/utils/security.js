/**
 * Sanitiza uma URL para evitar XSS baseado em javascript: ou data:
 * @param {string} url - A URL a ser sanitizada
 * @returns {string} - A URL original se segura, ou '#' se perigosa
 */
export function sanitizeUrl(url) {
  if (!url) return '#';
  try {
    const parsedUrl = new URL(url, window.location.origin);
    // Permite apenas protocolos HTTP(S) ou URLs relativas no mesmo host
    if (['http:', 'https:'].includes(parsedUrl.protocol)) {
      return url; // Retorna a string original para preservar o formato exato
    }
  } catch {
    // Se a URL for inválida mesmo com fallback para base, assume como insegura
  }
  return '#';
}
