import React, { useState, useEffect } from 'react';
import './Cadastro.css';

// --- Subcomponents for Forms ---

function FormUsuario({ apiUrl, materias }) {
  const [formData, setFormData] = useState({
    nome: '', sobrenome: '', curso: '', matricula: '', senha: '', materias: []
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      const res = await fetch(`${apiUrl}/usuarios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMsg({ text: 'Usuário cadastrado com sucesso!', type: 'success' });
        setFormData({ nome: '', sobrenome: '', curso: '', matricula: '', senha: '', materias: [] });
      } else {
        const error = await res.json();
        setMsg({ text: `Erro: ${error.detail || 'Falha ao cadastrar'}`, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: `Erro de conexão: ${err.message}`, type: 'error' });
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

      <button type="submit" className="submit-btn">Salvar Usuário</button>
      {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}

function FormMateria({ apiUrl, onMateriaAdded }) {
  const [formData, setFormData] = useState({ codigo: '', nome: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      const res = await fetch(`${apiUrl}/materias/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, monitores: [], cronograma: [] })
      });
      if (res.ok) {
        setMsg({ text: 'Matéria cadastrada com sucesso!', type: 'success' });
        setFormData({ codigo: '', nome: '' });
        onMateriaAdded();
      } else {
        const error = await res.json();
        setMsg({ text: `Erro: ${error.detail || 'Falha ao cadastrar'}`, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: `Erro de conexão: ${err.message}`, type: 'error' });
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
      <button type="submit" className="submit-btn">Salvar Matéria</button>
      {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}

function FormProva({ apiUrl, materias }) {
  const [formData, setFormData] = useState({ nome: '', dia: '', horario: '', materia: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      const res = await fetch(`${apiUrl}/provas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMsg({ text: 'Prova cadastrada com sucesso!', type: 'success' });
        setFormData({ nome: '', dia: '', horario: '', materia: '' });
      } else {
        const error = await res.json();
        setMsg({ text: `Erro: ${error.detail || 'Falha ao cadastrar'}`, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: `Erro de conexão: ${err.message}`, type: 'error' });
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

function FormDuvida({ apiUrl, materias }) {
  const [formData, setFormData] = useState({ materia: '', horario: '', duvida: '', status: 'Aberta' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      const res = await fetch(`${apiUrl}/duvidas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, comentarios: []})
      });
      if (res.ok) {
        setMsg({ text: 'Dúvida cadastrada com sucesso!', type: 'success' });
        setFormData({ materia: '', horario: '', duvida: '', status: 'Aberta' });
      } else {
        const error = await res.json();
        setMsg({ text: `Erro: ${error.detail || 'Falha ao cadastrar'}`, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: `Erro de conexão: ${err.message}`, type: 'error' });
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

function FormMaterial({ apiUrl, materias }) {
  const [formData, setFormData] = useState({ materia: '', autor: '', titulo: '', comentario: '', link: '', data: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Salvando...', type: 'info' });
    try {
      const res = await fetch(`${apiUrl}/materiais_estudo/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMsg({ text: 'Material cadastrado com sucesso!', type: 'success' });
        setFormData({ materia: '', autor: '', titulo: '', comentario: '', link: '', data: '' });
      } else {
        const error = await res.json();
        setMsg({ text: `Erro: ${error.detail || 'Falha ao cadastrar'}`, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: `Erro de conexão: ${err.message}`, type: 'error' });
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

export default function Cadastro({ apiUrl }) {
  const [activeTab, setActiveTab] = useState('usuario');
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterias = async () => {
    try {
      const res = await fetch(`${apiUrl}/materias/`);
      if (res.ok) {
        const data = await res.json();
        setMaterias(data);
      }
    } catch (err) {
      console.error("Erro ao buscar materias", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterias();
  }, [apiUrl]);

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
               {activeTab === 'usuario' && <FormUsuario apiUrl={apiUrl} materias={materias} />}
               {activeTab === 'materia' && <FormMateria apiUrl={apiUrl} onMateriaAdded={fetchMaterias} />}
               {activeTab === 'prova' && <FormProva apiUrl={apiUrl} materias={materias} />}
               {activeTab === 'duvida' && <FormDuvida apiUrl={apiUrl} materias={materias} />}
               {activeTab === 'material' && <FormMaterial apiUrl={apiUrl} materias={materias} />}
             </>
          )}
       </div>
    </div>
  )
}
