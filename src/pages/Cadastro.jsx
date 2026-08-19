import { useState, useEffect } from 'react';
import './Cadastro.css';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/client';

const DIAS_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

const truncate = (text, max = 60) =>
  typeof text === 'string' && text.length > max ? `${text.slice(0, max - 1)}…` : text;

// --- Visualização/exclusão genérica de uma coleção ---

function EntityList({ resource, columns, emptyLabel, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [listError, setListError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setListError('');
    try {
      const data = await apiGet(`/${resource}/`);
      setItems(data);
    } catch (err) {
      setListError(`Falha ao carregar registros: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchItems só faz setState depois do await, nunca de forma síncrona.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
    // fetchItems é recriada a cada render, mas só depende de `resource`, já listado abaixo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este registro? Essa ação não pode ser desfeita.')) return;
    setDeletingId(id);
    try {
      await apiDelete(`/${resource}/${id}`);
      setItems(prev => prev.filter(item => (item._id || item.id) !== id));
    } catch (err) {
      alert(`Falha ao excluir: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="entity-list">
      <div className="entity-list-header">
        <h4>Registros existentes {!loading && `(${items.length})`}</h4>
        <button type="button" className="btn-refresh" onClick={fetchItems} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {listError && <p className="form-msg error">{listError}</p>}

      {loading ? (
        <p className="loading-text">Carregando registros...</p>
      ) : items.length === 0 ? (
        <p className="warning-text">{emptyLabel || 'Nenhum registro encontrado.'}</p>
      ) : (
        <div className="entity-table-wrapper">
          <table className="entity-table">
            <thead>
              <tr>
                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                <th aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const id = item._id || item.id;
                return (
                  <tr key={id}>
                    {columns.map(col => (
                      <td key={col.key}>{col.render ? col.render(item) : (item[col.key] ?? '-')}</td>
                    ))}
                    <td>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDelete(id)}
                        disabled={deletingId === id}
                      >
                        {deletingId === id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- Subcomponents for Forms ---

function FormUsuario({ materias, onCreated }) {
  const [formData, setFormData] = useState({
    nome: '', sobrenome: '', curso: '', matricula: '', senha: '', materias: [], monitor: []
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMateriaChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData({ ...formData, materias: [...formData.materias, value] });
    } else {
      setFormData({ ...formData, materias: formData.materias.filter(m => m !== value) });
    }
  };

  const handleMonitorChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData({ ...formData, monitor: [...formData.monitor, value] });
    } else {
      setFormData({ ...formData, monitor: formData.monitor.filter(m => m !== value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      await apiPost('/usuarios/', formData);
      setMsg({ text: 'Usuário cadastrado com sucesso!', type: 'success' });
      setFormData({ nome: '', sobrenome: '', curso: '', matricula: '', senha: '', materias: [], monitor: [] });
      onCreated?.();
    } catch (err) {
      setMsg({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cadastro-form">
      <h3>Cadastrar Usuário</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Nome</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Sobrenome</label>
          <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Curso</label>
          <input type="text" name="curso" value={formData.curso} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Matrícula</label>
          <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
        </div>
      </div>
      
      <div className="form-group full-width">
        <label>Matérias (Selecione)</label>
        <div className="checkbox-grid">
          {materias.map(mat => (
            <label key={mat.codigo} className="checkbox-label">
              <input 
                type="checkbox" 
                value={mat.codigo} 
                checked={formData.materias.includes(mat.codigo)}
                onChange={handleMateriaChange}
              />
              {mat.codigo} - {mat.nome}
            </label>
          ))}
        </div>
        {materias.length === 0 && <p className="warning-text">Nenhuma matéria cadastrada no sistema. Cadastre matérias primeiro.</p>}
      </div>

      <div className="form-group full-width">
        <label>Monitor (Selecione as matérias que você é monitor)</label>
        <div className="checkbox-grid">
          {materias.map(mat => (
            <label key={`monitor-${mat.codigo}`} className="checkbox-label">
              <input 
                type="checkbox" 
                value={mat.codigo} 
                checked={formData.monitor.includes(mat.codigo)}
                onChange={handleMonitorChange}
              />
              {mat.codigo} - {mat.nome}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="submit-btn">Salvar Usuário</button>
      {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}

function FormMateria({ onMateriaAdded }) {
  const [formData, setFormData] = useState({ codigo: '', nome: '', monitoresStr: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    
    // Converte a string de matrículas separadas por vírgula em um array de strings
    const monitores = formData.monitoresStr
      ? formData.monitoresStr.split(',').map(m => m.trim()).filter(m => m !== '')
      : [];

    try {
      await apiPost('/materias/', {
        codigo: formData.codigo,
        nome: formData.nome,
        monitores: monitores,
        cronograma: []
      });
      setMsg({ text: 'Matéria cadastrada com sucesso!', type: 'success' });
      setFormData({ codigo: '', nome: '', monitoresStr: '' });
      onMateriaAdded();
    } catch (err) {
      setMsg({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cadastro-form">
      <h3>Cadastrar Matéria</h3>
      <div className="form-group full-width">
        <label>Código da Matéria (Ex: MAT032)</label>
        <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required />
      </div>
      <div className="form-group full-width">
        <label>Nome da Matéria (Ex: Cálculo A)</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
      </div>
      <div className="form-group full-width">
        <label>Monitores (Matrículas separadas por vírgula)</label>
        <input type="text" name="monitoresStr" value={formData.monitoresStr} onChange={handleChange} placeholder="Ex: 2021001, 2022005" />
      </div>
      <button type="submit" className="submit-btn">Salvar Matéria</button>
      {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}

// A API faz PUT com $set: mandar só "cronograma" substitui a lista inteira.
// Por isso buscamos a matéria atual e enviamos o array completo (existentes + novo).
function FormHorario({ materias, onCreated }) {
  const [formData, setFormData] = useState({ materia: '', dia_semana: 'SEG', horario: '', sala: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const materiaSelecionada = materias.find(m => m.codigo === formData.materia);
    if (!materiaSelecionada) {
      setMsg({ text: 'Selecione uma matéria válida.', type: 'error' });
      return;
    }

    setSaving(true);
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      const materiaId = materiaSelecionada._id || materiaSelecionada.id;
      const novoCronograma = [
        ...(materiaSelecionada.cronograma || []),
        { dia_semana: formData.dia_semana, horario: formData.horario, sala: formData.sala }
      ];
      await apiPut(`/materias/${materiaId}`, { cronograma: novoCronograma });
      setMsg({ text: 'Horário adicionado com sucesso!', type: 'success' });
      setFormData({ materia: formData.materia, dia_semana: 'SEG', horario: '', sala: '' });
      onCreated?.();
    } catch (err) {
      setMsg({ text: `Erro: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cadastro-form">
      <h3>Adicionar Horário a uma Matéria</h3>
      <div className="form-group full-width">
        <label>Matéria</label>
        <select name="materia" value={formData.materia} onChange={handleChange} required>
          <option value="">Selecione a matéria</option>
          {materias.map(mat => (
            <option key={mat.codigo} value={mat.codigo}>{mat.codigo} - {mat.nome}</option>
          ))}
        </select>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Dia da Semana</label>
          <select name="dia_semana" value={formData.dia_semana} onChange={handleChange} required>
            {DIAS_SEMANA.map(dia => <option key={dia} value={dia}>{dia}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Horário (Ex: 14:00 - 16:00)</label>
          <input type="text" name="horario" value={formData.horario} onChange={handleChange} placeholder="14:00 - 16:00" required />
        </div>
        <div className="form-group">
          <label>Sala</label>
          <input type="text" name="sala" value={formData.sala} onChange={handleChange} placeholder="Sala 1" required />
        </div>
      </div>
      <button type="submit" className="submit-btn" disabled={saving || materias.length === 0}>
        {saving ? 'Salvando...' : 'Adicionar Horário'}
      </button>
      {materias.length === 0 && <p className="warning-text">Cadastre uma matéria primeiro.</p>}
      {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}

function FormProva({ materias, onCreated }) {
  const [formData, setFormData] = useState({ nome: '', dia: '', horario: '', materia: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      await apiPost('/provas/', formData);
      setMsg({ text: 'Prova cadastrada com sucesso!', type: 'success' });
      setFormData({ nome: '', dia: '', horario: '', materia: '' });
      onCreated?.();
    } catch (err) {
      setMsg({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cadastro-form">
      <h3>Cadastrar Prova</h3>
      <div className="form-group full-width">
        <label>Matéria da Prova</label>
        <select name="materia" value={formData.materia} onChange={handleChange} required>
          <option value="">Selecione a matéria</option>
          {materias.map(mat => (
            <option key={mat.codigo} value={mat.codigo}>{mat.codigo} - {mat.nome}</option>
          ))}
        </select>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Nome da Prova (Ex: Prova 1)</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Data (YYYY-MM-DD)</label>
          <input type="date" name="dia" value={formData.dia} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Horário (Ex: 14:00 - 16:00)</label>
          <input type="text" name="horario" value={formData.horario} onChange={handleChange} required />
        </div>
      </div>
      <button type="submit" className="submit-btn">Salvar Prova</button>
      {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}

function FormDuvida({ materias, onCreated }) {
  const [formData, setFormData] = useState({ materia: '', horario: '', duvida: '', status: 'Aberta' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      await apiPost('/duvidas/', { ...formData, comentarios: [] });
      setMsg({ text: 'Dúvida cadastrada com sucesso!', type: 'success' });
      setFormData({ materia: '', horario: '', duvida: '', status: 'Aberta' });
      onCreated?.();
    } catch (err) {
      setMsg({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cadastro-form">
      <h3>Cadastrar Dúvida</h3>
      <div className="form-group full-width">
        <label>Matéria</label>
        <select name="materia" value={formData.materia} onChange={handleChange} required>
          <option value="">Selecione a matéria</option>
          {materias.map(mat => (
            <option key={mat.codigo} value={mat.codigo}>{mat.codigo} - {mat.nome}</option>
          ))}
        </select>
      </div>
      <div className="form-group full-width">
        <label>Dúvida</label>
        <textarea name="duvida" value={formData.duvida} onChange={handleChange} required rows="4"></textarea>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Data/Horário (Ex: 2026-07-12 10:00)</label>
          <input type="text" name="horario" value={formData.horario} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Aberta">Aberta</option>
            <option value="Resolvida">Resolvida</option>
          </select>
        </div>
      </div>
      <button type="submit" className="submit-btn">Salvar Dúvida</button>
      {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}

function FormMaterial({ materias, onCreated }) {
  const [formData, setFormData] = useState({ materia: '', autor: '', titulo: '', comentario: '', link: '', data: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      await apiPost('/materiais_estudo/', formData);
      setMsg({ text: 'Material cadastrado com sucesso!', type: 'success' });
      setFormData({ materia: '', autor: '', titulo: '', comentario: '', link: '', data: '' });
      onCreated?.();
    } catch (err) {
      setMsg({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cadastro-form">
      <h3>Cadastrar Material de Estudo</h3>
      <div className="form-group full-width">
        <label>Matéria</label>
        <select name="materia" value={formData.materia} onChange={handleChange} required>
          <option value="">Selecione a matéria</option>
          {materias.map(mat => (
            <option key={mat.codigo} value={mat.codigo}>{mat.codigo} - {mat.nome}</option>
          ))}
        </select>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Título do Material</label>
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Autor</label>
          <input type="text" name="autor" value={formData.autor} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Link (URL)</label>
          <input type="url" name="link" value={formData.link} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Data (YYYY-MM-DD)</label>
          <input type="date" name="data" value={formData.data} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group full-width">
        <label>Comentário / Descrição</label>
        <textarea name="comentario" value={formData.comentario} onChange={handleChange} required rows="3"></textarea>
      </div>
      <button type="submit" className="submit-btn">Salvar Material</button>
      {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}

const TABS = [
  { id: 'usuario', label: 'Usuários' },
  { id: 'materia', label: 'Matérias' },
  { id: 'prova', label: 'Provas' },
  { id: 'duvida', label: 'Dúvidas' },
  { id: 'material', label: 'Materiais' },
  { id: 'mensagem', label: 'Mensagens' },
];

const USUARIO_COLUMNS = [
  { key: 'nome', label: 'Nome', render: (u) => `${u.nome ?? ''} ${u.sobrenome ?? ''}`.trim() || '-' },
  { key: 'matricula', label: 'Matrícula' },
  { key: 'curso', label: 'Curso' },
  { key: 'materias', label: 'Matérias', render: (u) => u.materias?.join(', ') || '-' },
  { key: 'monitor', label: 'Monitor de', render: (u) => u.monitor?.join(', ') || '-' },
];

const MATERIA_COLUMNS = [
  { key: 'codigo', label: 'Código' },
  { key: 'nome', label: 'Nome' },
  { key: 'monitores', label: 'Monitores', render: (m) => m.monitores?.join(', ') || '-' },
  {
    key: 'cronograma',
    label: 'Aulas',
    render: (m) => m.cronograma?.length
      ? m.cronograma.map((c, i) => <div key={i}>{c.dia_semana} {c.horario} · {c.sala}</div>)
      : '-',
  },
];

const PROVA_COLUMNS = [
  { key: 'nome', label: 'Nome' },
  { key: 'materia', label: 'Matéria' },
  { key: 'dia', label: 'Data' },
  { key: 'horario', label: 'Horário' },
];

const DUVIDA_COLUMNS = [
  { key: 'materia', label: 'Matéria' },
  { key: 'duvida', label: 'Dúvida', render: (d) => truncate(d.duvida) },
  { key: 'status', label: 'Status', render: (d) => d.status || 'Pendente' },
  { key: 'horario', label: 'Horário' },
  { key: 'comentarios', label: 'Comentários', render: (d) => d.comentarios?.length ?? 0 },
];

const MATERIAL_COLUMNS = [
  { key: 'titulo', label: 'Título' },
  { key: 'materia', label: 'Matéria' },
  { key: 'autor', label: 'Autor' },
  { key: 'data', label: 'Data' },
  {
    key: 'link',
    label: 'Link',
    render: (m) => m.link
      ? <a href={m.link} target="_blank" rel="noopener noreferrer">Abrir</a>
      : '-',
  },
];

const MENSAGEM_COLUMNS = [
  { key: 'remetente', label: 'De' },
  { key: 'destinatario', label: 'Para' },
  { key: 'texto', label: 'Texto', render: (m) => truncate(m.texto) },
  { key: 'horario', label: 'Horário' },
];

// --- Main Page ---

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState('usuario');
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const bumpRefresh = () => setRefreshCounter(n => n + 1);

  const fetchMaterias = async () => {
    try {
      const data = await apiGet('/materias/');
      setMaterias(data);
    } catch (err) {
      console.error("Erro ao buscar materias", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchMaterias só faz setState depois do await (nunca de forma síncrona);
    // é reaproveitada aqui e como callback de recarregar após criar matéria.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMaterias();
  }, []);

  return (
    <div className="page cadastro-container">
       <div className="cadastro-header">
         <h2>Painel de Cadastros</h2>
         <p>Adicione, visualize e exclua registros diretamente no banco de dados.</p>
       </div>

       <div className="cadastro-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
       </div>

       <div className="cadastro-content">
          {loading ? (
             <p className="loading-text">Carregando dependências do sistema...</p>
          ) : (
             <>
               {activeTab === 'usuario' && (
                 <>
                   <FormUsuario materias={materias} onCreated={bumpRefresh} />
                   <p className="warning-text">
                     A API só permite que um usuário exclua a própria conta — excluir a de outra pessoa por aqui vai retornar erro de permissão.
                   </p>
                   <EntityList resource="usuarios" columns={USUARIO_COLUMNS} refreshKey={refreshCounter} emptyLabel="Nenhum usuário cadastrado." />
                 </>
               )}
               {activeTab === 'materia' && (
                 <>
                   <FormMateria onMateriaAdded={() => { fetchMaterias(); bumpRefresh(); }} />
                   <FormHorario materias={materias} onCreated={() => { fetchMaterias(); bumpRefresh(); }} />
                   <EntityList resource="materias" columns={MATERIA_COLUMNS} refreshKey={refreshCounter} emptyLabel="Nenhuma matéria cadastrada." />
                 </>
               )}
               {activeTab === 'prova' && (
                 <>
                   <FormProva materias={materias} onCreated={bumpRefresh} />
                   <EntityList resource="provas" columns={PROVA_COLUMNS} refreshKey={refreshCounter} emptyLabel="Nenhuma prova cadastrada." />
                 </>
               )}
               {activeTab === 'duvida' && (
                 <>
                   <FormDuvida materias={materias} onCreated={bumpRefresh} />
                   <EntityList resource="duvidas" columns={DUVIDA_COLUMNS} refreshKey={refreshCounter} emptyLabel="Nenhuma dúvida cadastrada." />
                 </>
               )}
               {activeTab === 'material' && (
                 <>
                   <FormMaterial materias={materias} onCreated={bumpRefresh} />
                   <EntityList resource="materiais_estudo" columns={MATERIAL_COLUMNS} refreshKey={refreshCounter} emptyLabel="Nenhum material cadastrado." />
                 </>
               )}
               {activeTab === 'mensagem' && (
                 <>
                   <h3>Mensagens</h3>
                   <p className="warning-text">Mensagens são criadas pelo chat do app — aqui dá só para visualizar e excluir.</p>
                   <EntityList resource="mensagens" columns={MENSAGEM_COLUMNS} refreshKey={refreshCounter} emptyLabel="Nenhuma mensagem enviada." />
                 </>
               )}
             </>
          )}
       </div>
    </div>
  )
}
