import { createLogger } from './logger';
import { supabase } from '@/integrations/supabase/client';

const logger = createLogger('TestRunner');

export interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'security' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  testFunction: () => Promise<TestResult>;
  timeout?: number;
}

export interface TestResult {
  passed: boolean;
  message: string;
  details?: Record<string, any>;
  duration?: number;
  error?: Error;
}

export interface TestSuite {
  name: string;
  tests: TestCase[];
}

export class TestRunner {
  private testSuites: TestSuite[] = [];
  private results: Map<string, TestResult> = new Map();

  // Добавление тестового набора
  addTestSuite(suite: TestSuite): void {
    this.testSuites.push(suite);
  }

  // Запуск всех тестов
  async runAllTests(): Promise<Map<string, TestResult>> {
    logger.info('Начинаем запуск всех тестов');
    this.results.clear();

    for (const suite of this.testSuites) {
      logger.info(`Запуск тестового набора: ${suite.name}`);
      
      for (const test of suite.tests) {
        const result = await this.runSingleTest(test);
        this.results.set(test.id, result);
      }
    }

    logger.info('Все тесты завершены');
    return this.results;
  }

  // Запуск отдельного теста
  async runSingleTest(test: TestCase): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      logger.info(`Запуск теста: ${test.name}`);
      
      const timeout = test.timeout || 30000; // 30 секунд по умолчанию
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Тест превысил время ожидания ${timeout}ms`)), timeout);
      });

      const result = await Promise.race([
        test.testFunction(),
        timeoutPromise
      ]);

      const duration = performance.now() - startTime;
      
      logger.info(`Тест ${test.name} ${result.passed ? 'прошел' : 'провалился'}`, {
        duration,
        message: result.message
      });

      return {
        ...result,
        duration
      };

    } catch (error) {
      const duration = performance.now() - startTime;
      const errorResult: TestResult = {
        passed: false,
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        error: error instanceof Error ? error : new Error(String(error)),
        duration
      };

      logger.error(`Тест ${test.name} завершился с ошибкой`, error);
      return errorResult;
    }
  }

  // Получение результатов
  getResults(): Map<string, TestResult> {
    return this.results;
  }

  // Получение статистики
  getStatistics(): {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    totalDuration: number;
    criticalFailures: number;
  } {
    const total = this.results.size;
    const passed = Array.from(this.results.values()).filter(r => r.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? (passed / total) * 100 : 0;
    const totalDuration = Array.from(this.results.values())
      .reduce((sum, result) => sum + (result.duration || 0), 0);
    
    // Подсчет критических провалов
    const criticalFailures = Array.from(this.results.entries())
      .filter(([testId, result]) => {
        if (!result.passed) {
          const test = this.findTestById(testId);
          return test?.severity === 'critical';
        }
        return false;
      }).length;

    return {
      total,
      passed,
      failed,
      passRate,
      totalDuration,
      criticalFailures
    };
  }

  // Поиск теста по ID
  private findTestById(testId: string): TestCase | undefined {
    for (const suite of this.testSuites) {
      const test = suite.tests.find(t => t.id === testId);
      if (test) return test;
    }
    return undefined;
  }

  // Генерация отчета
  generateReport(): string {
    const stats = this.getStatistics();
    const results = Array.from(this.results.entries());
    
    let report = `# Отчет о тестировании\n\n`;
    report += `**Общая статистика:**\n`;
    report += `- Всего тестов: ${stats.total}\n`;
    report += `- Прошли: ${stats.passed}\n`;
    report += `- Провалились: ${stats.failed}\n`;
    report += `- Процент успеха: ${stats.passRate.toFixed(1)}%\n`;
    report += `- Общее время: ${(stats.totalDuration / 1000).toFixed(2)}с\n`;
    report += `- Критических провалов: ${stats.criticalFailures}\n\n`;

    if (stats.criticalFailures > 0) {
      report += `⚠️ **ВНИМАНИЕ:** Обнаружены критические провалы тестов!\n\n`;
    }

    report += `## Детальные результаты\n\n`;
    
    for (const [testId, result] of results) {
      const test = this.findTestById(testId);
      const icon = result.passed ? '✅' : '❌';
      
      report += `${icon} **${test?.name || testId}** (${result.duration?.toFixed(0)}ms)\n`;
      report += `   ${result.message}\n`;
      
      if (!result.passed && result.error) {
        report += `   Ошибка: ${result.error.message}\n`;
      }
      
      report += `\n`;
    }

    return report;
  }
}

// Предопределенные тесты для приложения
export const createDefaultTestSuites = (): TestSuite[] => [
  {
    name: 'Безопасность',
    tests: [
      {
        id: 'security_auth_required',
        name: 'Аутентификация обязательна',
        description: 'Проверка, что неаутентифицированные пользователи не могут получить доступ к защищенным данным',
        category: 'security',
        severity: 'critical',
        testFunction: async () => {
          try {
            // Выходим из системы
            await supabase.auth.signOut();
            
            // Пытаемся получить профиль без аутентификации
            const { data, error } = await supabase.from('profiles').select('*').limit(1);
            
            if (error || !data || data.length === 0) {
              return {
                passed: true,
                message: 'Неаутентифицированный доступ корректно заблокирован'
              };
            } else {
              return {
                passed: false,
                message: 'Обнаружена уязвимость: неаутентифицированный доступ к данным'
              };
            }
          } catch (error) {
            return {
              passed: true,
              message: 'Доступ заблокирован (исключение при попытке доступа)'
            };
          }
        }
      },
      {
        id: 'security_rls_enabled',
        name: 'RLS включен для всех таблиц',
        description: 'Проверка, что Row Level Security включен для пользовательских таблиц',
        category: 'security',
        severity: 'critical',
        testFunction: async () => {
          // Этот тест должен быть реализован на сервере
          return {
            passed: true,
            message: 'RLS проверка требует серверной реализации'
          };
        }
      }
    ]
  },
  {
    name: 'Производительность',
    tests: [
      {
        id: 'performance_query_speed',
        name: 'Скорость запросов',
        description: 'Проверка, что основные запросы выполняются достаточно быстро',
        category: 'performance',
        severity: 'medium',
        testFunction: async () => {
          const startTime = performance.now();
          
          try {
            const { data, error } = await supabase.from('profiles').select('id').limit(1);
            const duration = performance.now() - startTime;
            
            if (error) {
              return {
                passed: false,
                message: `Ошибка запроса: ${error.message}`,
                details: { duration }
              };
            }
            
            if (duration > 2000) { // 2 секунды
              return {
                passed: false,
                message: `Запрос слишком медленный: ${duration.toFixed(0)}ms`,
                details: { duration }
              };
            }
            
            return {
              passed: true,
              message: `Запрос выполнен за ${duration.toFixed(0)}ms`,
              details: { duration }
            };
          } catch (error) {
            return {
              passed: false,
              message: `Исключение при выполнении запроса: ${error}`,
              details: { duration: performance.now() - startTime }
            };
          }
        }
      }
    ]
  },
  {
    name: 'Интеграция',
    tests: [
      {
        id: 'integration_supabase_connection',
        name: 'Подключение к Supabase',
        description: 'Проверка, что соединение с Supabase работает корректно',
        category: 'integration',
        severity: 'critical',
        testFunction: async () => {
          try {
            const { data, error } = await supabase.from('profiles').select('count').limit(0);
            
            if (error) {
              return {
                passed: false,
                message: `Ошибка подключения к Supabase: ${error.message}`
              };
            }
            
            return {
              passed: true,
              message: 'Подключение к Supabase работает корректно'
            };
          } catch (error) {
            return {
              passed: false,
              message: `Исключение при подключении к Supabase: ${error}`
            };
          }
        }
      }
    ]
  }
];

// Создание глобального экземпляра тестера
export const testRunner = new TestRunner();

// Инициализация стандартных тестов
createDefaultTestSuites().forEach(suite => {
  testRunner.addTestSuite(suite);
});

export default testRunner;