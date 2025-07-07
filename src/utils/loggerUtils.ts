// Утилиты для логирования с контекстом
import { logger } from './logger';

/**
 * Создает логгер с контекстом
 */
export const createLogger = (context: string) => {
  return {
    info: (message: string, data?: any) => logger.info(`[${context}] ${message}`, data),
    warn: (message: string, data?: any) => logger.warn(`[${context}] ${message}`, data),
    error: (message: string, error?: Error | unknown, data?: any) => logger.error(`[${context}] ${message}`, error, data),
    debug: (message: string, data?: any) => logger.debug(`[${context}] ${message}`, data)
  };
};

// Экспортируем для обратной совместимости
export { logger } from './logger';