import styled, { keyframes } from 'styled-components';
import { useEffect } from 'react';
import allianceIcon from '../assets/alliance-icon.png';
import hordeIcon from '../assets/horde-icon.png';
import useAudio from '../hooks/useAudio';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 209, 0, 0.3); }
  50% { box-shadow: 0 0 30px rgba(255, 209, 0, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/wow-bg.jpg') center/cover no-repeat;
  background-attachment: fixed;
  animation: ${fadeIn} 1s;
  color: #FFD100;
  font-family: 'Cinzel', serif;
  position: relative;
  overflow: hidden;
  padding: 0 20px;
  text-align: center;
`;

const BackgroundEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 209, 0, 0.1) 0%, transparent 70%);
  animation: ${glow} 4s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 3px 3px 6px #000;
  text-align: center;
  animation: ${float} 3s ease-in-out infinite;
  background: linear-gradient(45deg, #FFD100, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  width: 100%;
  letter-spacing: 2px;
  font-weight: 900;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px #000;
  max-width: 700px;
  line-height: 1.4;
  opacity: 0.9;
  width: 100%;
  letter-spacing: 0.5px;
  font-weight: bold;
  color: #FFD100;

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 90%;
  }
`;

const FactionContainer = styled.div`
  display: flex;
  gap: 4rem;
  margin-top: 1rem;
  z-index: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FactionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.8);
  border: 3px solid #FFD100;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s ease;
  color: #FFD100;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  width: 250px;
  height: 280px;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 209, 0, 0.2), transparent);
    transition: all 0.6s;
  }

  &:hover {
    transform: translateY(-10px) scale(1.05);
    animation: ${glow} 2s infinite;
    background: rgba(20, 20, 20, 0.9);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-5px) scale(1.02);
  }
`;

const FactionIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 15px rgba(255, 209, 0, 0.6));
  transition: all 0.3s ease;

  ${FactionButton}:hover & {
    transform: scale(1.1);
    filter: drop-shadow(0 0 20px rgba(255, 209, 0, 0.8));
  }
`;

const FactionName = styled.span`
  font-size: 1.6rem;
  text-shadow: 2px 2px 4px #000;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  color: #FFD100;
  font-weight: bold;
`;

const FactionDescription = styled.p`
  font-size: 0.8rem;
  margin-top: 0.3rem;
  text-align: center;
  opacity: 0.9;
  max-width: 200px;
  line-height: 1.3;
  letter-spacing: 0.3px;
`;

const PoweredBy = styled.div`
  position: absolute;
  bottom: 2rem;
  font-size: 0.9rem;
  opacity: 0.6;
  text-align: center;
`;

export default function FactionSelection({ onFactionSelect }) {
  const backgroundMusic = useAudio('/audio/background.mp3');
  const allianceMusic = useAudio('/audio/alliance.mp3');
  const hordeMusic = useAudio('/audio/horde.mp3');

  useEffect(() => {
    backgroundMusic.play();
    return () => {
      backgroundMusic.stop();
    };
  }, []);

  const handleFactionSelect = (faction) => {
    backgroundMusic.stop();
    if (faction === 'alliance') {
      allianceMusic.play();
    } else {
      hordeMusic.play();
    }
    onFactionSelect(faction);
  };

  return (
    <SelectionContainer>
      <BackgroundEffect />
      <Title>¡POR AZEROTH!</Title>
      <Subtitle>
        ELIGE TU FACCIÓN Y CONVERSA CON UN VERDADERO HABITANTE
        DE ESE REINO.
        <br/>
        CADA FACCIÓN TIENE SU PROPIA HISTORIA QUE CONTAR...
      </Subtitle>
      
      <FactionContainer>
        <FactionButton onClick={() => handleFactionSelect('alliance')}>
          <FactionIcon src={allianceIcon} alt="Alianza" />
          <FactionName>ALIANZA</FactionName>
          <FactionDescription>
            HONOR, JUSTICIA Y UNIDAD 
            ENTRE LAS RAZAS NOBLES
          </FactionDescription>
        </FactionButton>
        
        <FactionButton onClick={() => handleFactionSelect('horde')}>
          <FactionIcon src={hordeIcon} alt="Horda" />
          <FactionName>HORDA</FactionName>
          <FactionDescription>
            FUERZA, SUPERVIVENCIA Y EL 
            PODER DE LOS CLANES UNIDOS
          </FactionDescription>
        </FactionButton>
      </FactionContainer>

      <PoweredBy>
        POWERED BY GOOGLE GEMINI AI ✨
      </PoweredBy>
    </SelectionContainer>
  );
}
