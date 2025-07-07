// Badge API для счетчика уведомлений на иконке приложения
export interface BadgeResult {
  success: boolean;
  supported: boolean;
  count?: number;
  error?: string;
}

class BadgeManager {
  private currentCount = 0;

  /**
   * Проверяет поддержку Badge API
   */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'setAppBadge' in navigator;
  }

  /**
   * Устанавливает счетчик на иконке приложения
   */
  async setBadge(count?: number): Promise<BadgeResult> {
    if (!this.isSupported()) {
      return { success: false, supported: false };
    }

    try {
      if (count === undefined || count === 0) {
        await navigator.setAppBadge();
        this.currentCount = 0;
      } else {
        await navigator.setAppBadge(count);
        this.currentCount = count;
      }

      console.log(`App badge set to: ${count || 'default'}`);
      return { 
        success: true, 
        supported: true, 
        count: this.currentCount 
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
   * Очищает счетчик на иконке
   */
  async clearBadge(): Promise<BadgeResult> {
    if (!this.isSupported()) {
      return { success: false, supported: false };
    }

    try {
      await navigator.clearAppBadge();
      this.currentCount = 0;
      
      console.log('App badge cleared');
      return { 
        success: true, 
        supported: true, 
        count: 0 
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
   * Увеличивает счетчик на 1
   */
  async incrementBadge(): Promise<BadgeResult> {
    return await this.setBadge(this.currentCount + 1);
  }

  /**
   * Уменьшает счетчик на 1
   */
  async decrementBadge(): Promise<BadgeResult> {
    const newCount = Math.max(0, this.currentCount - 1);
    return newCount === 0 ? await this.clearBadge() : await this.setBadge(newCount);
  }

  /**
   * Получает текущий счетчик
   */
  getCurrentCount(): number {
    return this.currentCount;
  }

  /**
   * Получает статус badge
   */
  getStatus(): { count: number; supported: boolean } {
    return {
      count: this.currentCount,
      supported: this.isSupported()
    };
  }
}

// Экспортируем единственный экземпляр
export const badgeManager = new BadgeManager();

/**
 * Утилиты для управления счетчиками разных типов уведомлений
 */
export const notificationBadges = {
  /**
   * Обновляет badge для новых аскез/миссий
   */
  async updatePactsBadge(activePactsCount: number): Promise<BadgeResult> {
    if (activePactsCount === 0) {
      return await badgeManager.clearBadge();
    }
    return await badgeManager.setBadge(activePactsCount);
  },

  /**
   * Обновляет badge для непрочитанных сообщений
   */
  async updateMessagesBadge(unreadCount: number): Promise<BadgeResult> {
    if (unreadCount === 0) {
      return await badgeManager.clearBadge();
    }
    return await badgeManager.setBadge(unreadCount);
  },

  /**
   * Обновляет badge для новых достижений
   */
  async updateAchievementsBadge(newAchievementsCount: number): Promise<BadgeResult> {
    if (newAchievementsCount === 0) {
      return await badgeManager.clearBadge();
    }
    return await badgeManager.setBadge(newAchievementsCount);
  },

  /**
   * Комбинированный счетчик всех уведомлений
   */
  async updateTotalBadge(counts: {
    pacts?: number;
    messages?: number;
    achievements?: number;
    missions?: number;
  }): Promise<BadgeResult> {
    const total = (counts.pacts || 0) + 
                  (counts.messages || 0) + 
                  (counts.achievements || 0) + 
                  (counts.missions || 0);

    if (total === 0) {
      return await badgeManager.clearBadge();
    }
    return await badgeManager.setBadge(total);
  }
};

/**
 * Интеграция с localStorage для сохранения состояния badge
 */
export const persistentBadge = {
  /**
   * Сохраняет текущий счетчик в localStorage
   */
  saveBadgeCount(count: number): void {
    localStorage.setItem('app-badge-count', count.toString());
  },

  /**
   * Загружает счетчик из localStorage
   */
  loadBadgeCount(): number {
    const saved = localStorage.getItem('app-badge-count');
    return saved ? parseInt(saved, 10) : 0;
  },

  /**
   * Восстанавливает badge при запуске приложения
   */
  async restoreBadge(): Promise<BadgeResult> {
    const savedCount = this.loadBadgeCount();
    if (savedCount > 0) {
      return await badgeManager.setBadge(savedCount);
    }
    return await badgeManager.clearBadge();
  },

  /**
   * Устанавливает badge и сохраняет в localStorage
   */
  async setBadgeAndSave(count: number): Promise<BadgeResult> {
    const result = await badgeManager.setBadge(count);
    if (result.success) {
      this.saveBadgeCount(count);
    }
    return result;
  },

  /**
   * Очищает badge и удаляет из localStorage
   */
  async clearBadgeAndSave(): Promise<BadgeResult> {
    const result = await badgeManager.clearBadge();
    if (result.success) {
      localStorage.removeItem('app-badge-count');
    }
    return result;
  }
};