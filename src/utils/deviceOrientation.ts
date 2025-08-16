// Device Orientation API для адаптации интерфейса
export interface OrientationLockResult {
  success: boolean;
  supported: boolean;
  orientation?: string;
  error?: string;
}

export type OrientationType =
  | 'any'
  | 'natural'
  | 'landscape'
  | 'landscape-primary'
  | 'landscape-secondary'
  | 'portrait'
  | 'portrait-primary'
  | 'portrait-secondary';

class DeviceOrientationManager {
  private currentOrientation: string = 'unknown';
  private lockActive = false;
  private orientationChangeListeners: Array<(orientation: string) => void> = [];

  /**
   * Проверяет поддержку Screen Orientation API
   */
  isSupported(): boolean {
    return typeof screen !== 'undefined' && 'orientation' in screen;
  }

  /**
   * Получает текущую ориентацию
   */
  getCurrentOrientation(): string {
    if (!this.isSupported()) return 'unknown';

    if (screen.orientation) {
      return screen.orientation.type;
    }

    // Fallback для старых браузеров
    if (window.innerWidth > window.innerHeight) {
      return 'landscape';
    } else {
      return 'portrait';
    }
  }

  /**
   * Блокирует ориентацию
   */
  async lockOrientation(
    orientation: OrientationType
  ): Promise<OrientationLockResult> {
    if (!this.isSupported()) {
      return { success: false, supported: false };
    }

    try {
      // Проверяем наличие метода lock
      if (!screen.orientation || !('lock' in screen.orientation)) {
        throw new Error('Screen orientation lock not supported');
      }

      await (screen.orientation as any).lock(orientation);
      this.lockActive = true;
      console.log(`Orientation locked to: ${orientation}`);

      return {
        success: true,
        supported: true,
        orientation: this.getCurrentOrientation(),
      };
    } catch (error: any) {
      return {
        success: false,
        supported: true,
        error: error.message,
      };
    }
  }

  /**
   * Разблокирует ориентацию
   */
  async unlockOrientation(): Promise<OrientationLockResult> {
    if (!this.isSupported()) {
      return { success: false, supported: false };
    }

    try {
      // Проверяем наличие метода unlock
      if (!screen.orientation || !('unlock' in screen.orientation)) {
        throw new Error('Screen orientation unlock not supported');
      }

      (screen.orientation as any).unlock();
      this.lockActive = false;
      console.log('Orientation unlocked');

      return {
        success: true,
        supported: true,
        orientation: this.getCurrentOrientation(),
      };
    } catch (error: any) {
      return {
        success: false,
        supported: true,
        error: error.message,
      };
    }
  }

  /**
   * Добавляет слушатель изменения ориентации
   */
  addOrientationChangeListener(callback: (orientation: string) => void): void {
    this.orientationChangeListeners.push(callback);

    if (this.isSupported() && screen.orientation) {
      screen.orientation.addEventListener('change', () => {
        const newOrientation = this.getCurrentOrientation();
        this.currentOrientation = newOrientation;
        callback(newOrientation);
      });
    } else {
      // Fallback для старых браузеров
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          const newOrientation = this.getCurrentOrientation();
          this.currentOrientation = newOrientation;
          callback(newOrientation);
        }, 100);
      });
    }
  }

  /**
   * Получает статус ориентации
   */
  getStatus(): {
    current: string;
    locked: boolean;
    supported: boolean;
    angle?: number;
  } {
    const current = this.getCurrentOrientation();

    return {
      current,
      locked: this.lockActive,
      supported: this.isSupported(),
      angle:
        this.isSupported() && screen.orientation
          ? screen.orientation.angle
          : undefined,
    };
  }

  /**
   * Определяет, является ли устройство мобильным
   */
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  /**
   * Получает размеры экрана с учетом ориентации
   */
  getScreenDimensions(): {
    width: number;
    height: number;
    isLandscape: boolean;
  } {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
      isLandscape: width > height,
    };
  }
}

// Экспортируем единственный экземпляр
export const deviceOrientation = new DeviceOrientationManager();

/**
 * Утилиты для медитации с блокировкой ориентации
 */
export const meditationOrientation = {
  /**
   * Блокирует ориентацию для медитации (портретная)
   */
  async lockForMeditation(): Promise<OrientationLockResult> {
    console.log('Locking orientation for meditation');
    return await deviceOrientation.lockOrientation('portrait');
  },

  /**
   * Разблокирует ориентацию после медитации
   */
  async unlockAfterMeditation(): Promise<OrientationLockResult> {
    console.log('Unlocking orientation after meditation');
    return await deviceOrientation.unlockOrientation();
  },
};

/**
 * Утилиты для адаптивного дизайна
 */
export const responsiveOrientation = {
  /**
   * Добавляет CSS класс в зависимости от ориентации
   */
  setupResponsiveClasses(): void {
    const updateClasses = (orientation: string) => {
      document.body.classList.remove(
        'orientation-portrait',
        'orientation-landscape'
      );

      if (orientation.includes('portrait')) {
        document.body.classList.add('orientation-portrait');
      } else if (orientation.includes('landscape')) {
        document.body.classList.add('orientation-landscape');
      }
    };

    // Устанавливаем начальный класс
    updateClasses(deviceOrientation.getCurrentOrientation());

    // Добавляем слушатель
    deviceOrientation.addOrientationChangeListener(updateClasses);
  },

  /**
   * Получает рекомендуемую ориентацию для экрана
   */
  getRecommendedOrientation(
    screenType: 'meditation' | 'chat' | 'main'
  ): OrientationType {
    switch (screenType) {
      case 'meditation':
        return 'portrait'; // Медитация лучше в портретной ориентации
      case 'chat':
        return 'any'; // Чат работает в любой ориентации
      case 'main':
        return 'any'; // Главная страница адаптивная
      default:
        return 'any';
    }
  },
};
