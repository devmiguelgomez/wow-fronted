import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFactionSelect = (faction) => {
    localStorage.setItem('wowSelectedFaction', faction);
    localStorage.removeItem('wowChatSessionId');
    navigate('/');
  };

  const handleChangeFaction = () => {
    localStorage.removeItem('wowSelectedFaction');
    localStorage.removeItem('wowChatSessionId');
    navigate('/');
  };

  const handleReturnHome = () => {
    localStorage.removeItem('wowSelectedFaction');
    localStorage.removeItem('wowChatSessionId');
    navigate('/');
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
                {localStorage.getItem('wowSelectedFaction') ? (
                  <Chat
                    faction={localStorage.getItem('wowSelectedFaction')}
                    onChangeFaction={handleChangeFaction}
                    onReturnHome={handleReturnHome}
                  />
                ) : (
                  <FactionSelection onFactionSelect={handleFactionSelect} />
                )}
              </PrivateRoute>
            }
          />
          {!localStorage.getItem('token') && (location.pathname !== '/login' && location.pathname !== '/register') && (
               <Route path="*" element={<Navigate to="/login" />} />
          )}
          {localStorage.getItem('token') && location.pathname !== '/' && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>
      </Router>
    </AppContainer>
  );
};

export default App;
