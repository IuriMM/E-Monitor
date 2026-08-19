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
                <h2 className="section-title">Bem-vindo, {Usuario.nome}!</h2>
                
                <div className="notifications-grid">
                    <div className="notification-card clickable" onClick={() => setScreen('chat')}>
                        <div className="notification-icon chat-icon">
                            <img src="/chat.svg" alt="Chat" />
                        </div>
                        <div className="notification-content">
                            <h3>Chat</h3>
                            <p>{totalConversas > 0 ? `Você tem ${totalConversas} conversa(s) ativa(s).` : 'Nenhuma conversa recente.'}</p>
                        </div>
                    </div>

                    <div className="notification-card clickable" onClick={() => setScreen('materiais')}>
                        <div className="notification-icon materiais-icon">
                            <img src="/book.svg" alt="Materiais" />
                        </div>
                        <div className="notification-content">
                            <h3>Materiais</h3>
                            <p>{qtdMateriais > 0 ? `${qtdMateriais} material(is) de estudo disponível(is).` : 'Nenhum material adicionado.'}</p>
                        </div>
                    </div>

                    <div className="notification-card clickable" onClick={() => setScreen('horarios')}>
                        <div className="notification-icon monitoria-icon">
                            <img src="/monitor.svg" alt="Monitoria" />
                        </div>
                        <div className="notification-content">
                            <h3>Monitorias Hoje ({hojeStr})</h3>
                            {monitoriasHoje.length > 0 ? (
                                <ul className="monitorias-lista">
                                    {monitoriasHoje.map((mon) => (
                                        <li key={`${mon.materia}-${mon.horario}-${mon.sala}`}><strong>{mon.materia}</strong>: {mon.horario}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Sem monitorias agendadas hoje.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}