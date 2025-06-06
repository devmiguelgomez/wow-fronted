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

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [faction, setFaction] = useState('alliance');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Cargar historial de chat
    loadChatHistory();
  }, [navigate]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al cargar el historial');
      }

      const data = await response.json();
      setMessages(data.chatHistory.map(msg => ({
        role: 'user',
        content: msg.message
      }, {
        role: 'assistant',
        content: msg.response
      })));
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage,
          faction
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      const data = await response.json();
      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.response }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            value={faction}
            onChange={(e) => setFaction(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded"
          >
            <option value="alliance">Alianza</option>
            <option value="horde">Horda</option>
          </select>
          <span className="text-white">
            {faction === 'alliance' ? 'Alianza' : 'Horda'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;