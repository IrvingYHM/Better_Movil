import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Formulario'; // Ajusta la ruta de Login
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import React, { ReactNode } from 'react';
import { AuthContext } from '../contexts/Auth';
import IniciaSesion from '../pages/IniciaSesión';
// Definir el tipo de props para `MockAuthProvider`
interface MockAuthProviderProps {
  children: ReactNode;
}
// Mock del contexto de autenticación
const mockAuthContext = {
  isAuthenticated: false, // o true, dependiendo de la prueba
  login: vi.fn(),         // mock de la función login
  logout: vi.fn(),        // mock de la función logout
};
const mockLogin = vi.fn();

const MockAuthProvider: React.FC<MockAuthProviderProps> = ({ children }) => {
  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock de ReCAPTCHA con tipo explícito para props
vi.mock('react-google-recaptcha', () => {
  return {
    __esModule: true,
    default: (props: { onChange: () => void }) => (
      <div data-testid="recaptcha" onClick={props.onChange} />
    ),
  };
});

describe('Pruebas del componente Login', () => {
  test('muestra el formulario completo', () => {
    render(
      <Router>
        <MockAuthProvider>
          <Login />
        </MockAuthProvider>
      </Router>
    );

    // Verificar los elementos del formulario
    expect(screen.queryByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.queryByText('Correo')).toBeInTheDocument();
    expect(screen.queryByText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Ingresar')).toBeInTheDocument();
    expect(screen.getByText('Recordar contraseña')).toBeInTheDocument();
    expect(screen.getByTestId('recaptcha')).toBeInTheDocument();
  });
});
