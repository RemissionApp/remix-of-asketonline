// Persistent Storage API для предотвращения удаления кэша браузером
export interface PersistentStorageResult {
  success: boolean;
  supported: boolean;
  persistent?: boolean;
  error?: string;
}

/**
 * Проверяет поддержку Persistent Storage API
 */
export const isPersistentStorageSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'storage' in navigator && 'persist' in navigator.storage;
};

/**
 * Проверяет, предоставлено ли постоянное хранилище
 */
export const isPersistent = async (): Promise<boolean> => {
  if (!isPersistentStorageSupported()) return false;
  
  try {
    return await navigator.storage.persisted();
  } catch (error) {
    console.warn('Error checking persistent storage:', error);
    return false;
  }
};

/**
 * Запрашивает постоянное хранилище
 */
export const requestPersistentStorage = async (): Promise<PersistentStorageResult> => {
  if (!isPersistentStorageSupported()) {
    return { success: false, supported: false };
  }

  try {
    // Проверяем, уже ли предоставлено
    const alreadyPersistent = await navigator.storage.persisted();
    if (alreadyPersistent) {
      return { success: true, supported: true, persistent: true };
    }

    // Запрашиваем постоянное хранилище
    const granted = await navigator.storage.persist();
    return { 
      success: true, 
      supported: true, 
      persistent: granted 
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
 * Получает информацию об использовании хранилища
 */
export const getStorageEstimate = async (): Promise<StorageEstimate | null> => {
  if (!isPersistentStorageSupported() || !('estimate' in navigator.storage)) {
    return null;
  }

  try {
    return await navigator.storage.estimate();
  } catch (error) {
    console.warn('Error getting storage estimate:', error);
    return null;
  }
};

/**
 * Форматирует размер в читаемом виде
 */
export const formatStorageSize = (bytes?: number): string => {
  if (!bytes) return 'Неизвестно';
  
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Утилиты для работы с постоянным хранилищем
 */
export const persistentStorage = {
  isSupported: isPersistentStorageSupported,
  isPersistent,
  request: requestPersistentStorage,
  getEstimate: getStorageEstimate,
  formatSize: formatStorageSize
};