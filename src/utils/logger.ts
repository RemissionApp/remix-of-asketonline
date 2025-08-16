interface LogLevel {
  NONE: 0;
  ERROR: 1;
  WARN: 2;
  INFO: 3;
  DEBUG: 4;
}

const LOG_LEVELS: LogLevel = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
};

const isDevelopment = import.meta.env.DEV;
const currentLogLevel = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : '';
    return `[${timestamp}] ${ctx} [${level}] ${message}`;
  }

  error(message: string, error?: Error | unknown, data?: any) {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message), error, data);

      // В продакшене можно отправлять в сервис мониторинга
      if (!isDevelopment && error instanceof Error) {
        this.sendToMonitoring('error', message, error, data);
      }
    }
  }

  warn(message: string, data?: any) {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message), data);
    }
  }

  info(message: string, data?: any) {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.info(this.formatMessage('INFO', message), data);
    }
  }

  debug(message: string, data?: any) {
    if (isDevelopment && currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message), data);
    }
  }

  private sendToMonitoring(
    level: string,
    message: string,
    error?: Error,
    data?: any
  ) {
    // Здесь можно интегрировать Sentry, LogRocket или другой сервис
    // Пока просто заглушка
    try {
      // fetch('/api/log', { method: 'POST', body: JSON.stringify({ level, message, error: error?.message, data }) });
    } catch (e) {
      // Игнорируем ошибки логирования
    }
  }
}

// Создаем инстансы для разных модулей
export const logger = new Logger();
export const createLogger = (context: string) => new Logger(context);

// Дефолтный экспорт для обратной совместимости
export default logger;
