import { useState, useEffect } from 'react';
import './Cadastro.css';
import { apiGet, apiPost } from '../api/client';

// --- Subcomponents for Forms ---

function FormUsuario({ materias }) {
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

function FormProva({ materias }) {
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

function FormDuvida({ materias }) {
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

function FormMaterial({ materias }) {
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

// --- Main Page ---

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState('usuario');
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

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
         <p>Selecione uma entidade para adicionar ao sistema.</p>
       </div>
       
       <div className="cadastro-tabs">
          <button className={activeTab === 'usuario' ? 'active' : ''} onClick={() => setActiveTab('usuario')}>Usuários</button>
          <button className={activeTab === 'materia' ? 'active' : ''} onClick={() => setActiveTab('materia')}>Matérias</button>
          <button className={activeTab === 'prova' ? 'active' : ''} onClick={() => setActiveTab('prova')}>Provas</button>
          <button className={activeTab === 'duvida' ? 'active' : ''} onClick={() => setActiveTab('duvida')}>Dúvidas</button>
          <button className={activeTab === 'material' ? 'active' : ''} onClick={() => setActiveTab('material')}>Materiais</button>
       </div>
       
       <div className="cadastro-content">
          {loading ? (
             <p className="loading-text">Carregando dependências do sistema...</p>
          ) : (
             <>
               {activeTab === 'usuario' && <FormUsuario materias={materias} />}
               {activeTab === 'materia' && <FormMateria onMateriaAdded={fetchMaterias} />}
               {activeTab === 'prova' && <FormProva materias={materias} />}
               {activeTab === 'duvida' && <FormDuvida materias={materias} />}
               {activeTab === 'material' && <FormMaterial materias={materias} />}
             </>
          )}
       </div>
    </div>
  )
}
