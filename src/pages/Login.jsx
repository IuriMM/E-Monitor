import { useState } from 'react';
import './Login.css';
import logoImg from '../assets/logo.png';
import { apiPost } from '../api/client';

export default function Login({ onLogin, sessionExpired }) {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    if (!matricula || !senha) {
      setErro('Por favor, preencha matrícula e senha.');
      return;
    }

    try {
      setLoading(true);
      const response = await apiPost('/usuarios/login', { matricula, senha });
      if (!response?.access_token || !response?.usuario) {
        throw new Error('Resposta inesperada do servidor.');
      }
      onLogin(response);
    } catch (err) {
      if (err.status === 401) {
        setErro('Matrícula ou senha incorretos');
      } else {
        setErro('Erro ao conectar com o servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={logoImg} className="Logo" alt="eMonitor Logo" />
        </div>
        <h2>Entrar no eMonitor</h2>
        {sessionExpired && <p className="login-error">Sua sessão expirou. Entre novamente.</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="matricula">Matrícula</label>
            <input
              type="text"
              id="matricula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Digite sua matrícula"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>
          {erro && (
            <div className="login-error-box" role="alert">
              <p>{erro}</p>
            </div>
          )}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
