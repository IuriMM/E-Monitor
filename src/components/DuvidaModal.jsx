import React from 'react';
import './DuvidaModal.css';

export default function DuvidaModal({ duvida, NomeUsuario, onClose }) {
    if (!duvida) return null;

    // Handle closing when clicking outside the modal content
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('duvida-modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className="duvida-modal-overlay" onClick={handleOverlayClick}>
            <div className="duvida-modal-content">
                <div className="modal-header">
                    <div className="modal-header-info">
                        <h2>{NomeUsuario}</h2>
                        <p>{duvida.materia} • {duvida.horario}</p>
                        <span className="modal-status">{duvida.status || 'Pendente'}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="modal-body">
                    <div className="original-duvida">
                        <p>{duvida.duvida}</p>
                    </div>

                    <div className="comentarios-section">
                        <h3>Comentários</h3>
                        {duvida.comentarios && duvida.comentarios.length > 0 ? (
                            duvida.comentarios.map((comentario, index) => (
                                <div key={index} className="comentario">
                                    <div className="comentario-header">
                                        <span className="comentario-usuario">{comentario.usuario}</span>
                                        <span className={`comentario-classe ${comentario.classe.toLowerCase()}`}>
                                            {comentario.classe}
                                        </span>
                                    </div>
                                    <p className="comentario-texto">{comentario.texto}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#888', fontStyle: 'italic' }}>Nenhum comentário ainda.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
