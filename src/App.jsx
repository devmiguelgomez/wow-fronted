import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import LoadingScreen from './components/LoadingScreen';
import FactionSelection from './components/FactionSelection';
import styled, { createGlobalStyle } from 'styled-components';
import '@fontsource/cinzel';

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
`;

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const selectedFaction = localStorage.getItem('wowSelectedFaction');

  if (!selectedFaction && location.pathname !== '/') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFaction, setSelectedFaction] = useState(null);
  const [showFactionSelection, setShowFactionSelection] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedFaction = localStorage.getItem('wowSelectedFaction');
    if (storedFaction) {
      setSelectedFaction(storedFaction);
    } else {
      setShowFactionSelection(true);
    }
  }, []);

  const handleFactionSelect = (faction) => {
    setSelectedFaction(faction);
    setShowFactionSelection(false);
    localStorage.setItem('wowSelectedFaction', faction);
    localStorage.removeItem('wowChatSessionId');
  };

  const handleChangeFaction = () => {
    setShowFactionSelection(true);
    setSelectedFaction(null);
    localStorage.removeItem('wowSelectedFaction');
    localStorage.removeItem('wowChatSessionId');
  };

  const handleReturnHome = () => {
    setShowFactionSelection(true);
    setSelectedFaction(null);
    localStorage.removeItem('wowSelectedFaction');
    localStorage.removeItem('wowChatSessionId');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppContainer>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                {showFactionSelection || !selectedFaction ? (
                  <FactionSelection onFactionSelect={handleFactionSelect} />
                ) : (
                  <Chat
                    faction={selectedFaction}
                    onChangeFaction={handleChangeFaction}
                    onReturnHome={handleReturnHome}
                  />
                )}
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppContainer>
  );
};

export default App;
