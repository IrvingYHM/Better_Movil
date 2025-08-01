import React from 'react';
import { render } from '@testing-library/react';
import App from './App';


test('se renderiza sin errores', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
