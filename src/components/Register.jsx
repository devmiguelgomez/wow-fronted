import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import '@fontsource/cinzel';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('/zGg9N1o.jpg') center/cover no-repeat;
  background-attachment: fixed;
  animation: ${fadeIn} 1s ease-out;
  color: #FFD100;
  font-family: 'Cinzel', serif;
  padding: 20px;
  text-align: center;
`;

const FormBox = styled.div`
  background: rgba(0, 0, 0, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(255, 209, 0, 0.3);
  width: 100%;
  max-width: 400px;
  border: 2px solid #FFD100;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #FFD100;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #FFD100, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  color: #FFD100;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #FFD100;
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
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #FFD100, #FFA500);
  border: none;
  color: #000;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  margin-top: 10px;

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

const ErrorMessage = styled.div`
  background: rgba(139, 0, 0, 0.9);
  color: #ffcccc;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ff6b6b;
  font-size: 0.9rem;
`;

const LinkText = styled.p`
  margin-top: 25px;
  text-align: center;
  color: #FFD100;
  opacity: 0.9;
`;

const StyledLinkButton = styled.button`
  background: none;
  border: none;
  color: #FFA500;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: #FFD100;
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://wow-backend-teal.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirigir a la ruta principal que maneja la selección de facción
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <FormContainer>
      <FormBox>
        <Title>Registro</Title>
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <Button type="submit">
            Registrarse
          </Button>
        </form>
        <LinkText>
          ¿Ya tienes cuenta?{' '}
          <StyledLinkButton
            onClick={() => navigate('/login')}
          >
            Inicia Sesión
          </StyledLinkButton>
        </LinkText>
      </FormBox>
    </FormContainer>
  );
};

export default Register; 