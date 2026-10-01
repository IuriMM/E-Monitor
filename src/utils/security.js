// Funções centralizadas de utilidade de segurança para o frontend

/**
 * Sanitiza URLs para prevenir Cross-Site Scripting (XSS) via atributos href.
 * Remove protocolos perigosos como javascript:, data:, vbscript:.
 *
 * @param {string} url - A URL para sanitizar.
 * @returns {string} - A URL sanitizada, ou '#' se for inválida/perigosa.
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  // Permite links relativos
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return url;
  }

  try {
    const parsedUrl = new URL(url, window.location.origin);
    const protocol = parsedUrl.protocol.toLowerCase();

    if (['javascript:', 'data:', 'vbscript:'].includes(protocol)) {
      console.warn('Bloqueada URL perigosa:', url);
      return '#';
    }

    return url;
  } catch {
    // Se a URL não pode ser parseada, por segurança bloqueia,
    // a menos que pareça ser uma URL relativa (tratado no if acima)
    return '#';
  }
}
