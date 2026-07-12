import React from 'react';
import './Perfil.css';

export default function Perfil({ Usuario, Materias, onLogout }) {
  // Lista formatada das matérias do usuário
  const materiasUsuario = Object.values(Materias);

  return (
    <div className="page perfil-page">
      <div className="perfil-card glass-card">
        <div className="perfil-header">
          <div className="perfil-avatar-large">
             {Usuario.fotoPerfil ? (
                 <img src="./Perfil.svg" alt="Perfil" />
             ) : (
                 <p>{Usuario.nome[0]}{Usuario.sobrenome[0]}</p>
             )}
          </div>
          <h2>{Usuario.nome} {Usuario.sobrenome}</h2>
          <p className="perfil-curso">{Usuario.curso}</p>
        </div>

        <div className="perfil-info">
          <div className="info-item">
            <span className="info-label">Matrícula</span>
            <span className="info-value">{Usuario.matricula}</span>
          </div>
        </div>

        <div className="perfil-materias">
          <h3>Suas Matérias</h3>
          {materiasUsuario.length > 0 ? (
            <ul className="materias-list">
              {materiasUsuario.map((mat, index) => (
                <li key={index} className="materia-badge">
                  <span className="materia-codigo">{mat.codigo}</span>
                  <span className="materia-nome">{mat.nome}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-materias">Você ainda não possui matérias cadastradas.</p>
          )}
        </div>

        <button className="btn-logout" onClick={onLogout}>
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
