import Agenda from "../components/Agenda"
import './Inicio.css'

export default function Inicio({
    Usuario,
    Materias,
    Provas,
    Mensagens,
    MateriaisEstudo,
    setScreen
}){
    // Calcular dia de hoje
    const diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const hojeIndex = new Date().getDay();
    const hojeStr = diasDaSemana[hojeIndex];

    // Monitorias de hoje
    let monitoriasHoje = [];
    Object.values(Materias).forEach(materia => {
        if(materia.cronograma) {
            materia.cronograma.forEach(cron => {
                if(cron.dia_semana === hojeStr) {
                    monitoriasHoje.push({
                        materia: materia.nome,
                        horario: cron.horario,
                        sala: cron.sala
                    });
                }
            })
        }
    });

    // Quantidade de conversas (chats)
    const totalConversas = Mensagens ? Object.keys(Mensagens).length : 0;
    
    // Quantidade de materiais
    const qtdMateriais = MateriaisEstudo ? MateriaisEstudo.length : 0;

    return(
        <div className="page inicio-page">
            <Agenda provas={Provas} materias={Materias} />
            <div className="notifications-container">
                <h2 className="section-title">Olá, {Usuario.nome}! 👋</h2>
                
                <div className="dashboard-section">
                    <div className="dashboard-header">
                        <h3>Monitorias Hoje ({hojeStr})</h3>
                    </div>
                    {monitoriasHoje.length > 0 ? (
                        <div className="monitorias-timeline">
                            {monitoriasHoje.map((mon) => (
                                <div key={`${mon.materia}-${mon.horario}-${mon.sala}`} className="timeline-item">
                                    <div className="timeline-time">{mon.horario}</div>
                                    <div className="timeline-content">
                                        <h4>{mon.materia}</h4>
                                        <p>📍 {mon.sala}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-card">
                            <p>Sem monitorias agendadas para hoje. Aproveite para estudar!</p>
                        </div>
                    )}
                </div>

                <div className="notifications-grid">
                    <div className="notification-card clickable" onClick={() => setScreen('chat')}>
                        <div className="notification-icon chat-icon">
                            💬
                        </div>
                        <div className="notification-content">
                            <h3>Mensagens</h3>
                            <p>{totalConversas > 0 ? `${totalConversas} conversa(s) ativa(s)` : 'Nenhuma conversa recente'}</p>
                        </div>
                    </div>

                    <div className="notification-card clickable" onClick={() => setScreen('materiais')}>
                        <div className="notification-icon materiais-icon">
                            📚
                        </div>
                        <div className="notification-content">
                            <h3>Materiais</h3>
                            <p>{qtdMateriais > 0 ? `${qtdMateriais} arquivos disponíveis` : 'Nenhum material adicionado'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}