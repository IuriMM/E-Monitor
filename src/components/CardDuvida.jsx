import './CardDuvida.css'

export default function CardDuvida({ NomeUsuario, NomeMateria, horario, duvida, StatusDuvida }) {

    return (
        <>
            <div className="card-duvida">
                <p>{StatusDuvida}</p>
                <div className="duvida-header">
                    <div className="duvida-info">
                        <h2>{NomeUsuario}</h2>
                        <p>{NomeMateria}</p>
                    </div>
                    <p>{horario}</p>
                </div>
                <div className="duvida-content">
                    <p>{duvida}</p>
                </div>
            </div>
        </>
    )
}