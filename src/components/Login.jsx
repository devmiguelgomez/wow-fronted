import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import '@fontsource/cinzel';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('/wow-background.jpg') center/cover;
  font-family: 'Cinzel', serif;
`;

const FormContainer = styled.div`
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  border: 2px solid #FFD100;
  box-shadow: 0 0 20px rgba(255, 209, 0, 0.3);
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h2`
  color: #FFD100;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const ErrorMessage = styled.div`
  background: rgba(139, 0, 0, 0.9);
  border: 1px solid #ff6b6b;
  color: #ffcccc;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-style: italic;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #FFD100;
  font-size: 1rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #FFD100;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: #FFD100;
  font-family: 'Cinzel', serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(255, 209, 0, 0.5);
    background: rgba(0, 0, 0, 0.8);
  }

  &::placeholder {
    color: rgba(255, 209, 0, 0.6);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #FFD100, #FFA500);
  border: none;
  color: #000;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
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
`;

const RegisterLink = styled.button`
  background: none;
  border: none;
  color: #FFD100;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  text-decoration: underline;
  transition: all 0.3s ease;

  &:hover {
    color: #FFA500;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://wow-backend-teal.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>Iniciar Sesión</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
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
              placeholder="Ingresa tu contraseña"
              required
            />
          </InputGroup>
          <ButtonGroup>
            <Button type="submit">Iniciar Sesión</Button>
            <RegisterLink onClick={() => navigate('/register')}>
              Registrarse
            </RegisterLink>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Login; 