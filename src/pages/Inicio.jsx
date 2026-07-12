import Agenda from "../components/Agenda"

export default function Inicio({
    Usuario,
    Materias,
    Provas
}){
    return(
        <div className="page">
            <Agenda provas={Provas} materias={Materias} />
        </div>
    )
}