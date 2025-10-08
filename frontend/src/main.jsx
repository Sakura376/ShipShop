import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot correctamente
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Crear la raíz

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
