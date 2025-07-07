// Background Sync для синхронизации данных в фоне
export interface SyncTask {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export interface SyncResult {
  success: boolean;
  error?: string;
  retryAfter?: number;
}

/**
 * Проверяет поддержку Background Sync
 */
export const isBackgroundSyncSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
};

/**
 * Менеджер Background Sync
 */
export class BackgroundSyncManager {
  private static instance: BackgroundSyncManager;
  private pendingTasks: Map<string, SyncTask> = new Map();
  private isOnline: boolean = navigator.onLine;

  static getInstance(): BackgroundSyncManager {
    if (!BackgroundSyncManager.instance) {
      BackgroundSyncManager.instance = new BackgroundSyncManager();
    }
    return BackgroundSyncManager.instance;
  }

  constructor() {
    this.initializeEventListeners();
    this.loadPendingTasks();
  }

  /**
   * Инициализация слушателей событий
   */
  private initializeEventListeners(): void {
    // Слушаем изменения сетевого статуса
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingTasks();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Слушаем события от Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'sync-complete') {
          this.handleSyncComplete(event.data.taskId, event.data.success);
        }
      });
    }
  }

  /**
   * Загружает отложенные задачи из localStorage
   */
  private loadPendingTasks(): void {
    try {
      const stored = localStorage.getItem('background-sync-tasks');
      if (stored) {
        const tasks: SyncTask[] = JSON.parse(stored);
        tasks.forEach(task => {
          this.pendingTasks.set(task.id, task);
        });
      }
    } catch (error) {
      console.error('Error loading pending sync tasks:', error);
    }
  }

  /**
   * Сохраняет отложенные задачи в localStorage
   */
  private savePendingTasks(): void {
    try {
      const tasks = Array.from(this.pendingTasks.values());
      localStorage.setItem('background-sync-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving pending sync tasks:', error);
    }
  }

  /**
   * Регистрирует задачу для синхронизации
   */
  async registerSync(type: string, data: any, options: {
    maxRetries?: number;
    immediate?: boolean;
  } = {}): Promise<string> {
    const taskId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const task: SyncTask = {
      id: taskId,
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: options.maxRetries || 3
    };

    this.pendingTasks.set(taskId, task);
    this.savePendingTasks();

    // Если онлайн и нужна немедленная синхронизация
    if (this.isOnline && options.immediate) {
      await this.executeTask(task);
    } else if (isBackgroundSyncSupported()) {
      // Регистрируем Background Sync через Service Worker
      try {
        const registration = await navigator.serviceWorker.ready;
        // Используем any для обхода TypeScript ограничений
        await (registration as any).sync?.register(taskId);
      } catch (error) {
        console.error('Error registering background sync:', error);
        // Fallback: выполняем задачу сразу если онлайн
        if (this.isOnline) {
          await this.executeTask(task);
        }
      }
    } else if (this.isOnline) {
      // Fallback: выполняем задачу сразу
      await this.executeTask(task);
    }

    return taskId;
  }

  /**
   * Выполняет задачу синхронизации
   */
  private async executeTask(task: SyncTask): Promise<SyncResult> {
    try {
      let result: SyncResult;

      switch (task.type) {
        case 'pact_day_complete':
          result = await this.syncPactDayComplete(task.data);
          break;
        
        case 'pact_break':
          result = await this.syncPactBreak(task.data);
          break;
        
        case 'universe_question':
          result = await this.syncUniverseQuestion(task.data);
          break;
        
        case 'user_profile_update':
          result = await this.syncUserProfileUpdate(task.data);
          break;
        
        case 'mission_progress':
          result = await this.syncMissionProgress(task.data);
          break;
        
        default:
          result = { success: false, error: `Unknown sync type: ${task.type}` };
      }

      if (result.success) {
        this.pendingTasks.delete(task.id);
        this.savePendingTasks();
      } else {
        // Увеличиваем счетчик попыток
        task.retries++;
        if (task.retries >= task.maxRetries) {
          // Удаляем задачу после превышения лимита попыток
          this.pendingTasks.delete(task.id);
          this.savePendingTasks();
          console.error(`Task ${task.id} failed after ${task.maxRetries} retries`);
        } else {
          // Сохраняем обновленную задачу
          this.savePendingTasks();
        }
      }

      return result;
    } catch (error: any) {
      task.retries++;
      if (task.retries >= task.maxRetries) {
        this.pendingTasks.delete(task.id);
      }
      this.savePendingTasks();
      
      return { 
        success: false, 
        error: error.message,
        retryAfter: this.calculateRetryDelay(task.retries)
      };
    }
  }

  /**
   * Обрабатывает все отложенные задачи
   */
  private async processPendingTasks(): Promise<void> {
    if (!this.isOnline) return;

    const tasks = Array.from(this.pendingTasks.values());
    for (const task of tasks) {
      await this.executeTask(task);
      // Небольшая задержка между задачами
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Обработчик завершения синхронизации от Service Worker
   */
  private handleSyncComplete(taskId: string, success: boolean): void {
    if (success) {
      this.pendingTasks.delete(taskId);
      this.savePendingTasks();
    }
  }

  /**
   * Вычисляет задержку для повторной попытки
   */
  private calculateRetryDelay(retryCount: number): number {
    // Экспоненциальная задержка: 1s, 2s, 4s, 8s...
    return Math.min(1000 * Math.pow(2, retryCount), 30000);
  }

  /**
   * Синхронизация завершения дня аскезы
   */
  private async syncPactDayComplete(data: { pactId: string; date: string }): Promise<SyncResult> {
    try {
      // Здесь будет реальная логика синхронизации с API
      // Пока заглушка
      console.log('Syncing pact day complete:', data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Синхронизация нарушения аскезы
   */
  private async syncPactBreak(data: { pactId: string }): Promise<SyncResult> {
    try {
      console.log('Syncing pact break:', data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Синхронизация вопроса Вселенной
   */
  private async syncUniverseQuestion(data: { question: string; answer: string }): Promise<SyncResult> {
    try {
      console.log('Syncing universe question:', data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Синхронизация обновления профиля
   */
  private async syncUserProfileUpdate(data: any): Promise<SyncResult> {
    try {
      console.log('Syncing user profile update:', data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Синхронизация прогресса миссий
   */
  private async syncMissionProgress(data: { missionId: string; progress: any }): Promise<SyncResult> {
    try {
      console.log('Syncing mission progress:', data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Получает список отложенных задач
   */
  getPendingTasks(): SyncTask[] {
    return Array.from(this.pendingTasks.values());
  }

  /**
   * Очищает все отложенные задачи
   */
  clearPendingTasks(): void {
    this.pendingTasks.clear();
    localStorage.removeItem('background-sync-tasks');
  }

  /**
   * Проверяет статус синхронизации
   */
  getSyncStatus(): {
    isOnline: boolean;
    pendingCount: number;
    isSupported: boolean;
  } {
    return {
      isOnline: this.isOnline,
      pendingCount: this.pendingTasks.size,
      isSupported: isBackgroundSyncSupported()
    };
  }
}

// Экспортируем singleton
export const backgroundSync = BackgroundSyncManager.getInstance();