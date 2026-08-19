import { useState } from 'react';
import './ModalNovoMaterial.css';

export default function ModalNovoMaterial({ Materias, onSave, onClose }) {
    const [titulo, setTitulo] = useState('');
    const [materia, setMateria] = useState(Object.values(Materias)[0]?.codigo || '');
    const [comentario, setComentario] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ titulo, materia, comentario, link });
    };

    return (
        <div className="modal-novo-material-overlay" onClick={(e) => {
            if (e.target.classList.contains('modal-novo-material-overlay')) onClose();
        }}>
            <div className="modal-novo-material-content">
                <h2>Publicar Novo Material</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Título do Material</label>
                        <input 
                            type="text" 
                            required 
                            value={titulo} 
                            onChange={e => setTitulo(e.target.value)}
                            placeholder="Ex: Lista de Limites" 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Matéria</label>
                        <select required value={materia} onChange={e => setMateria(e.target.value)}>
                            {Object.values(Materias).map((m) => (
                                <option key={m.codigo} value={m.codigo}>{m.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Comentário / Descrição</label>
                        <textarea 
                            required 
                            value={comentario} 
                            onChange={e => setComentario(e.target.value)}
                            placeholder="Adicione observações importantes sobre o material..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Link para Download (URL)</label>
                        <input 
                            type="url" 
                            required 
                            value={link} 
                            onChange={e => setLink(e.target.value)}
                            placeholder="https://..." 
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit">Publicar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
