import './Header.css'

export default function Header({ screen, setScreen, Usuario }) {
    const isDev = import.meta.env.DEV;

    return (
        <header className='glass-card'>
            {screen === 'inicio' && <h1>Inicio</h1>}
            {screen === 'horarios' && <h1>Horarios</h1>}
            {screen === 'duvidas' && <h1>Duvidas</h1>}
            {screen === 'materiais' && <h1>Materiais</h1>}
            {screen === 'chat' && <h1>Chat</h1>}
            {screen === 'cadastro' && <h1>Cadastros</h1>}
            {screen === 'perfil' && <h1>Perfil</h1>}
            <div className="header-actions">
                {isDev && (
                    <button 
                        className="admin-btn" 
                        onClick={() => setScreen('cadastro')}
                        title="Painel de Cadastros (Dev Only)"
                    >
                        ⚙️
                    </button>
                )}
                <button type="button" className="Usuario" onClick={() => setScreen('perfil')} title="Ver Perfil" aria-label="Ver Perfil">
                    {Usuario.fotoPerfil ? <img src="./Perfil.svg" alt="Perfil" /> : <p>{Usuario.nome[0] + Usuario.sobrenome[0]}</p>}
                </button>
            </div>
        </header>
    )
}