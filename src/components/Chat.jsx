import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import '@fontsource/cinzel';
import hordeIcon from '../assets/horde-icon.png';
import allianceIcon from '../assets/alliance-icon.png';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const typing = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('${props => props.$faction === 'alliance' ? '/alliance-fondo.jpg' : '/horda-fondo.jpg'}') center/cover;
  color: #FFD100;
  font-family: 'Cinzel', serif;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ChatHeader = styled.header`
  padding: 1rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.9);
  border-bottom: 2px solid #FFD100;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  flex: 1;
`;

const HeaderButton = styled.button`
  background: rgba(255, 209, 0, 0.1);
  border: 2px solid #FFD100;
  color: #FFD100;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  transition: all 0.3s ease;
  margin: 0 0.5rem;

  &:hover {
    background: rgba(255, 209, 0, 0.2);
    box-shadow: 0 0 10px rgba(255, 209, 0, 0.5);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #FFD100;
    border-radius: 4px;
  }
`;

const Message = styled.div`
  max-width: 75%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: ${props => props.$isUser 
    ? (props.$faction === 'alliance' ? 'rgba(0, 32, 96, 0.9)' : 'rgba(96, 0, 0, 0.9)') 
    : 'rgba(20, 20, 20, 0.9)'};
  border: 2px solid #FFD100;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  color: #FFD100;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 15px;
    ${props => props.$isUser ? 'right: -8px' : 'left: -8px'};
    width: 0;
    height: 0;
    border-style: solid;
    border-width: ${props => props.$isUser ? '8px 0 8px 8px' : '8px 8px 8px 0'};
    border-color: ${props => props.$isUser ? 'transparent transparent transparent #FFD100' : 'transparent #FFD100 transparent transparent'};
  }
`;

const MessageContent = styled.div`
  flex: 1;
  line-height: 1.5;
`;

const MessageIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #FFD100;
  box-shadow: 0 0 10px rgba(255, 209, 0, 0.3);
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD100;
  font-style: italic;
  opacity: 0.8;
  
  &::after {
    content: '●●●';
    animation: ${typing} 1.5s infinite;
  }
`;

const ErrorMessage = styled(Message)`
  background: rgba(139, 0, 0, 0.9) !important;
  border-color: #ff6b6b;
  color: #ffcccc;
  font-style: italic;
`;

const InputContainer = styled.div`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.9);
  border-top: 2px solid #FFD100;
`;

const InputForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: 2px solid #FFD100;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #FFD100;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(255, 209, 0, 0.5);
    background: rgba(0, 0, 0, 0.8);
  }

  &::placeholder {
    color: rgba(255, 209, 0, 0.6);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(45deg, #FFD100, #FFA500);
  border: none;
  color: #000;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 209, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD100;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$connected ? '#4CAF50' : '#F44336'};
  animation: ${props => props.$connected ? '' : typing} 2s infinite;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const MessageInput = styled.div`
  display: flex;
  gap: 10px;
`;

const NewChatButton = styled(HeaderButton)`
  margin-bottom: 20px;
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => props.active ? '#e8f0fe' : 'transparent'};
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const LogoutButton = styled(HeaderButton)`
  margin-top: auto;
  background-color: #dc3545;
  
  &:hover {
    background-color: #c82333;
  }
`;

const Chat = ({ faction, onChangeFaction, onReturnHome }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener o crear sessionId
    const storedSessionId = localStorage.getItem('wowChatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      // Cargar conversación existente
      loadConversation(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('wowChatSessionId', newSessionId);
      setSessionId(newSessionId);
      
      // Enviar mensaje inicial de presentación
      sendInitialMessage(newSessionId);
    }
  }, [faction]);

  const sendInitialMessage = async (id) => {
    setIsTyping(true);
    try {
      const response = await axios.post('https://wow-backend-teal.vercel.app/api/chat/send', {
        sessionId: id,
        message: `Iniciar conversación como ${faction}`,
        faction: faction
      });

      setMessages([{
        role: 'assistant',
        content: response.data.response
      }]);
      setIsConnected(true);
    } catch (error) {
      console.error('Error al enviar mensaje inicial:', error);
      setIsConnected(false);
    } finally {
      setIsTyping(false);
    }
  };

  const loadConversation = async (id) => {
    try {
      const response = await axios.get(`https://wow-backend-teal.vercel.app/api/chat/conversation/${id}`);
      if (response.data.messages) {
        setMessages(response.data.messages);
      }
      setIsConnected(true);
    } catch (error) {
      console.error('Error al cargar la conversación:', error);
      // No mostramos error si es 404 (nueva conversación)
      if (error.response?.status !== 404) {
        setError('Error al cargar la conversación. Por favor, recarga la página.');
        setIsConnected(false);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setError(null);
    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('https://wow-backend-teal.vercel.app/api/chat/send', {
        sessionId,
        message: input,
        faction: faction
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);
      setIsConnected(true);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = error.response?.data?.details || 'Error al procesar tu mensaje. Por favor, intenta de nuevo.';
      setError(errorMessage);
      setIsConnected(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChangeFaction = () => {
    localStorage.removeItem('wowChatSessionId');
    onChangeFaction();
  };

  const getFactionTitle = () => {
    return faction === 'alliance' ? 'Chat con la Alianza' : 'Chat con la Horda';
  };

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'Nueva conversación' })
      });
      const data = await response.json();
      setConversations([...conversations, data]);
      setCurrentConversation(data._id);
      setMessages([]);
    } catch (error) {
      console.error('Error al crear conversación:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <ChatContainer $faction={faction}>
      <ChatHeader>
        <HeaderButton onClick={onReturnHome}>
          🏠 Inicio
        </HeaderButton>
        <ChatTitle>{getFactionTitle()}</ChatTitle>
        <HeaderButton onClick={handleChangeFaction}>
          ⚔️ Cambiar Facción
        </HeaderButton>
        <StatusIndicator>
          <StatusDot $connected={isConnected} />
          {isConnected ? 'Conectado' : 'Desconectado'}
        </StatusIndicator>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((message, index) => (
          <Message key={index} $isUser={message.role === 'user'} $faction={faction}>
            <MessageIcon
              src={message.role === 'user' 
                ? (faction === 'alliance' ? allianceIcon : hordeIcon)
                : (faction === 'alliance' ? allianceIcon : hordeIcon)
              }
              alt={faction === 'alliance' ? 'Alianza' : 'Horda'}
            />
            <MessageContent>{message.content}</MessageContent>
          </Message>
        ))}
        
        {isTyping && (
          <Message $isUser={false} $faction={faction}>
            <MessageIcon
              src={faction === 'alliance' ? allianceIcon : hordeIcon}
              alt={faction === 'alliance' ? 'Alianza' : 'Horda'}
            />
            <TypingIndicator>Escribiendo</TypingIndicator>
          </Message>
        )}
        
        {error && (
          <ErrorMessage $isUser={false}>
            ⚠️ {error}
          </ErrorMessage>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputForm onSubmit={handleSubmit}>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Habla con ${faction === 'alliance' ? 'la Alianza' : 'la Horda'}...`}
            disabled={isTyping}
          />
          <SendButton type="submit" disabled={isTyping || !input.trim()}>
            {isTyping ? '...' : 'Enviar'}
          </SendButton>
        </InputForm>
      </InputContainer>

      <Sidebar>
        <NewChatButton onClick={createNewConversation}>
          Nueva Conversación
        </NewChatButton>
        <ConversationList>
          {conversations.map(conv => (
            <ConversationItem
              key={conv._id}
              active={conv._id === currentConversation}
              onClick={() => loadConversation(conv._id)}
            >
              {conv.title}
            </ConversationItem>
          ))}
        </ConversationList>
        <LogoutButton onClick={handleLogout}>
          Cerrar Sesión
        </LogoutButton>
      </Sidebar>
    </ChatContainer>
  );
};

export default Chat;