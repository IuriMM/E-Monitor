import { useState, useEffect, lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import './App.css'
import TabBar from './components/TabBar'
import Header from './components/Header'
import Login from './pages/Login'
import { apiGet, setAuthToken, clearAuthToken, setUnauthorizedHandler } from './api/client'

const Inicio = lazy(() => import('./pages/Inicio'))
const Horarios = lazy(() => import('./pages/Horarios'))
const Duvidas = lazy(() => import('./pages/Duvidas'))
const Materiais = lazy(() => import('./pages/Materiais'))
const Chat = lazy(() => import('./pages/Chat'))
const Cadastro = lazy(() => import('./pages/Cadastro'))
const Perfil = lazy(() => import('./pages/Perfil'))

function App() {
  const [screen, setScreen] = useState('inicio')
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  
  const [data, setData] = useState({
    Materias: {},
    Usuarios: null,
    Provas: [],
    Duvidas: [],
    Mensagens: {},
    MateriaisEstudo: [],
    TodosUsuarios: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const handleLogin = ({ access_token, usuario } = {}) => {
    if (access_token) setAuthToken(access_token);
    const safeUser = { ...(usuario || {}) };
    delete safeUser.senha;
    setSessionExpired(false);
    setUsuarioLogado(safeUser);
  };

  const handleLogout = ({ expired = false } = {}) => {
    clearAuthToken();
    setUsuarioLogado(null);
    setScreen('inicio');
    setSessionExpired(expired);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => handleLogout({ expired: true }));
  }, []);

  useEffect(() => {
    if (!usuarioLogado) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Também buscamos a lista completa de usuários: é o único jeito de
        // traduzir o "usuario" (id) gravado em cada dúvida/comentário para
        // um nome de exibição — sem isso, a UI não tem como saber quem
        // realmente escreveu cada dúvida.
        const [
          materiasList,
          provasList,
          duvidasList,
          mensagensList,
          materiaisList,
          usuariosList
        ] = await Promise.all([
          apiGet('/materias/', { signal: controller.signal }),
          apiGet('/provas/', { signal: controller.signal }),
          apiGet('/duvidas/', { signal: controller.signal }),
          apiGet('/mensagens/', { signal: controller.signal }),
          apiGet('/materiais_estudo/', { signal: controller.signal }),
          apiGet('/usuarios/', { signal: controller.signal })
        ]);

        const materiasUsuario = usuarioLogado.materias || [];
        const monitoriasUsuario = usuarioLogado.monitor || [];
        const todasAsMaterias = [...new Set([...materiasUsuario, ...monitoriasUsuario])];
        
        const nomeUsuario = usuarioLogado.nome;

        // Formata Materias (Filtra apenas as que o usuário possui ou monitora)
        const formatMaterias = {};
        materiasList.forEach(materia => {
          if (todasAsMaterias.includes(materia.codigo)) {
            formatMaterias[materia.codigo] = materia;
          }
        });

        // Filtra Provas, Duvidas e Materiais pelas matérias do usuário e as que ele monitora
        const provasFiltradas = provasList.filter(p => todasAsMaterias.includes(p.materia));
        const duvidasFiltradas = duvidasList.filter(d => todasAsMaterias.includes(d.materia));
        const materiaisFiltrados = materiaisList.filter(m => todasAsMaterias.includes(m.materia));

        // GET /mensagens/ já vem restrito às conversas do usuário autenticado (server-side).
        const formatMensagens = {};
        mensagensList.forEach(msg => {
          const interlocutor = msg.remetente !== nomeUsuario ? msg.remetente : msg.destinatario;
          if (!formatMensagens[interlocutor]) {
            formatMensagens[interlocutor] = [];
          }
          formatMensagens[interlocutor].push(msg);
        });

        setData({
          Materias: formatMaterias,
          Usuarios: usuarioLogado,
          Provas: provasFiltradas,
          Duvidas: duvidasFiltradas,
          Mensagens: formatMensagens,
          MateriaisEstudo: materiaisFiltrados,
          TodosUsuarios: usuariosList
        });

      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [usuarioLogado]);

  if (!usuarioLogado) {
    return <Login onLogin={handleLogin} sessionExpired={sessionExpired} />;
  }

  if (isLoading) {
    return (
      <div className="global-loading-screen">
        <Loader2 className="global-spinner" size={48} />
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-screen" style={{ padding: '20px', textAlign: 'center', color: 'red' }}><p>Erro ao conectar com API: {error}</p></div>;
  }

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
      } else if (type === 'DuvidaAtualizada') {
         return {
           ...prevData,
           Duvidas: prevData.Duvidas.map(d =>
             (d._id || d.id) === (newData._id || newData.id) ? newData : d
           )
         };
      }
      return prevData;
    });
  };

  const { Materias, Usuarios: Usuario, Provas, Duvidas: ListaDuvidas, Mensagens, MateriaisEstudo, TodosUsuarios } = data;

  return (
    <>
      <Header screen={screen} setScreen={setScreen} Usuario={Usuario} />
      <Suspense fallback={
        <div className="global-loading-screen">
          <Loader2 className="global-spinner" size={48} />
          <p>Carregando...</p>
        </div>
      }>
        {screen === 'inicio' && <Inicio
          Usuario={Usuario}
          Materias={Materias}
          Provas={Provas}
          Mensagens={Mensagens}
          MateriaisEstudo={MateriaisEstudo}
          setScreen={setScreen}
        />}
        {screen === 'horarios' && <Horarios Materias={Materias} />}
        {screen === 'duvidas' && <Duvidas Usuario={Usuario} Materias={Materias} ListaDuvidas={ListaDuvidas} TodosUsuarios={TodosUsuarios} onNewData={handleNewData}/>}
        {screen === 'materiais' && <Materiais Materias={Materias} MateriaisEstudoIniciais={MateriaisEstudo} Usuario={Usuario} onNewData={handleNewData}/>}
        {screen === 'chat' && <Chat Materias={Materias} Mensagens={Mensagens} Usuario={Usuario} TodosUsuarios={TodosUsuarios} onNewData={handleNewData} />}
        {screen === 'cadastro' && <Cadastro />}
        {screen === 'perfil' && <Perfil Usuario={Usuario} Materias={Materias} onLogout={handleLogout} />}
      </Suspense>
      <TabBar screen={screen} setScreen={setScreen} />
    </>
  )
}

export default App
