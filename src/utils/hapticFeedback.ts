// Haptic Feedback для тактильной обратной связи
export interface HapticOptions {
  intensity?: 'light' | 'medium' | 'heavy';
  duration?: number;
  pattern?: number[];
}

export interface HapticResult {
  success: boolean;
  supported: boolean;
  error?: string;
}

/**
 * Проверяет поддержку вибрации устройством
 */
export const isHapticSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Проверяет возможность вибрации (пользователь не отключил)
 */
export const canVibrate = (): boolean => {
  if (!isHapticSupported()) return false;
  
  // Проверяем, включена ли вибрация в настройках браузера
  try {
    return navigator.vibrate(0);
  } catch (error) {
    return false;
  }
};

/**
 * Базовая функция вибрации
 */
export const vibrate = async (pattern: number | number[]): Promise<HapticResult> => {
  if (!isHapticSupported()) {
    return { success: false, supported: false };
  }

  try {
    const result = navigator.vibrate(pattern);
    return { 
      success: result, 
      supported: true 
    };
  } catch (error: any) {
    return { 
      success: false, 
      supported: true, 
      error: error.message 
    };
  }
};

/**
 * Останавливает текущую вибрацию
 */
export const stopVibration = (): HapticResult => {
  if (!isHapticSupported()) {
    return { success: false, supported: false };
  }

  try {
    navigator.vibrate(0);
    return { success: true, supported: true };
  } catch (error: any) {
    return { 
      success: false, 
      supported: true, 
      error: error.message 
    };
  }
};

/**
 * Предустановленные паттерны вибрации для разных событий
 */
export const hapticPatterns = {
  // Быстрый тап (касание кнопки)
  tap: 50,
  
  // Двойной тап
  doubleTap: [50, 50, 50],
  
  // Успех/завершение
  success: [100, 50, 100],
  
  // Ошибка
  error: [200, 100, 200, 100, 200],
  
  // Уведомление
  notification: [150, 100, 150],
  
  // Длительное действие (начало медитации)
  longAction: [200, 100, 100, 100, 200],
  
  // Завершение аскезы
  achievement: [100, 50, 100, 50, 200, 50, 100],
  
  // Предупреждение
  warning: [150, 100, 150, 200, 300],
  
  // Мягкое напоминание
  reminder: [80, 80, 80],
  
  // Энергетический пульс
  energyPulse: [50, 50, 50, 50, 50, 200, 100, 50]
};

/**
 * Предустановленные функции для типичных действий приложения
 */
export const hapticFeedback = {
  // Тап по кнопке
  buttonTap: () => vibrate(hapticPatterns.tap),
  
  // Успешное выполнение действия
  success: () => vibrate(hapticPatterns.success),
  
  // Ошибка
  error: () => vibrate(hapticPatterns.error),
  
  // Завершение дня аскезы
  dayCompleted: () => vibrate(hapticPatterns.success),
  
  // Полное завершение аскезы
  pactCompleted: () => vibrate(hapticPatterns.achievement),
  
  // Начало медитации
  meditationStart: () => vibrate(hapticPatterns.longAction),
  
  // Завершение медитации
  meditationEnd: () => vibrate(hapticPatterns.success),
  
  // Получение уведомления
  notification: () => vibrate(hapticPatterns.notification),
  
  // Предупреждение (нарушение аскезы)
  warning: () => vibrate(hapticPatterns.warning),
  
  // Мягкое напоминание
  reminder: () => vibrate(hapticPatterns.reminder),
  
  // Энергетический эффект
  energyBoost: () => vibrate(hapticPatterns.energyPulse),
  
  // Переключение страниц
  pageTransition: () => vibrate(hapticPatterns.tap),
  
  // Выбор элемента
  selection: () => vibrate(30),
  
  // Длительное нажатие
  longPress: () => vibrate([100, 50, 100])
};

/**
 * Haptic с проверкой настроек пользователя
 */
export const conditionalHaptic = (action: () => Promise<HapticResult>): Promise<HapticResult> => {
  // Здесь можно добавить проверку пользовательских настроек
  // const userSettings = getUserSettings();
  // if (!userSettings.hapticEnabled) return Promise.resolve({ success: false, supported: true });
  
  return action();
};

/**
 * Хук для управления настройками haptic feedback
 */
export const createHapticManager = () => {
  let enabled = true;
  
  return {
    setEnabled: (value: boolean) => {
      enabled = value;
    },
    
    isEnabled: () => enabled,
    
    vibrate: async (pattern: number | number[]): Promise<HapticResult> => {
      if (!enabled) {
        return { success: false, supported: true };
      }
      return vibrate(pattern);
    },
    
    // Все предустановленные функции с проверкой включенности
    tap: () => enabled ? hapticFeedback.buttonTap() : Promise.resolve({ success: false, supported: true }),
    success: () => enabled ? hapticFeedback.success() : Promise.resolve({ success: false, supported: true }),
    error: () => enabled ? hapticFeedback.error() : Promise.resolve({ success: false, supported: true }),
    notification: () => enabled ? hapticFeedback.notification() : Promise.resolve({ success: false, supported: true })
  };
};