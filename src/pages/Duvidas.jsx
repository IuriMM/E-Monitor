import { useState, useEffect } from "react"
import CardDuvida from "../components/CardDuvida"
import DuvidaModal from "../components/DuvidaModal"
import './Duvidas.css'

export default function Duvidas({ Usuario, Materias, ListaDuvidas = [], apiUrl, onNewData }) {

    const [FiltroMateria, setFiltroMateria] = useState('todas')
    const [FiltroStatus, setFiltroStatus] = useState('todas')
    const [selectedDuvida, setSelectedDuvida] = useState(null)
    
    // Estados para nova dúvida
    const [localDuvidas, setLocalDuvidas] = useState(ListaDuvidas)
    const [novaDuvida, setNovaDuvida] = useState('')
    const [materiaDuvida, setMateriaDuvida] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        setLocalDuvidas(ListaDuvidas)
    }, [ListaDuvidas])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!materiaDuvida || !novaDuvida) return;

        setIsSubmitting(true)
        
        const now = new Date();
        const dataStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().substring(0, 5);
        
        const newDuvidaObj = {
            materia: materiaDuvida,
            horario: dataStr,
            duvida: novaDuvida,
            status: 'Pendente',
            usuario: Usuario._id || Usuario.id,
            comentarios: []
        }
        
        try {
            const res = await fetch(`${apiUrl}/duvidas/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDuvidaObj)
            })
            if (res.ok) {
                const created = await res.json();
                setLocalDuvidas([created, ...localDuvidas]);
                setNovaDuvida('');
                setMateriaDuvida('');
                setShowForm(false);
                if (onNewData) onNewData('Duvida', created);
            } else {
                alert('Falha ao enviar dúvida.')
            }
        } catch (err) {
            alert('Erro de conexão.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="page duvidas-page">
            <div className="duvidas-header-actions">
                <button className="btn-nova-duvida" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancelar' : '+ Nova Dúvida'}
                </button>
            </div>

            {showForm && (
                <form className="form-nova-duvida glass-card" onSubmit={handleSubmit}>
                    <h3>Fazer uma Pergunta</h3>
                    <div className="form-group">
                        <select 
                            value={materiaDuvida} 
                            onChange={(e) => setMateriaDuvida(e.target.value)} 
                            required
                        >
                            <option value="">Selecione a matéria</option>
                            {Object.values(Materias).map((materia, index) => {
                                const text = `${materia.codigo} - ${materia.nome}`;
                                const shortText = text.length > 40 ? text.substring(0, 37) + '...' : text;
                                return <option key={index} value={materia.codigo} title={text}>{shortText}</option>;
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <textarea 
                            placeholder="Escreva sua dúvida aqui..." 
                            value={novaDuvida}
                            onChange={(e) => setNovaDuvida(e.target.value)}
                            required
                            rows="3"
                        ></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-enviar">
                        {isSubmitting ? 'Enviando...' : 'Enviar Dúvida'}
                    </button>
                </form>
            )}

            <div className="filtros-container">
                <select className="select-filtro" name="filtro-materia" id="filtro-materia" onChange={(e) => setFiltroMateria(e.target.value)}>
                    <option value="todas">Filtrar por matéria</option>
                    {Object.values(Materias).map((materia, index) => {
                        const text = `${materia.codigo} - ${materia.nome}`;
                        const shortText = text.length > 40 ? text.substring(0, 37) + '...' : text;
                        return <option key={index} value={materia.codigo} title={text}>{shortText}</option>;
                    })}
                </select>
                <select className="select-filtro" name="filtro-status" id="filtro-status" onChange={(e) => setFiltroStatus(e.target.value)}>
                    <option value="todas">Filtrar por status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Respondida">Respondida</option>
                    <option value="Aberta">Aberta</option>
                </select>
            </div>

            <div className="duvidas-list">
                {localDuvidas
                    .filter((duvidaItem) => FiltroMateria === 'todas' || duvidaItem.materia === FiltroMateria)
                    .filter((duvidaItem) => FiltroStatus === 'todas' || (duvidaItem.status && duvidaItem.status.toLowerCase() === FiltroStatus.toLowerCase()) || (!duvidaItem.status && FiltroStatus.toLowerCase() === 'pendente'))
                    .map((duvidaItem, index) => (
                    <div key={index} className="duvida">
                        <CardDuvida
                            NomeUsuario={Usuario.nome + ' ' + Usuario.sobrenome[0] + '.'}
                            NomeMateria={Object.values(Materias).find(m => m.codigo === duvidaItem.materia)?.nome || duvidaItem.materia}
                            horario={duvidaItem.horario}
                            duvida={duvidaItem.duvida}
                            StatusDuvida={duvidaItem.status || 'Pendente'}
                            onClick={() => setSelectedDuvida(duvidaItem)}
                        />
                    </div>
                ))}
            </div>

            {selectedDuvida && (
                <DuvidaModal 
                    duvida={selectedDuvida} 
                    NomeUsuario={Usuario.nome + ' ' + Usuario.sobrenome[0] + '.'}
                    onClose={() => setSelectedDuvida(null)} 
                />
            )}
        </div>
    )
}