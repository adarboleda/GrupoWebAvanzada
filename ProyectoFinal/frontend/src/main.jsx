import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Importar estilos de PrimeReact
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Tema
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Iconos
import 'primeflex/primeflex.css'; // Utilidades CSS

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
