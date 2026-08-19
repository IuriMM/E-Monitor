import { useState, useMemo } from 'react';
import CardMaterial from '../components/CardMaterial';
import ModalNovoMaterial from '../components/ModalNovoMaterial';
import { apiPost } from '../api/client';
import './Materiais.css';

export default function Materiais({ Materias, MateriaisEstudoIniciais, Usuario, onNewData }) {
    const [filtroMateria, setFiltroMateria] = useState('todas');
    const [showModal, setShowModal] = useState(false);

    // We keep materials in state to allow adding new ones without a backend
    const [materiaisList, setMateriaisList] = useState(MateriaisEstudoIniciais);

    const materiaMap = useMemo(
        () => Object.fromEntries(Object.values(Materias).map(m => [m.codigo, m])),
        [Materias]
    )

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
            const createdMaterial = await apiPost('/materiais_estudo/', materialParaSalvar);
            setMateriaisList([createdMaterial, ...materiaisList]);
            setShowModal(false);
            if (onNewData) onNewData('Material', createdMaterial);
        } catch (err) {
            alert(`Falha ao publicar material: ${err.message}`);
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
                        return <option key={index} value={materia.codigo} title={text}>{shortText}</option>;
                    })}
                </select>

                <button className="btn-novo-material" onClick={() => setShowModal(true)}>
                    + Publicar Material
                </button>
            </div>

            <div className="materiais-list">
                {materiaisFiltrados.length > 0 ? (
                    materiaisFiltrados.map((material, index) => {
                        const nomeMateria = materiaMap[material.materia]?.nome || material.materia;
                        return <CardMaterial key={material.id || material._id || index} material={material} NomeMateria={nomeMateria} />
                    })
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