import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import {
  registerServiceWorker,
  cleanupServiceWorker,
  isPwaDisabledEnvironment,
} from './utils/pwaUtils';
import { initNativeSessionBridge } from './utils/nativeSessionBridge';
import { initNativeDeepLinks } from './utils/nativeDeepLinks';

// В preview/iframe/dev — никогда не регистрируем SW и активно чистим
// уже установленный (он мог перехватывать iframe Lovable IDE).
if (isPwaDisabledEnvironment()) {
  cleanupServiceWorker();
} else {
  registerServiceWorker();
}

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
