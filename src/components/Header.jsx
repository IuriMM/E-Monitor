import './Header.css'

export default function Header({ screen, Usuario }) {
    return (
        <header>
            {screen === 'inicio' && <h1>Inicio</h1>}
            {screen === 'horarios' && <h1>Horarios</h1>}
            {screen === 'duvidas' && <h1>Duvidas</h1>}
            {screen === 'materiais' && <h1>Materiais</h1>}
            {screen === 'chat' && <h1>Chat</h1>}
            <div className="Usuario">
                {Usuario.fotoPerfil ? <img src="./Perfil.svg" alt="Perfil" /> : <p>{Usuario.nome[0] + Usuario.sobrenome[0]}</p>}
            </div>
        </header>
    )
}