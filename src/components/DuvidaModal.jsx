import React, { useState } from 'react';
import './DuvidaModal.css';

export default function DuvidaModal({ duvida, NomeUsuario, UsuarioAtual, apiUrl, onClose, onComentarioAdicionado }) {
    const [novoComentario, setNovoComentario] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!duvida) return null;

    // Handle closing when clicking outside the modal content
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('duvida-modal-overlay')) {
            onClose();
        }
    };

    const handleSubmitComentario = async (e) => {
        e.preventDefault();
        if (!novoComentario.trim()) return;

        setIsSubmitting(true);
        
        const comentarioObj = {
            usuario: UsuarioAtual.nome + ' ' + UsuarioAtual.sobrenome,
            classe: 'Aluno',
            texto: novoComentario
        };

        const updatedDuvida = {
            ...duvida,
            comentarios: [...(duvida.comentarios || []), comentarioObj]
        };

        const duvidaId = duvida._id || duvida.id;

        try {
            const res = await fetch(`${apiUrl}/duvidas/${duvidaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDuvida)
            });

            if (res.ok) {
                const returnedDuvida = await res.json();
                setNovoComentario('');
                if (onComentarioAdicionado) {
                    onComentarioAdicionado(returnedDuvida);
                }
            } else {
                alert('Falha ao enviar comentário.');
            }
        } catch (error) {
            alert('Erro de conexão ao enviar comentário.');
        } finally {
            setIsSubmitting(false);
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

                        <form className="form-novo-comentario" onSubmit={handleSubmitComentario}>
                            <textarea 
                                placeholder="Adicione um comentário..." 
                                value={novoComentario}
                                onChange={(e) => setNovoComentario(e.target.value)}
                                required
                                rows="2"
                            ></textarea>
                            <button type="submit" disabled={isSubmitting} className="btn-comentar">
                                {isSubmitting ? 'Enviando...' : 'Comentar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
