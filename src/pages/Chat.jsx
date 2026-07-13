import { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import './Chat.css';

export default function Chat({ Materias, Mensagens, Usuario, apiUrl, onNewData }) {
    const [filtroMateria, setFiltroMateria] = useState('todas');
    const [selectedMonitor, setSelectedMonitor] = useState(null);
    const [nomesMonitores, setNomesMonitores] = useState({});

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await fetch(`${apiUrl}/usuarios/`);
                if (res.ok) {
                    const data = await res.json();
                    const mapa = {};
                    data.forEach(user => {
                        mapa[user.matricula] = user.nome;
                    });
                    setNomesMonitores(mapa);
                }
            } catch (err) {
                console.error("Erro ao buscar usuários para o chat:", err);
            }
        };
        fetchUsuarios();
    }, [apiUrl]);

    // Flatten monitors from all Materias
    const monitoresDisponiveis = [];
    Object.values(Materias).forEach(materia => {
        if (materia.monitores) {
            materia.monitores.forEach(monitor => {
                const nomeExibicao = nomesMonitores[monitor] || monitor;
                monitoresDisponiveis.push({
                    matricula: monitor,
                    nome: nomeExibicao,
                    materiaNome: materia.nome
                });
            });
        }
    });

    const monitoresFiltrados = monitoresDisponiveis.filter(
        m => filtroMateria === 'todas' || m.materiaNome === filtroMateria
    );

    return (
        <div className="page chat-page">
            {!selectedMonitor ? (
                <>
                    <div className="filtros-container">
                        <select 
                            className="select-filtro" 
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
                    </div>

                    <div className="chat-contact-list">
                        {monitoresFiltrados.map((monitor, index) => (
                            <div 
                                key={index} 
                                className="chat-contact-card"
                                onClick={() => setSelectedMonitor(monitor)}
                            >
                                <div className="contact-avatar">
                                    {monitor.nome.charAt(0)}
                                </div>
                                <div className="contact-info">
                                    <h3>{monitor.nome}</h3>
                                    <p>{monitor.materiaNome}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <ChatWindow 
                    monitor={selectedMonitor} 
                    mensagensIniciais={Mensagens[selectedMonitor.nome] || []}
                    usuarioAtual={Usuario}
                    onBack={() => setSelectedMonitor(null)}
                    apiUrl={apiUrl}
                    onNewData={onNewData}
                />
            )}
        </div>
    );
}