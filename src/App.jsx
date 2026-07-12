import { useState, useEffect } from 'react'
import './App.css'
import TabBar from './components/TabBar'
import Inicio from './pages/Inicio'
import Horarios from './pages/Horarios'
import Duvidas from './pages/Duvidas'
import Materiais from './pages/Materiais'
import Chat from './pages/Chat'
import Header from './components/Header'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Perfil from './pages/Perfil'

const API_BASE_URL = 'https://e-monitorwebapi.onrender.com/api';

function App() {
  const [screen, setScreen] = useState('horarios')
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  
  const [data, setData] = useState({
    Materias: {},
    Usuarios: null,
    Provas: [],
    Duvidas: [],
    Mensagens: {},
    MateriaisEstudo: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuarioLogado) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Dispara requisições simultâneas (não precisamos buscar usuarios pois já temos o logado)
        const [
          resMaterias,
          resProvas,
          resDuvidas,
          resMensagens,
          resMateriais
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/materias/`),
          fetch(`${API_BASE_URL}/provas/`),
          fetch(`${API_BASE_URL}/duvidas/`),
          fetch(`${API_BASE_URL}/mensagens/`),
          fetch(`${API_BASE_URL}/materiais_estudo/`)
        ]);

        if (!resMaterias.ok || !resProvas.ok || !resDuvidas.ok || !resMensagens.ok || !resMateriais.ok) {
          throw new Error('Falha ao obter os dados da API.');
        }

        const [
          materiasList,
          provasList,
          duvidasList,
          mensagensList,
          materiaisList
        ] = await Promise.all([
          resMaterias.json(),
          resProvas.json(),
          resDuvidas.json(),
          resMensagens.json(),
          resMateriais.json()
        ]);

        const materiasUsuario = usuarioLogado.materias || [];
        const nomeUsuario = usuarioLogado.nome;

        // Formata Materias (Filtra apenas as que o usuário possui)
        const formatMaterias = {};
        materiasList.forEach(materia => {
          if (materiasUsuario.includes(materia.codigo)) {
            formatMaterias[materia.codigo] = materia;
          }
        });

        // Filtra Provas, Duvidas e Materiais pelas matérias do usuário
        const provasFiltradas = provasList.filter(p => materiasUsuario.includes(p.materia));
        const duvidasFiltradas = duvidasList.filter(d => materiasUsuario.includes(d.materia));
        const materiaisFiltrados = materiaisList.filter(m => materiasUsuario.includes(m.materia));

        // Formata Mensagens (Filtra apenas as enviadas/recebidas pelo usuário atual)
        const formatMensagens = {};
        mensagensList.forEach(msg => {
          if (msg.remetente === nomeUsuario || msg.destinatario === nomeUsuario) {
            const interlocutor = msg.remetente !== nomeUsuario ? msg.remetente : msg.destinatario;
            if (!formatMensagens[interlocutor]) {
              formatMensagens[interlocutor] = [];
            }
            formatMensagens[interlocutor].push(msg);
          }
        });

        setData({
          Materias: formatMaterias,
          Usuarios: usuarioLogado,
          Provas: provasFiltradas,
          Duvidas: duvidasFiltradas,
          Mensagens: formatMensagens,
          MateriaisEstudo: materiaisFiltrados
        });

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [usuarioLogado]);

  if (!usuarioLogado) {
    return <Login onLogin={setUsuarioLogado} apiUrl={API_BASE_URL} />;
  }

  if (isLoading) {
    return <div className="loading-screen" style={{ padding: '20px', textAlign: 'center' }}><p>Carregando dados...</p></div>;
  }

  if (error) {
    return <div className="error-screen" style={{ padding: '20px', textAlign: 'center', color: 'red' }}><p>Erro ao conectar com API: {error}</p></div>;
  }

  const handleLogout = () => {
    setUsuarioLogado(null);
    setScreen('inicio');
  };

  const handleNewData = (type, newData) => {
    setData(prevData => {
      if (type === 'Mensagem') {
         const interlocutor = newData.remetente !== usuarioLogado.nome ? newData.remetente : newData.destinatario;
         const currentMensagens = prevData.Mensagens[interlocutor] || [];
         return {
           ...prevData,
           Mensagens: {
             ...prevData.Mensagens,
             [interlocutor]: [...currentMensagens, newData]
           }
         };
      } else if (type === 'Material') {
         return {
           ...prevData,
           MateriaisEstudo: [newData, ...prevData.MateriaisEstudo]
         };
      } else if (type === 'Duvida') {
         return {
           ...prevData,
           Duvidas: [newData, ...prevData.Duvidas]
         };
      }
      return prevData;
    });
  };

  const { Materias, Usuarios: Usuario, Provas, Duvidas: ListaDuvidas, Mensagens, MateriaisEstudo } = data;

  return (
    <>
      <Header screen={screen} setScreen={setScreen} Usuario={Usuario} />
      {screen === 'inicio' && <Inicio 
        Usuario={Usuario} 
        Materias={Materias} 
        Provas={Provas} 
        Mensagens={Mensagens}
        MateriaisEstudo={MateriaisEstudo}
        setScreen={setScreen}
      />}
      {screen === 'horarios' && <Horarios Materias={Materias} />}
      {screen === 'duvidas' && <Duvidas Usuario={Usuario} Materias={Materias} ListaDuvidas={ListaDuvidas} apiUrl={API_BASE_URL} onNewData={handleNewData}/>}
      {screen === 'materiais' && <Materiais Materias={Materias} MateriaisEstudoIniciais={MateriaisEstudo} Usuario={Usuario} apiUrl={API_BASE_URL} onNewData={handleNewData}/>}
      {screen === 'chat' && <Chat Materias={Materias} Mensagens={Mensagens} Usuario={Usuario} apiUrl={API_BASE_URL} onNewData={handleNewData} />}
      {screen === 'cadastro' && <Cadastro apiUrl={API_BASE_URL} />}
      {screen === 'perfil' && <Perfil Usuario={Usuario} Materias={Materias} onLogout={handleLogout} />}
      <TabBar screen={screen} setScreen={setScreen} />
    </>
  )
}

export default App
