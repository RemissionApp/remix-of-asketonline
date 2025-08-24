import { createLogger } from './logger';
import { supabase } from '@/integrations/supabase/client';

const logger = createLogger('AuditLogger');

export interface AuditEvent {
  id?: string;
  userId?: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp?: Date;
  userAgent?: string;
  ipAddress?: string;
}

class AuditLogger {
  private eventQueue: AuditEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly FLUSH_INTERVAL = 30000; // 30 секунд
  private readonly MAX_QUEUE_SIZE = 100;

  constructor() {
    this.startPeriodicFlush();
  }

  // Логирование события аудита
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const auditEvent: AuditEvent = {
        ...event,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        // ipAddress будет определен на сервере
      };

      // Добавляем в очередь
      this.eventQueue.push(auditEvent);

      // Немедленно отправляем критические события
      if (event.severity === 'critical') {
        await this.flushEvents();
      }

      // Если очередь переполнена, принудительно сбрасываем
      if (this.eventQueue.length >= this.MAX_QUEUE_SIZE) {
        await this.flushEvents();
      }

      // Логируем локально для отладки
      logger.info(`Audit Event: ${event.action}`, auditEvent);

    } catch (error) {
      logger.error('Ошибка при логировании события аудита', error);
    }
  }

  // Специализированные методы для частых событий
  async logLogin(userId: string, success: boolean, details?: Record<string, any>): Promise<void> {
    await this.logEvent({
      userId,
      action: success ? 'login_success' : 'login_failed',
      resource: 'authentication',
      severity: success ? 'info' : 'warning',
      details
    });
  }

  async logDataAccess(userId: string, resource: string, operation: string, details?: Record<string, any>): Promise<void> {
    await this.logEvent({
      userId,
      action: `data_${operation}`,
      resource,
      severity: 'info',
      details
    });
  }

  async logSecurityViolation(userId: string | undefined, violation: string, details?: Record<string, any>): Promise<void> {
    await this.logEvent({
      userId,
      action: 'security_violation',
      resource: 'security',
      severity: 'critical',
      details: { violation, ...details }
    });
  }

  async logPermissionChange(userId: string, targetUser: string, oldPermissions: string[], newPermissions: string[]): Promise<void> {
    await this.logEvent({
      userId,
      action: 'permission_change',
      resource: 'user_management',
      severity: 'warning',
      details: {
        targetUser,
        oldPermissions,
        newPermissions,
        changes: this.calculatePermissionChanges(oldPermissions, newPermissions)
      }
    });
  }

  async logDataExport(userId: string, dataType: string, recordCount: number): Promise<void> {
    await this.logEvent({
      userId,
      action: 'data_export',
      resource: 'data_management',
      severity: 'warning',
      details: {
        dataType,
        recordCount,
        exportTime: new Date().toISOString()
      }
    });
  }

  // Сброс событий в базу данных
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      const eventsToSend = [...this.eventQueue];
      this.eventQueue = [];

      // В продакшене здесь должна быть отправка на сервер
      // Пока логируем локально
      logger.info(`Отправляем ${eventsToSend.length} событий аудита`, {
        events: eventsToSend.map(e => ({
          action: e.action,
          resource: e.resource,
          severity: e.severity,
          timestamp: e.timestamp
        }))
      });

    } catch (error) {
      logger.error('Ошибка при сбросе событий аудита', error);
      // Возвращаем события обратно в очередь при ошибке
      // this.eventQueue.unshift(...eventsToSend);
    }
  }

  // Периодический сброс событий
  private startPeriodicFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, this.FLUSH_INTERVAL);
  }

  // Остановка периодического сброса
  public stopPeriodicFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  // Принудительный сброс всех событий
  public async flush(): Promise<void> {
    await this.flushEvents();
  }

  // Вычисление изменений в разрешениях
  private calculatePermissionChanges(oldPermissions: string[], newPermissions: string[]): Record<string, string[]> {
    const added = newPermissions.filter(p => !oldPermissions.includes(p));
    const removed = oldPermissions.filter(p => !newPermissions.includes(p));
    
    return { added, removed };
  }

  // Получение статистики событий
  public getQueueStats(): { queueSize: number; isFlushActive: boolean } {
    return {
      queueSize: this.eventQueue.length,
      isFlushActive: this.flushInterval !== null
    };
  }
}

// Создаем глобальный экземпляр
export const auditLogger = new AuditLogger();

// Хук для компонентов React
export const useAuditLogger = () => {
  return {
    logEvent: auditLogger.logEvent.bind(auditLogger),
    logLogin: auditLogger.logLogin.bind(auditLogger),
    logDataAccess: auditLogger.logDataAccess.bind(auditLogger),
    logSecurityViolation: auditLogger.logSecurityViolation.bind(auditLogger),
    logPermissionChange: auditLogger.logPermissionChange.bind(auditLogger),
    logDataExport: auditLogger.logDataExport.bind(auditLogger),
    flush: auditLogger.flush.bind(auditLogger),
    getStats: auditLogger.getQueueStats.bind(auditLogger)
  };
};

// Очистка при закрытии приложения
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    auditLogger.flush();
    auditLogger.stopPeriodicFlush();
  });
}

export default auditLogger;