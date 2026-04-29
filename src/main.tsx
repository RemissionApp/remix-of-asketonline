import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { registerServiceWorker } from './utils/pwaUtils';
import { initNativeSessionBridge } from './utils/nativeSessionBridge';
import { initNativeDeepLinks } from './utils/nativeDeepLinks';

// Регистрируем Service Worker для PWA
registerServiceWorker();

// Восстанавливаем сессию из нативного хранилища (iOS/Android) до рендера
initNativeSessionBridge();

// Подписка на deep-link callback'и (OAuth / password reset) на iOS/Android
initNativeDeepLinks();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
