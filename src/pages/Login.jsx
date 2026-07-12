import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, apiUrl }) {
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
      const res = await fetch(`${apiUrl}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matricula, senha })
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Matrícula ou senha incorretos');
        } else {
          throw new Error('Erro ao conectar com o servidor');
        }
      }

      const userData = await res.json();
      onLogin(userData);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src="/src/assets/logo.png" className="Logo" alt="eMonitor Logo" />
        </div>
        <h2>Entrar no eMonitor</h2>
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
          {erro && <p className="login-error">{erro}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
