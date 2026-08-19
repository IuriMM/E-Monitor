import Casa from '/Casa.svg';
import Carta from '/Carta.svg'
import Mensagem from '/Mensagem.svg'
import Relogio from '/Relogio.svg'
import Caderno from '/Caderno.svg'
import './TabBar.css'

export default function TabBar({screen, setScreen}) {

    const handleScreenChange = (screen) => {
        setScreen(screen)
    }

    return (
        <div className="tab-bar">
            <button type="button" className={`tab-btn ${screen === 'inicio' ? 'ativo' : ''}`} onClick={() => handleScreenChange('inicio')} aria-label="Início">
                <img src={Casa} alt="Casa" />
            </button>
            <button type="button" className={`tab-btn ${screen === 'duvidas' ? 'ativo' : ''}`} onClick={() => handleScreenChange('duvidas')} aria-label="Dúvidas">
                <img src={Carta} alt="Carta" />
            </button>
            <button type="button" className={`tab-btn ${screen === 'chat' ? 'ativo' : ''}`} onClick={() => handleScreenChange('chat')} aria-label="Chat">
                <img src={Mensagem} alt="Mensagem" />
            </button>
            <button type="button" className={`tab-btn ${screen === 'horarios' ? 'ativo' : ''}`} onClick={() => handleScreenChange('horarios')} aria-label="Horários">
                <img src={Relogio} alt="Relógio" />
            </button>
            <button type="button" className={`tab-btn ${screen === 'materiais' ? 'ativo' : ''}`} onClick={() => handleScreenChange('materiais')} aria-label="Materiais">
                <img src={Caderno} alt="Caderno" />
            </button>
        </div>
    )
}