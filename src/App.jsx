import { useState } from 'react'
import './App.css'
import TabBar from './components/TabBar'
import Inicio from './pages/Inicio'
import Horarios from './pages/Horarios'
import Duvidas from './pages/Duvidas'
import Materiais from './pages/Materiais'
import Chat from './pages/Chat'
import Header from './components/Header'
import db from './data/db.json'

function App() {
  const [screen, setScreen] = useState('horarios')

  const Materias = db.Materias;
  const Usuario = db.Usuarios;
  const Provas = db.Provas;
  const ListaDuvidas = db.Duvidas;

  return (
    <>
      <Header screen={screen} Usuario={Usuario} />
      {screen === 'inicio' && <Inicio Usuario={Usuario} Materias={Materias} Provas={Provas}/>}
      {screen === 'horarios' && <Horarios Materias={Materias} />}
      {screen === 'duvidas' && <Duvidas Usuario={Usuario} Materias={Materias} ListaDuvidas={ListaDuvidas}/>}
      {screen === 'materiais' && <Materiais />}
      {screen === 'chat' && <Chat />}
      <TabBar screen={screen} setScreen={setScreen} />
    </>
  )
}

export default App
