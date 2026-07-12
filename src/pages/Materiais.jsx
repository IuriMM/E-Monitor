import React, { useState } from 'react';
import CardMaterial from '../components/CardMaterial';
import ModalNovoMaterial from '../components/ModalNovoMaterial';
import './Materiais.css';

export default function Materiais({ Materias, MateriaisEstudoIniciais, Usuario, apiUrl, onNewData }) {
    const [filtroMateria, setFiltroMateria] = useState('todas');
    const [showModal, setShowModal] = useState(false);
    
    // We keep materials in state to allow adding new ones without a backend
    const [materiaisList, setMateriaisList] = useState(MateriaisEstudoIniciais);

    const materiaisFiltrados = materiaisList.filter(
        mat => filtroMateria === 'todas' || mat.materia === filtroMateria
    );

    const handleSaveNovoMaterial = async (novoMaterial) => {
        const date = new Date();
        const dataFormatada = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        
        const materialParaSalvar = {
            autor: Usuario.nome,
            data: dataFormatada,
            ...novoMaterial
        };

        try {
            const res = await fetch(`${apiUrl}/materiais_estudo/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(materialParaSalvar)
            });

            if (res.ok) {
                const createdMaterial = await res.json();
                setMateriaisList([createdMaterial, ...materiaisList]);
                setShowModal(false);
                if (onNewData) onNewData('Material', createdMaterial);
            } else {
                alert('Falha ao publicar material.');
            }
        } catch (err) {
            alert('Erro de conexão ao publicar material.');
        }
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
                    {Object.values(Materias).map((materia, index) => {
                        const text = materia.nome;
                        const shortText = text.length > 40 ? text.substring(0, 37) + '...' : text;
                        return <option key={index} value={materia.nome} title={text}>{shortText}</option>;
                    })}
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