import './CardMaterial.css';
import { Download } from 'lucide-react';

export default function CardMaterial({ material, NomeMateria }) {
    return (
        <div className="card-material">
            <div className="material-header">
                <div className="material-title">
                    <h3>{material.titulo}</h3>
                    <p>Por {material.autor} • {material.data}</p>
                </div>
                <span className="material-tag">{NomeMateria || material.materia}</span>
            </div>
            
            <div className="material-comentario">
                <p style={{ margin: 0 }}>{material.comentario}</p>
            </div>
            
            <div className="material-footer">
                <a href={material.link} target="_blank" rel="noopener noreferrer" className="btn-download">
                    <Download size={18} />
                    Baixar Material
                </a>
            </div>
        </div>
    );
}
