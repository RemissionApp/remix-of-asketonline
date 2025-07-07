
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { registerServiceWorker } from './utils/pwaUtils';

// Регистрируем Service Worker для PWA
registerServiceWorker();

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
