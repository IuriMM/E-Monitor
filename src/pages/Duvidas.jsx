import { useState, useMemo } from "react"
import CardDuvida from "../components/CardDuvida"
import DuvidaModal from "../components/DuvidaModal"
import { apiPost } from '../api/client'
import './Duvidas.css'

export default function Duvidas({ Usuario, Materias, ListaDuvidas = [], TodosUsuarios = [], onNewData }) {

    const materiaMap = useMemo(
        () => Object.fromEntries(Object.values(Materias).map(m => [m.codigo, m])),
        [Materias]
    )

    // Mapeia o "usuario" (id/matrícula gravado pela API a partir do JWT de
    // quem criou a dúvida) para um nome de exibição, indexando por todas as
    // chaves possíveis já que não sabemos ao certo qual identificador a API usa.
    const usuarioMap = useMemo(() => {
        const map = {}
        TodosUsuarios.forEach(u => {
            const nomeExibicao = `${u.nome ?? ''} ${u.sobrenome?.[0] ?? ''}.`.trim()
            if (u._id) map[u._id] = nomeExibicao
            if (u.id) map[u.id] = nomeExibicao
            if (u.matricula) map[u.matricula] = nomeExibicao
        })
        return map
    }, [TodosUsuarios])

    const nomeAutor = (duvidaItem) => usuarioMap[duvidaItem?.usuario] || 'Usuário'

    const [FiltroMateria, setFiltroMateria] = useState('todas')
    const [FiltroStatus, setFiltroStatus] = useState('todas')
    const [selectedDuvida, setSelectedDuvida] = useState(null)

    // Estados para nova dúvida
    const [novaDuvida, setNovaDuvida] = useState('')
    const [materiaDuvida, setMateriaDuvida] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!materiaDuvida || !novaDuvida) return;

        setIsSubmitting(true)
        
        const now = new Date();
        const dataStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().substring(0, 5);
        
        // "usuario" não é enviado: a API define o autor a partir do token JWT.
        const newDuvidaObj = {
            materia: materiaDuvida,
            horario: dataStr,
            duvida: novaDuvida,
            status: 'Pendente',
            comentarios: []
        }
        
        try {
            const created = await apiPost('/duvidas/', newDuvidaObj)
            setNovaDuvida('');
            setMateriaDuvida('');
            setShowForm(false);
            if (onNewData) onNewData('Duvida', created);
        } catch (err) {
            alert(`Falha ao enviar dúvida: ${err.message}`)
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
                <form className="form-nova-duvida" onSubmit={handleSubmit}>
                    <h3>Fazer uma Pergunta</h3>
                    <div className="form-group">
                        <select 
                            value={materiaDuvida} 
                            onChange={(e) => setMateriaDuvida(e.target.value)} 
                            required
                        >
                            <option value="">Selecione a matéria</option>
                            {Object.values(Materias).map((materia) => {
                                const text = `${materia.codigo} - ${materia.nome}`;
                                const shortText = text.length > 40 ? text.substring(0, 37) + '...' : text;
                                return <option key={materia.codigo} value={materia.codigo} title={text}>{shortText}</option>;
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
                    {Object.values(Materias).map((materia) => {
                        const text = `${materia.codigo} - ${materia.nome}`;
                        const shortText = text.length > 40 ? text.substring(0, 37) + '...' : text;
                        return <option key={materia.codigo} value={materia.codigo} title={text}>{shortText}</option>;
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
                {ListaDuvidas
                    .filter((duvidaItem) => FiltroMateria === 'todas' || duvidaItem.materia === FiltroMateria)
                    .filter((duvidaItem) => FiltroStatus === 'todas' || (duvidaItem.status && duvidaItem.status.toLowerCase() === FiltroStatus.toLowerCase()) || (!duvidaItem.status && FiltroStatus.toLowerCase() === 'pendente'))
                    .map((duvidaItem) => (
                    <div key={duvidaItem._id || duvidaItem.id} className="duvida">
                        <CardDuvida
                            NomeUsuario={nomeAutor(duvidaItem)}
                            NomeMateria={materiaMap[duvidaItem.materia]?.nome || duvidaItem.materia}
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
                    NomeUsuario={nomeAutor(selectedDuvida)}
                    UsuarioAtual={Usuario}
                    onClose={() => setSelectedDuvida(null)}
                    onComentarioAdicionado={(updatedDuvida) => {
                        if (onNewData) onNewData('DuvidaAtualizada', updatedDuvida);
                        setSelectedDuvida(updatedDuvida);
                    }}
                />
            )}
        </div>
    )
}