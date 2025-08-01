import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/Auth'; // Importa el AuthProvider

// Obtén el elemento contenedor en el cual se montará la aplicación
const container = document.getElementById('root');

// Verifica que el contenedor no sea nulo y crea la raíz usando createRoot
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}
