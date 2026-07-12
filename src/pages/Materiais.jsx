import React, { useState } from 'react';
import CardMaterial from '../components/CardMaterial';
import ModalNovoMaterial from '../components/ModalNovoMaterial';
import './Materiais.css';

export default function Materiais({ Materias, MateriaisEstudoIniciais, Usuario }) {
    const [filtroMateria, setFiltroMateria] = useState('todas');
    const [showModal, setShowModal] = useState(false);
    
    // We keep materials in state to allow adding new ones without a backend
    const [materiaisList, setMateriaisList] = useState(MateriaisEstudoIniciais);

    const materiaisFiltrados = materiaisList.filter(
        mat => filtroMateria === 'todas' || mat.materia === filtroMateria
    );

    const handleSaveNovoMaterial = (novoMaterial) => {
        const date = new Date();
        const dataFormatada = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        
        const materialParaSalvar = {
            id: materiaisList.length + 1,
            autor: Usuario.nome,
            data: dataFormatada,
            ...novoMaterial
        };

        // Add to the top of the list
        setMateriaisList([materialParaSalvar, ...materiaisList]);
        setShowModal(false);
    };

    return (
        <div className="page page-materiais">
            <div className="materiais-controls">
                <select 
                    className="select-filtro" 
                    style={{ margin: 0 }}
                    value={filtroMateria}
                    onChange={(e) => setFiltroMateria(e.target.value)}
                >
                    <option value="todas">Filtrar por matéria</option>
                    {Object.values(Materias).map((materia, index) => (
                        <option key={index} value={materia.nome}>{materia.nome}</option>
                    ))}
                </select>

                <button className="btn-novo-material" onClick={() => setShowModal(true)}>
                    + Publicar Material
                </button>
            </div>

            <div className="materiais-list">
                {materiaisFiltrados.length > 0 ? (
                    materiaisFiltrados.map(material => (
                        <CardMaterial key={material.id} material={material} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                        Nenhum material encontrado para esta matéria.
                    </p>
                )}
            </div>

            {showModal && (
                <ModalNovoMaterial 
                    Materias={Materias} 
                    onSave={handleSaveNovoMaterial} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    );
}