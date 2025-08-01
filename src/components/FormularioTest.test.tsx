import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Formulario';
import { AuthContext } from '../contexts/Auth'; // Ajusta la ruta según sea necesario
import { vi } from 'vitest';
import React from 'react';

describe('Login', () => {
  const loginMock = vi.fn();

  beforeEach(() => {
    // Reseteamos el estado antes de cada prueba
    localStorage.clear();
  });

  test('renderiza correctamente el formulario de inicio de sesión', () => {
    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <Login />
      </AuthContext.Provider>
    );

    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  });

  test('envía el formulario correctamente y muestra un mensaje de éxito', async () => {
    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <Login />
      </AuthContext.Provider>
    );

    // Simular entradas de usuario
    fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    
    // Simular la verificación del captcha
    const captcha = screen.getByTestId('recaptcha');
    fireEvent.change(captcha, { target: { value: 'captcha-token' } }); // Simular que el captcha fue completado

    // Simular el envío del formulario
    fireEvent.click(screen.getByTestId('submit-button'));

    // Mock de fetch
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'mocked-token' }),
    });

    await waitFor(() => expect(loginMock).toHaveBeenCalled());

    expect(localStorage.getItem('token')).toBe('mocked-token');
    expect(screen.queryByText('Inicio de sesión exitoso')).toBeInTheDocument(); // Verifica que se muestra el toast de éxito
  });

  test('muestra un mensaje de error si las credenciales son incorrectas', async () => {
    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <Login />
      </AuthContext.Provider>
    );

    // Simular entradas de usuario
    fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'wrong@example.com' } });
    fireEvent.input(screen.getByTestId('password-input'), { target: { value: 'wrongpassword' } });

    // Simular la verificación del captcha
    const captcha = screen.getByTestId('recaptcha');
    fireEvent.change(captcha, { target: { value: 'captcha-token' } }); // Simular que el captcha fue completado

    // Simular el envío del formulario
    fireEvent.click(screen.getByTestId('submit-button'));

    // Mock de fetch
