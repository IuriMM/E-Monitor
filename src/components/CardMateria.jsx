import './CardMateria.css'

export default function CardMateria({ Materia, Monitores, Horario, Sala }) {
    return (
        <div className="card-materia">
            <div className="card-materia-content">
                <div className="materia-header">
                    <h2>{Materia}</h2>
                    <span className="horario-badge">⏰ {Horario}</span>
                </div>
                <p className="monitor-name">Monitor(es): {Monitores}</p>
                <div className="sala-info">
                    <p>📍 {Sala}</p>
                </div>
            </div>
        </div>
    )
}