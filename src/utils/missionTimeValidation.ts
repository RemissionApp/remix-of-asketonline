import { format, isToday, parseISO } from 'date-fns';

/**
 * Проверяет, может ли пользователь завершить шаг миссии сегодня
 * Правило: только один шаг в день
 */
export const canCompleteStepToday = (completedSteps: Array<{ completedAt?: string; completed: boolean }>): boolean => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Проверяем, есть ли уже завершенные шаги сегодня
  const completedToday = completedSteps.filter(step => {
    if (!step.completed || !step.completedAt) return false;
    
    try {
      const completedDate = parseISO(step.completedAt);
      return format(completedDate, 'yyyy-MM-dd') === today;
    } catch {
      return false;
    }
  });
  
  console.log('🕐 Проверка временных ограничений:', {
    today,
    completedToday: completedToday.length,
    canComplete: completedToday.length === 0
  });
  
  return completedToday.length === 0;
};

/**
 * Получает количество шагов, завершенных сегодня
 */
export const getStepsCompletedToday = (completedSteps: Array<{ completedAt?: string; completed: boolean }>): number => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return completedSteps.filter(step => {
    if (!step.completed || !step.completedAt) return false;
    
    try {
      const completedDate = parseISO(step.completedAt);
      return format(completedDate, 'yyyy-MM-dd') === today;
    } catch {
      return false;
    }
  }).length;
};

/**
 * Проверяет, был ли конкретный шаг завершен сегодня
 */
export const isStepCompletedToday = (stepData: { completedAt?: string; completed: boolean }): boolean => {
  if (!stepData.completed || !stepData.completedAt) return false;
  
  try {
    const completedDate = parseISO(stepData.completedAt);
    return isToday(completedDate);
  } catch {
    return false;
  }
};