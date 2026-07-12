import { useState } from "react"
import CardDuvida from "../components/CardDuvida"
import './Duvidas.css'

export default function Duvidas({ Usuario, Materias, ListaDuvidas = [] }) {

    const [FiltroMateria, setFiltroMateria] = useState('todas')
    const [FiltroStatus, setFiltroStatus] = useState('todas')
    const [FiltroData, setFiltroData] = useState('todas')

    return (
        <div className="page">
            <select className="select-filtro" name="filtro-materia" id="filtro-materia" onChange={(e) => setFiltroMateria(e.target.value)}>
                <option value="todas">Filtrar por matéria</option>
                {Object.values(Materias).map((materia, index) => (
                    <option key={index} value={materia.nome}>{materia.nome}</option>
                ))}
            </select>
            <select className="select-filtro" name="filtro-status" id="filtro-status" onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="todas">Filtrar por status</option>
                <option value="pendente">Pendente</option>
                <option value="respondida">Respondida</option>
                <option value="em-andamento">Em Andamento</option>
            </select>
            <div className="duvidas-list">
                {ListaDuvidas.filter((duvidaItem) => FiltroMateria === 'todas' || duvidaItem.materia === FiltroMateria).map((duvidaItem, index) => (
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