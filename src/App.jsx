import { useState } from 'react'
import './App.css'
import TabBar from './components/TabBar'
import Inicio from './pages/Inicio'
import Horarios from './pages/Horarios'
import Duvidas from './pages/Duvidas'
import Materiais from './pages/Materiais'
import Chat from './pages/Chat'
import Header from './components/Header'

function App() {
  const [screen, setScreen] = useState('horarios')

  const Materias = {
    'MAT032':
    {
      nome: 'Calculo A',
      monitores: ['José', 'Maria'],
      cronograma: [{dia_semana: 'SEG',horario: '14:00 - 16:00', sala: 'Sala 1'}, {dia_semana: 'QUA',horario: '14:00 - 16:00', sala: 'Sala 1'}],
      provas: [
        { nome: 'Prova 1', dia: '2025-05-24', horario: '14:00 - 16:00' },
        { nome: 'Prova 2', dia: '2025-07-24', horario: '14:00 - 16:00' },
        { nome: 'Prova Final', dia: '2025-07-24', horario: '14:00 - 16:00' },
        { nome: 'Recuperação', dia: '2025-07-24', horario: '14:00 - 16:00' },
      ]
    },
    'COMP902': {
      nome: 'Programação Orientada a Objetos',
      monitores: ['Lorenzo', 'Julia'],
      cronograma: [{dia_semana: 'TER',horario: '18:00 - 20:00', sala: 'Sala 1'}, {dia_semana: 'SEX',horario: '18:00 - 20:00', sala: 'Sala 1'}],
      provas: [
        { nome: 'Prova 1', dia: '2025-05-24', horario: '14:00 - 16:00' },
        { nome: 'Prova 2', dia: '2025-07-24', horario: '14:00 - 16:00' },
        { nome: 'Prova Final', dia: '2025-07-24', horario: '14:00 - 16:00' },
        { nome: 'Recuperação', dia: '2025-07-24', horario: '14:00 - 16:00' },
      ]
    },
  }

  const Usuario = {
    nome: "João",
    sobrenome: "Silva",
    fotoPerfil: false,
    curso: "Ciencia da Computação",
    matricula: "2024210211",
    materias: [
      "Cálculo 2",
      "Programação Orientada a Objetos",
      "Banco de Dados"
    ]
  }

  return (
    <>
      <Header screen={screen} Usuario={Usuario} />
      {screen === 'inicio' && <Inicio />}
      {screen === 'horarios' && <Horarios Materias={Materias} />}
      {screen === 'duvidas' && <Duvidas />}
      {screen === 'materiais' && <Materiais />}
      {screen === 'chat' && <Chat />}
      <TabBar screen={screen} setScreen={setScreen} />
    </>
  )
}

export default App
