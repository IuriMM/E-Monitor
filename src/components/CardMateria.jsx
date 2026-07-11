import './CardMateria.css'

export default function CardMateria({ Materia, Monitores, Horario, Sala }) {

    return (
        <div className="card-container">
            <div className="top">
            <h2>{Materia}</h2>
            <p>{Monitores}</p>
            </div>
            <div className="bottom">
                <p>{Horario}</p>
                <p>{Sala}</p>
            </div>
        </div>
    )
}