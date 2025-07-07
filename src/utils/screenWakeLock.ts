// Screen Wake Lock API для предотвращения блокировки экрана
export interface WakeLockResult {
  success: boolean;
  supported: boolean;
  active?: boolean;
  error?: string;
}

class ScreenWakeLockManager {
  private wakeLock: WakeLockSentinel | null = null;
  private isActive = false;

  /**
   * Проверяет поддержку Wake Lock API
   */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  /**
   * Запрашивает wake lock
   */
  async request(): Promise<WakeLockResult> {
    if (!this.isSupported()) {
      return { success: false, supported: false };
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.isActive = true;

      // Слушаем событие освобождения wake lock
      this.wakeLock.addEventListener('release', () => {
        this.isActive = false;
        console.log('Screen wake lock released');
      });

      console.log('Screen wake lock acquired');
      return { 
        success: true, 
        supported: true, 
        active: true 
      };
    } catch (error: any) {
      return { 
        success: false, 
        supported: true, 
        error: error.message 
      };
    }
  }

  /**
   * Освобождает wake lock
   */
  async release(): Promise<WakeLockResult> {
    if (!this.wakeLock) {
      return { 
        success: true, 
        supported: this.isSupported(), 
        active: false 
      };
    }

    try {
      await this.wakeLock.release();
      this.wakeLock = null;
      this.isActive = false;
      
      console.log('Screen wake lock manually released');
      return { 
        success: true, 
        supported: true, 
        active: false 
      };
    } catch (error: any) {
      return { 
        success: false, 
        supported: true, 
        error: error.message 
      };
    }
  }

  /**
   * Проверяет активность wake lock
   */
  getStatus(): { active: boolean; supported: boolean } {
    return {
      active: this.isActive,
      supported: this.isSupported()
    };
  }

  /**
   * Автоматически переустанавливает wake lock при возвращении в приложение
   */
  setupAutoReacquire(): void {
    if (!this.isSupported()) return;

    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible' && this.isActive && !this.wakeLock) {
        console.log('Reacquiring wake lock after visibility change');
        await this.request();
      }
    });
  }
}

// Экспортируем единственный экземпляр
export const screenWakeLock = new ScreenWakeLockManager();

/**
 * Утилиты для медитации со screen wake lock
 */
export const meditationWakeLock = {
  /**
   * Начинает медитацию с wake lock
   */
  async startMeditation(): Promise<WakeLockResult> {
    console.log('Starting meditation with wake lock');
    return await screenWakeLock.request();
  },

  /**
   * Завершает медитацию и освобождает wake lock
   */
  async endMeditation(): Promise<WakeLockResult> {
    console.log('Ending meditation, releasing wake lock');
    return await screenWakeLock.release();
  },

  /**
   * Проверяет статус wake lock во время медитации
   */
  getMeditationStatus(): { wakeLockActive: boolean; supported: boolean } {
    const status = screenWakeLock.getStatus();
    return {
      wakeLockActive: status.active,
      supported: status.supported
    };
  }
};