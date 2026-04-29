// PWA утилиты для регистрации Service Worker и проверки установки
import { pwaUpdateManager } from './pwaUpdateManager';

/**
 * Detects environments where we must NOT register a service worker:
 * - Vite dev mode
 * - Lovable Preview hosts (id-preview--*.lovable.app, *.lovableproject.com)
 * - Inside an iframe (Lovable IDE preview)
 * - localhost
 */
export const isPwaDisabledEnvironment = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    if (import.meta.env?.DEV) return true;
  } catch {
    /* ignore */
  }
  const host = window.location.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.includes('lovableproject.com') ||
    host.includes('lovable.app') ||
    host.includes('id-preview--')
  ) {
    return true;
  }
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true; // cross-origin iframe
  }
  return false;
};

/**
 * Removes any previously-registered service worker and clears its caches.
 * This is critical inside Lovable Preview because a stale SW would keep
 * serving an outdated app shell and break the iframe preview.
 */
export const cleanupServiceWorker = async (): Promise<void> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister()));
    if (typeof caches !== 'undefined') {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
    }
  } catch (e) {
    console.warn('[pwa] cleanup failed', e);
  }
};

export const registerServiceWorker = async (): Promise<void> => {
  if (isPwaDisabledEnvironment()) {
    // Make sure no stale SW remains in preview/dev.
    await cleanupServiceWorker();
    return;
  }
  if ('serviceWorker' in navigator) {
    try {
      // Инициализируем менеджер обновлений (который также регистрирует SW)
      await pwaUpdateManager.initialize();
      console.log(
        'Service Worker зарегистрирован и менеджер обновлений инициализирован'
      );
    } catch (error) {
      console.error('Ошибка регистрации Service Worker:', error);
    }
  }
};

export const checkInstallPrompt = (): Promise<boolean> => {
  return new Promise(resolve => {
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      resolve(true);
    });

    // Если событие не произошло в течение 1 секунды
    setTimeout(() => resolve(false), 1000);
  });
};

export const installPWA = async (): Promise<boolean> => {
  const deferredPrompt = (window as any).deferredPrompt;

  if (!deferredPrompt) {
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    console.log('PWA установлено');
    return true;
  } else {
    console.log('Установка PWA отклонена');
    return false;
  }
};

export const isPWAInstalled = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};
