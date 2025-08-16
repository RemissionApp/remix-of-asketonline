// PWA утилиты для регистрации Service Worker и проверки установки
import { pwaUpdateManager } from './pwaUpdateManager';

export const registerServiceWorker = async (): Promise<void> => {
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
