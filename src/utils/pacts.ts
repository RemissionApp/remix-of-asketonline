
import { Pact } from '@/types';

// Функция для обработки данных о пактах
export const processPacts = (pacts: Pact[]) => {
  if (!pacts || !pacts.length) return [];
  
  // Здесь можно добавить логику для обработки пактов
  // Например, сортировку по дате, фильтрацию и т.д.
  
  // Сортировка по дате создания (новые сначала)
  return [...pacts].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

// Функция для получения активного пакта
export const getActivePact = (pacts: Pact[]) => {
  if (!pacts || !pacts.length) return null;
  
  return pacts.find(pact => pact.status === 'active') || null;
};

// Функция для получения статистики по пактам
export const getPactsStats = (pacts: Pact[]) => {
  if (!pacts || !pacts.length) return { total: 0, active: 0, completed: 0, failed: 0 };
  
  return {
    total: pacts.length,
    active: pacts.filter(p => p.status === 'active').length,
    completed: pacts.filter(p => p.status === 'completed').length,
    failed: pacts.filter(p => p.status === 'failed').length
  };
};
