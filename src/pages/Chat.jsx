import { useState, useMemo } from 'react';
import ChatWindow from '../components/ChatWindow';
import './Chat.css';

export default function Chat({ Materias, Mensagens, Usuario, TodosUsuarios = [], onNewData }) {
    const [filtroMateria, setFiltroMateria] = useState('todas');
    const [selectedMonitor, setSelectedMonitor] = useState(null);

    const nomesMonitores = useMemo(() => {
        const mapa = {};
        TodosUsuarios.forEach(user => {
            mapa[user.matricula] = user.nome;
        });
        return mapa;
    }, [TodosUsuarios]);

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
                            {Object.values(Materias).map((materia) => {
                                const text = materia.nome;
                                const shortText = text.length > 40 ? text.substring(0, 37) + '...' : text;
                                return <option key={materia.codigo} value={materia.nome} title={text}>{shortText}</option>;
                            })}
                        </select>
                    </div>

                    <div className="chat-contact-list">
                        {monitoresFiltrados.length > 0 ? (
                            monitoresFiltrados.map((monitor) => {
                                const msgs = Mensagens[monitor.nome] || [];
                                const ultimaMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

                                return (
                                    <div
                                        key={`${monitor.matricula}-${monitor.materiaNome}`}
                                        className="chat-contact-card"
                                        onClick={() => setSelectedMonitor(monitor)}
                                    >
                                        <div className="contact-avatar">
                                            {monitor.nome.charAt(0)}
                                        </div>
                                        <div className="contact-info">
                                            <div className="contact-info-header">
                                                <h3>{monitor.nome}</h3>
                                                {ultimaMsg && <span className="msg-time">{ultimaMsg.horario}</span>}
                                            </div>
                                            <p className="materia-badge">{monitor.materiaNome}</p>
                                            {ultimaMsg ? (
                                                <p className="last-msg-preview">
                                                    {ultimaMsg.remetente === Usuario.nome ? 'Você: ' : ''}
                                                    {ultimaMsg.texto}
                                                </p>
                                            ) : (
                                                <p className="last-msg-preview empty-msg">Nenhuma mensagem ainda</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                                <p>Nenhum monitor encontrado para o filtro atual.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <ChatWindow
                    monitor={selectedMonitor}
                    mensagensIniciais={Mensagens[selectedMonitor.nome] || []}
                    usuarioAtual={Usuario}
                    onBack={() => setSelectedMonitor(null)}
                    onNewData={onNewData}
                />
            )}
        </div>
    );
}