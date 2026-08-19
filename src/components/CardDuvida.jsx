import './CardDuvida.css'

export default function CardDuvida({ NomeUsuario, NomeMateria, horario, duvida, StatusDuvida, onClick }) {

    return (
        <div className="card-duvida" onClick={onClick}>
            <div className="duvida-status-badge">
                {StatusDuvida}
            </div>
            <div className="duvida-header">
                <div className="duvida-info">
                    <h2>{NomeUsuario}</h2>
                    <p className="duvida-materia">{NomeMateria}</p>
                </div>
                <span className="duvida-horario">{horario}</span>
            </div>
            <div className="duvida-content">
                <p className="duvida-texto">{duvida}</p>
            </div>
        </div>
    )
}