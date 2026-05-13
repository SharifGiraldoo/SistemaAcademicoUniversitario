import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './main/java/com/universidad/sistemamatricula/App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
