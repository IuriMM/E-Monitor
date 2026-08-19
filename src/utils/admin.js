const ADMIN_MATRICULA = import.meta.env.VITE_ADMIN_MATRICULA;

// Gate só de UI: decide se o botão/tela de admin aparece. Não é uma
// verificação de segurança — a API precisa aplicar a regra de verdade
// (ver proposta_autorizacao_api.md). Isso só evita mostrar a opção na
// interface pra quem não deveria vê-la.
export function isAdminUser(usuario) {
  if (!usuario) return false;
  return usuario.papel === 'admin' || (Boolean(ADMIN_MATRICULA) && usuario.matricula === ADMIN_MATRICULA);
}
