// Por padrão usamos um caminho relativo: em produção o Vercel (vercel.json)
// reescreve /api/* para o backend, e em dev o Vite (vite.config.js) faz o
// mesmo proxy. Assim o navegador nunca vê o form de login enviando
// matrícula/senha para um domínio de terceiros — isso é exatamente o padrão
// que antivírus (ex: Kaspersky) e navegadores marcam como possível phishing
// de credenciais. Só sobrescreva VITE_API_URL se optar por não usar o proxy.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

let authToken = null;
let unauthorizedHandler = null;

export function setAuthToken(token) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

// Chamado quando uma requisição autenticada volta 401 (token expirado/inválido),
// para que a UI possa derrubar a sessão em vez de mostrar um erro genérico.
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const hadToken = Boolean(authToken);
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!res.ok) {
    let detail = `Erro ${res.status} ao acessar ${path}`;
    try {
      const errBody = await res.json();
      if (errBody?.detail) detail = errBody.detail;
    } catch {
      // resposta sem corpo JSON
    }
    const error = new Error(detail);
    error.status = res.status;

    if (res.status === 401 && hadToken && unauthorizedHandler) {
      unauthorizedHandler();
    }

    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

export const apiGet = (path, opts) => request(path, { ...opts, method: 'GET' });
export const apiPost = (path, body, opts) => request(path, { ...opts, method: 'POST', body });
export const apiPut = (path, body, opts) => request(path, { ...opts, method: 'PUT', body });
export const apiDelete = (path, opts) => request(path, { ...opts, method: 'DELETE' });

export { API_BASE_URL };
