import { render, screen } from '@testing-library/react';
import IniciaSesion from '../IniciaSesión'; // Asegúrate de ajustar la ruta
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import React from 'react';

vi.mock('../components/UI/Header', () => ({
    default: () => <div>Header</div>,
  }));
vi.mock('../components/Formulario', () => ({
  default: () => <div>Login</div>,
}));

describe('Pruebas del componente IniciaSesion', () => {
  test('renderisa Header, Login', () => {
    render(
      <Router>
        <IniciaSesion />
      </Router>
    );
    
    expect(screen.queryByText('Header')).toBeDefined();
    expect(screen.queryByText('Login')).toBeDefined();

  });
});
