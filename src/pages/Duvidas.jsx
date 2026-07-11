import { useState } from "react"
import CardDuvida from "../components/CardDuvida"
import './Duvidas.css'

export default function Duvidas({ Usuario, Materias }) {

    const [FiltroMateria, setFiltroMateria] = useState('todas')

    return (
        <div className="page">
            <select className="select-filtro" name="filtro-materia" id="filtro-materia" onChange={(e) => setFiltroMateria(e.target.value)}>
                <option value="todas">Filtrar por matéria</option>
                {Object.values(Materias).map((materia, index) => (
                    <option key={index} value={materia.nome}>{materia.nome}</option>
                ))}
            </select>
            <div className="duvidas-list">
                {Usuario.duvidas.filter((duvidaItem) => FiltroMateria === 'todas' || duvidaItem.materia === FiltroMateria).map((duvidaItem, index) => (
                    <div key={index} className="duvida">
                        <CardDuvida
                            NomeUsuario={Usuario.nome + ' ' + Usuario.sobrenome[0] + '.'}
                            NomeMateria={duvidaItem.materia}
                            horario={duvidaItem.horario}
                            duvida={duvidaItem.duvida}
                            StatusDuvida={duvidaItem.status || 'Pendente'}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}