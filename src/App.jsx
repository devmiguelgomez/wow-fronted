import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import LoadingScreen from './components/LoadingScreen'
import FactionSelection from './components/FactionSelection'
import { createGlobalStyle } from 'styled-components'
import { useState, useEffect } from 'react'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Cinzel', serif;
    background: #181818;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }

  #root {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
  }
`

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [loading, setLoading] = useState(true)
  const [selectedFaction, setSelectedFaction] = useState(null)
  const [showFactionSelection, setShowFactionSelection] = useState(false)

  useEffect(() => {
    // Aumentar el tiempo de carga para que coincida con la barra de progreso
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Verificar si ya hay una facción seleccionada
    const storedFaction = localStorage.getItem('wowSelectedFaction')
    if (storedFaction) {
      setSelectedFaction(storedFaction)
    } else {
      setShowFactionSelection(true)
    }
  }, [])

  const handleFactionSelect = (faction) => {
    setSelectedFaction(faction)
    setShowFactionSelection(false)
    localStorage.setItem('wowSelectedFaction', faction)
    // Limpiar sesión anterior para nueva facción
    localStorage.removeItem('wowChatSessionId')
  }

  const handleChangeFaction = () => {
    setShowFactionSelection(true)
    setSelectedFaction(null)
    localStorage.removeItem('wowSelectedFaction')
    localStorage.removeItem('wowChatSessionId')
  }

  const handleReturnHome = () => {
    setShowFactionSelection(true)
    setSelectedFaction(null)
    localStorage.removeItem('wowSelectedFaction')
    localStorage.removeItem('wowChatSessionId')
  }

  const renderCurrentScreen = () => {
    if (loading) return <LoadingScreen />
    if (showFactionSelection || !selectedFaction) {
      return <FactionSelection onFactionSelect={handleFactionSelect} />
    }
    return (
      <Chat 
        faction={selectedFaction} 
        onChangeFaction={handleChangeFaction}
        onReturnHome={handleReturnHome}
      />
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
