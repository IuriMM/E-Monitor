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
            <img className={screen === 'inicio' ? 'ativo' : ''} src={Casa} alt="Casa" onClick={() => handleScreenChange('inicio')}/>
            <img className={screen === 'duvidas' ? 'ativo' : ''} src={Carta} alt="Carta" onClick={() => handleScreenChange('duvidas')}/>
            <img className={screen === 'chat' ? 'ativo' : ''} src={Mensagem} alt="Mensagem" onClick={() => handleScreenChange('chat')}/>
            <img className={screen === 'horarios' ? 'ativo' : ''} src={Relogio} alt="Relogio" onClick={() => handleScreenChange('horarios')}/>
            <img className={screen === 'materiais' ? 'ativo' : ''} src={Caderno} alt="Caderno" onClick={() => handleScreenChange('materiais')}/>
        </div>
    )
}