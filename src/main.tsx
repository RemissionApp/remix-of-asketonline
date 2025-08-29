
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { registerServiceWorker } from './utils/pwaUtils';

// Register Service Worker for PWA
registerServiceWorker();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(<App />);
