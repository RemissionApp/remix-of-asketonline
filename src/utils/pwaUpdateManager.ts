// Менеджер обновлений PWA

export class PWAUpdateManager {
  private static instance: PWAUpdateManager;
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;

  static getInstance(): PWAUpdateManager {
    if (!PWAUpdateManager.instance) {
      PWAUpdateManager.instance = new PWAUpdateManager();
    }
    return PWAUpdateManager.instance;
  }

  async initialize(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        
        // Проверяем обновления каждые 60 секунд
        setInterval(() => {
          this.checkForUpdates();
        }, 60000);

        // Слушаем события обновления
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration?.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.showUpdateNotification();
              }
            });
          }
        });

        console.log('PWA Update Manager инициализирован');
      } catch (error) {
        console.error('Ошибка инициализации PWA Update Manager:', error);
      }
    }
  }

  async checkForUpdates(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update();
      } catch (error) {
        console.error('Ошибка проверки обновлений:', error);
      }
    }
  }

  async applyUpdate(): Promise<boolean> {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Перезагружаем страницу после применения обновления
      window.addEventListener('controllerchange', () => {
        window.location.reload();
      });
      
      return true;
    }
    return false;
  }

  private showUpdateNotification(): void {
    // Создаем событие для уведомления о доступном обновлении
    const event = new CustomEvent('pwa-update-available', {
      detail: { updateManager: this }
    });
    window.dispatchEvent(event);
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }
}

// Инициализируем менеджер обновлений
export const pwaUpdateManager = PWAUpdateManager.getInstance();