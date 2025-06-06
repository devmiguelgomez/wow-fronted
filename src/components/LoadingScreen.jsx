import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: url('/pantalla-carga.jpeg') center/cover no-repeat;
  background-attachment: fixed;
  animation: ${fadeIn} 1s;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

const LoadingContainer = styled.div`
  position: absolute;
  bottom: 15vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  width: 90%;
  max-width: 600px;
`;

const LoadingBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #4a90e2;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 
    0 0 20px rgba(74, 144, 226, 0.5),
    inset 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const LoadingBarFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    #1e3a8a 0%,
    #3b82f6 25%,
    #60a5fa 50%,
    #93c5fd 75%,
    #dbeafe 100%
  );
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
  position: relative;
  box-shadow: 
    0 0 10px rgba(74, 144, 226, 0.8),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    animation: ${shimmer} 2s infinite;
  }
`;

const LoadingText = styled.div`
  color: #FFD100;
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
`;

const ProgressText = styled.div`
  color: #4a90e2;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  margin-top: 1rem;
  text-align: center;
`;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Prgreso variable
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoaderContainer>
      <LoadingContainer>
        <LoadingText>Cargando Azeroth...</LoadingText>
        <LoadingBarContainer>
          <LoadingBarFill $progress={Math.min(progress, 100)} />
        </LoadingBarContainer>
        <ProgressText>{Math.floor(Math.min(progress, 100))}%</ProgressText>
      </LoadingContainer>
    </LoaderContainer>
  );
}