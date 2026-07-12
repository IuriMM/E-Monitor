import React from 'react';
import './CardMaterial.css';

export default function CardMaterial({ material }) {
    return (
        <div className="card-material">
            <div className="material-header">
                <div className="material-title">
                    <h3>{material.titulo}</h3>
                    <p>Por {material.autor} • {material.data}</p>
                </div>
                <span className="material-tag">{material.materia}</span>
            </div>
            
            <div className="material-comentario">
                <p style={{ margin: 0 }}>{material.comentario}</p>
            </div>
            
            <div className="material-footer">
                <a href={material.link} target="_blank" rel="noopener noreferrer" className="btn-download">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                    Baixar Material
                </a>
            </div>
        </div>
    );
}
