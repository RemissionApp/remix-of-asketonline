import { createLogger } from './logger';

const logger = createLogger('SecurityConfig');

// Конфигурация безопасности для продакшена
export const SECURITY_CONFIG = {
  // Настройки аутентификации
  auth: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 минут
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 часа
    requireEmailVerification: true,
    passwordMinLength: 8,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
  },
  
  // Настройки защиты данных
  dataProtection: {
    encryptSensitiveData: true,
    logDataAccess: true,
    anonymizeUserData: false,
    dataDeletionGracePeriod: 30, // дней
  },
  
  // Настройки мониторинга
  monitoring: {
    logSecurityEvents: true,
    alertOnSuspiciousActivity: true,
    trackFailedLogins: true,
    trackDataAccess: true,
    enableAuditLog: true,
  },
  
  // Настройки API безопасности
  api: {
    rateLimitPerMinute: 100,
    rateLimitPerHour: 1000,
    enableCors: true,
    allowedOrigins: ['https://localhost:3000', 'https://app.yourdomain.com'],
    requireApiKey: false,
    enableRequestLogging: true,
  },
  
  // Настройки защиты от атак
  protection: {
    enableCSRFProtection: true,
    enableXSSProtection: true,
    enableSQLInjectionProtection: true,
    enableClickjackingProtection: true,
    enableContentTypeSniffingProtection: true,
  }
} as const;

// Валидация пароля
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = SECURITY_CONFIG.auth;
  
  if (password.length < config.passwordMinLength) {
    errors.push(`Пароль должен содержать минимум ${config.passwordMinLength} символов`);
  }
  
  if (config.passwordRequireNumbers && !/\d/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  }
  
  if (config.passwordRequireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы один специальный символ');
  }
  
  if (config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }
  
  if (config.passwordRequireLowercase && !/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Проверка подозрительной активности
export const detectSuspiciousActivity = (activity: {
  type: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}): boolean => {
  try {
    // Логика обнаружения подозрительной активности
    const suspiciousPatterns = [
      'rapid_login_attempts',
      'unusual_location',
      'bulk_data_access',
      'permission_escalation_attempt'
    ];
    
    const isSuspicious = suspiciousPatterns.includes(activity.type);
    
    if (isSuspicious && SECURITY_CONFIG.monitoring.alertOnSuspiciousActivity) {
      logger.warn('Обнаружена подозрительная активность', activity);
    }
    
    return isSuspicious;
  } catch (error) {
    logger.error('Ошибка при проверке подозрительной активности', error);
    return false;
  }
};

// Логирование событий безопасности
export const logSecurityEvent = (event: {
  type: 'login' | 'logout' | 'data_access' | 'permission_change' | 'security_violation';
  userId?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}): void => {
  if (!SECURITY_CONFIG.monitoring.logSecurityEvents) return;
  
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event.type,
      userId: event.userId,
      severity: event.severity,
      details: event.details,
      source: 'client_app'
    };
    
    logger.info('Событие безопасности', logEntry);
    
    // В продакшене здесь должна быть отправка в систему мониторинга
    if (event.severity === 'critical') {
      logger.error('КРИТИЧЕСКОЕ СОБЫТИЕ БЕЗОПАСНОСТИ', logEntry);
    }
  } catch (error) {
    logger.error('Ошибка при логировании события безопасности', error);
  }
};

// Получение настроек безопасности для компонентов
export const getSecuritySettings = () => SECURITY_CONFIG;

// Проверка разрешений пользователя
export const checkUserPermissions = (
  userRole: string,
  requiredPermissions: string[]
): boolean => {
  // Базовая логика проверки разрешений
  const rolePermissions: Record<string, string[]> = {
    'seeker': ['read_own_data', 'write_own_data'],
    'explorer': ['read_own_data', 'write_own_data', 'access_premium_features'],
    'master': ['read_own_data', 'write_own_data', 'access_premium_features', 'admin_tools'],
    'admin': ['*'] // все разрешения
  };
  
  const userPermissions = rolePermissions[userRole] || [];
  
  if (userPermissions.includes('*')) {
    return true;
  }
  
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

export default SECURITY_CONFIG;