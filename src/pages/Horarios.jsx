import './Horarios.css'
import { useState } from 'react'
import CardMateria from '../components/CardMateria.jsx'

export default function Horarios({Materias}){
    const dias_da_semana = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
    const [dia, setDia] = useState('SEG')

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
                {Object.keys(Materias).map(codigo => {
                    const materia = Materias[codigo];
                    // Filtra as aulas do cronograma que caem no dia selecionado
                    const aulasNoDia = materia.cronograma.filter(aula => aula.dia_semana === dia);

                    // Para cada aula no dia, renderiza um card
                    return aulasNoDia.map((aula, index) => (
                        <CardMateria 
                            key={`${codigo}-${index}`}
                            Materia={materia.nome} 
                            Monitores={materia.monitores.join(', ')} 
                            Horario={aula.horario} 
                            Sala={aula.sala} 
                        />
                    ));
                })}
            </div>
        </div>
    )
}