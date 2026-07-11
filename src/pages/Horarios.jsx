import './Horarios.css'
import { useState } from 'react'
import CardMateria from '../components/CardMateria.jsx'

export default function Horarios({Materias}){
    const dias_da_semana = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
    const [dia, setDia] = useState('SEG')

    const cardsDoDia = Object.keys(Materias).flatMap(codigo => {
        const materia = Materias[codigo];
        const aulasNoDia = materia.cronograma.filter(aula => aula.dia_semana === dia);

        return aulasNoDia.map((aula, index) => (
            <CardMateria 
                key={`${codigo}-${index}`}
                Materia={materia.nome} 
                Monitores={materia.monitores.join(', ')} 
                Horario={aula.horario} 
                Sala={aula.sala} 
            />
        ));
    });

    return(
        <div className="page">
            <div className="barra-dias">
                {dias_da_semana.map(dia_da_semana => {
                    return(
                        <p key={dia_da_semana} className={dia == dia_da_semana ? 'active' : ''} onClick={() => setDia(dia_da_semana)}>{dia_da_semana}</p>
                    )
                })}
            </div>
            <div className="materias-container">
                {cardsDoDia.length > 0 ? (
                    cardsDoDia
                ) : (
                    <div className="sem-aula">
                        <p>Dia sem aula</p>
                    </div>
                )}
            </div>
        </div>
    )
}