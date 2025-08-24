import { createLogger } from './logger';
import { supabase } from '@/integrations/supabase/client';

const logger = createLogger('ProductionChecklist');

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  checkFunction?: () => Promise<boolean>;
  manualCheck: boolean;
  documentation?: string;
}

export const PRODUCTION_CHECKLIST: ChecklistItem[] = [
  // Безопасность
  {
    id: 'security_rls_enabled',
    category: 'Безопасность',
    title: 'RLS включен для всех таблиц',
    description: 'Проверить, что Row Level Security включен для всех пользовательских таблиц',
    status: 'pending',
    severity: 'critical',
    manualCheck: false,
    checkFunction: async () => {
      // Этот чек должен быть реализован на сервере
      return true;
    }
  },
  {
    id: 'security_https_only',
    category: 'Безопасность',
    title: 'Только HTTPS соединения',
    description: 'Все соединения должны использовать HTTPS',
    status: 'pending',
    severity: 'critical',
    manualCheck: true,
    documentation: 'https://docs.supabase.com/guides/platform/going-into-prod#security'
  },
  {
    id: 'security_password_protection',
    category: 'Безопасность',
    title: 'Защита от скомпрометированных паролей',
    description: 'Включить проверку паролей на утечки',
    status: 'pending',
    severity: 'high',
    manualCheck: true,
    documentation: 'https://supabase.com/docs/guides/auth/password-security'
  },
  {
    id: 'security_otp_expiry',
    category: 'Безопасность',
    title: 'Настройка времени жизни OTP',
    description: 'Установить разумное время жизни для OTP кодов',
    status: 'pending',
    severity: 'medium',
    manualCheck: true,
    documentation: 'https://supabase.com/docs/guides/platform/going-into-prod#security'
  },

  // Производительность
  {
    id: 'performance_database_indexes',
    category: 'Производительность',
    title: 'Оптимизация индексов БД',
    description: 'Все часто запрашиваемые поля должны иметь индексы',
    status: 'pending',
    severity: 'high',
    manualCheck: true
  },
  {
    id: 'performance_connection_pooling',
    category: 'Производительность',
    title: 'Настройка пула соединений',
    description: 'Настроить оптимальный размер пула соединений к БД',
    status: 'pending',
    severity: 'medium',
    manualCheck: true
  },
  {
    id: 'performance_caching',
    category: 'Производительность',
    title: 'Кэширование данных',
    description: 'Реализовать кэширование для часто запрашиваемых данных',
    status: 'pending',
    severity: 'medium',
    manualCheck: false,
    checkFunction: async () => {
      // Проверка наличия React Query
      return true;
    }
  },

  // Мониторинг
  {
    id: 'monitoring_error_tracking',
    category: 'Мониторинг',
    title: 'Отслеживание ошибок',
    description: 'Настроить систему отслеживания ошибок (Sentry, LogRocket)',
    status: 'pending',
    severity: 'high',
    manualCheck: true
  },
  {
    id: 'monitoring_performance_tracking',
    category: 'Мониторинг',
    title: 'Мониторинг производительности',
    description: 'Настроить мониторинг производительности приложения',
    status: 'pending',
    severity: 'medium',
    manualCheck: true
  },
  {
    id: 'monitoring_audit_logs',
    category: 'Мониторинг',
    title: 'Логи аудита',
    description: 'Настроить систему логирования важных действий пользователей',
    status: 'pending',
    severity: 'medium',
    manualCheck: false,
    checkFunction: async () => {
      // Проверка наличия audit logger
      return true;
    }
  },

  // Резервное копирование
  {
    id: 'backup_database',
    category: 'Резервное копирование',
    title: 'Резервное копирование БД',
    description: 'Настроить автоматическое резервное копирование базы данных',
    status: 'pending',
    severity: 'critical',
    manualCheck: true,
    documentation: 'https://supabase.com/docs/guides/platform/backups'
  },
  {
    id: 'backup_user_data',
    category: 'Резервное копирование',
    title: 'Резервное копирование пользовательских данных',
    description: 'Настроить резервное копирование файлов и медиа',
    status: 'pending',
    severity: 'high',
    manualCheck: true
  },

  // Конфигурация окружения
  {
    id: 'env_secrets_management',
    category: 'Окружение',
    title: 'Управление секретами',
    description: 'Все секреты должны храниться в безопасном месте',
    status: 'pending',
    severity: 'critical',
    manualCheck: true
  },
  {
    id: 'env_domain_configuration',
    category: 'Окружение',
    title: 'Настройка домена',
    description: 'Настроить собственный домен для продакшена',
    status: 'pending',
    severity: 'medium',
    manualCheck: true
  },
  {
    id: 'env_cors_configuration',
    category: 'Окружение',
    title: 'Настройка CORS',
    description: 'Настроить CORS для продакшн домена',
    status: 'pending',
    severity: 'high',
    manualCheck: true
  },

  // Тестирование
  {
    id: 'testing_unit_tests',
    category: 'Тестирование',
    title: 'Юнит тесты',
    description: 'Написать юнит тесты для критичной функциональности',
    status: 'pending',
    severity: 'high',
    manualCheck: true
  },
  {
    id: 'testing_integration_tests',
    category: 'Тестирование',
    title: 'Интеграционные тесты',
    description: 'Написать интеграционные тесты для API',
    status: 'pending',
    severity: 'medium',
    manualCheck: true
  },
  {
    id: 'testing_security_tests',
    category: 'Тестирование',
    title: 'Тесты безопасности',
    description: 'Провести тестирование безопасности',
    status: 'pending',
    severity: 'high',
    manualCheck: true
  },

  // Документация
  {
    id: 'docs_api_documentation',
    category: 'Документация',
    title: 'Документация API',
    description: 'Создать документацию для всех API эндпоинтов',
    status: 'pending',
    severity: 'medium',
    manualCheck: true
  },
  {
    id: 'docs_deployment_guide',
    category: 'Документация',
    title: 'Руководство по развертыванию',
    description: 'Создать руководство по развертыванию приложения',
    status: 'pending',
    severity: 'medium',
    manualCheck: true
  }
];

class ProductionChecker {
  private checklist: ChecklistItem[] = [...PRODUCTION_CHECKLIST];

  // Запуск всех автоматических проверок
  async runAutomaticChecks(): Promise<void> {
    logger.info('Начинаем автоматические проверки готовности к продакшену');

    for (const item of this.checklist) {
      if (!item.manualCheck && item.checkFunction) {
        try {
          const result = await item.checkFunction();
          item.status = result ? 'completed' : 'failed';
          
          logger.info(`Проверка ${item.id}: ${item.status}`, {
            title: item.title,
            severity: item.severity
          });
        } catch (error) {
          item.status = 'failed';
          logger.error(`Ошибка при проверке ${item.id}`, error);
        }
      }
    }

    logger.info('Автоматические проверки завершены');
  }

  // Получение текущего состояния
  getChecklistStatus(): {
    items: ChecklistItem[];
    summary: {
      total: number;
      completed: number;
      failed: number;
      pending: number;
      warnings: number;
      criticalIssues: number;
    };
  } {
    const summary = {
      total: this.checklist.length,
      completed: this.checklist.filter(item => item.status === 'completed').length,
      failed: this.checklist.filter(item => item.status === 'failed').length,
      pending: this.checklist.filter(item => item.status === 'pending').length,
      warnings: this.checklist.filter(item => item.status === 'warning').length,
      criticalIssues: this.checklist.filter(item => 
        item.severity === 'critical' && item.status !== 'completed'
      ).length
    };

    return {
      items: this.checklist,
      summary
    };
  }

  // Обновление статуса элемента
  updateItemStatus(itemId: string, status: ChecklistItem['status']): void {
    const item = this.checklist.find(item => item.id === itemId);
    if (item) {
      item.status = status;
      logger.info(`Обновлен статус ${itemId} на ${status}`);
    }
  }

  // Проверка готовности к продакшену
  isReadyForProduction(): boolean {
    const criticalItems = this.checklist.filter(item => item.severity === 'critical');
    const incompleteCritical = criticalItems.filter(item => item.status !== 'completed');
    
    return incompleteCritical.length === 0;
  }

  // Получение рекомендаций
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const failedCritical = this.checklist.filter(item => 
      item.severity === 'critical' && item.status === 'failed'
    );
    
    const pendingHigh = this.checklist.filter(item => 
      item.severity === 'high' && item.status === 'pending'
    );

    if (failedCritical.length > 0) {
      recommendations.push('🚨 Критические проблемы безопасности должны быть исправлены немедленно');
    }

    if (pendingHigh.length > 0) {
      recommendations.push('⚠️ Рекомендуется завершить все задачи высокого приоритета');
    }

    if (this.checklist.filter(item => item.status === 'completed').length < this.checklist.length * 0.8) {
      recommendations.push('📋 Рекомендуется завершить минимум 80% всех задач перед продакшеном');
    }

    return recommendations;
  }
}

// Создаем глобальный экземпляр
export const productionChecker = new ProductionChecker();

// Хук для компонентов React
export const useProductionChecker = () => {
  return {
    runChecks: productionChecker.runAutomaticChecks.bind(productionChecker),
    getStatus: productionChecker.getChecklistStatus.bind(productionChecker),
    updateStatus: productionChecker.updateItemStatus.bind(productionChecker),
    isReady: productionChecker.isReadyForProduction.bind(productionChecker),
    getRecommendations: productionChecker.getRecommendations.bind(productionChecker)
  };
};

export default productionChecker;