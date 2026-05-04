// Web Share API для нативного шаринга контента
export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export interface ShareResult {
  success: boolean;
  shared: boolean;
  error?: string;
}

/**
 * Проверяет поддержку Web Share API
 */
export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * Проверяет поддержку шаринга файлов
 */
export const isWebShareFilesSupported = (): boolean => {
  return (
    isWebShareSupported() &&
    'canShare' in navigator &&
    typeof navigator.canShare === 'function'
  );
};

/**
 * Проверяет возможность поделиться конкретными данными
 */
export const canShare = async (data: ShareData): Promise<boolean> => {
  if (!isWebShareSupported()) return false;

  try {
    if (navigator.canShare) {
      return navigator.canShare(data);
    }
    return true;
  } catch (error) {
    console.warn('Error checking canShare:', error);
    return false;
  }
};

/**
 * Основная функция для шаринга контента
 */
export const shareContent = async (data: ShareData): Promise<ShareResult> => {
  // Fallback для браузеров без поддержки Web Share API
  if (!isWebShareSupported()) {
    return copyToClipboard(data);
  }

  try {
    // Проверяем возможность поделиться
    const canShareData = await canShare(data);
    if (!canShareData) {
      return copyToClipboard(data);
    }

    await navigator.share(data);
    return { success: true, shared: true };
  } catch (error: any) {
    // Пользователь отменил шаринг
    if (error.name === 'AbortError') {
      return { success: true, shared: false };
    }

    console.warn('Web Share failed, falling back to clipboard:', error);
    return copyToClipboard(data);
  }
};

/**
 * Fallback: копирование в буфер обмена
 */
const copyToClipboard = async (data: ShareData): Promise<ShareResult> => {
  try {
    let textToShare = '';

    if (data.title) textToShare += `${data.title}\n`;
    if (data.text) textToShare += `${data.text}\n`;
    if (data.url) textToShare += data.url;

    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(textToShare.trim());
      return { success: true, shared: true };
    }

    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = textToShare.trim();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    return { success: true, shared: true };
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return {
      success: false,
      shared: false,
      error: 'Failed to copy to clipboard',
    };
  }
};

/**
 * Утилиты для популярного контента приложения
 */
export const shareUtils = {
  // Поделиться прогрессом аскезы
  sharePactProgress: (
    pactTitle: string,
    completedDays: number,
    totalDays: number
  ) => {
    return shareContent({
      title: 'Мой прогресс в Asceta App',
      text: `Я прохожу аскезу "${pactTitle}" уже ${completedDays} из ${totalDays} дней! 🔥\nПрисоединяйся к духовному развитию в Asceta App`,
      url: 'https://asket.online',
    });
  },

  // Поделиться достижением
  shareAchievement: (
    achievementTitle: string,
    achievementDescription: string
  ) => {
    return shareContent({
      title: 'Новое достижение в Asceta App! 🏆',
      text: `Получил достижение: "${achievementTitle}"\n${achievementDescription}\nРазвивайся вместе со мной в Asceta App!`,
      url: 'https://asket.online',
    });
  },

  // Поделиться мудростью Вселенной
  shareUniverseWisdom: (wisdom: string) => {
    return shareContent({
      title: 'Мудрость от Вселенной 🌌',
      text: `"${wisdom}"\n\nПолучено через Asceta App - твой путь к просветлению`,
      url: 'https://asket.online',
    });
  },

  // Поделиться приложением
  shareApp: () => {
    return shareContent({
      title: 'Asceta App - Путь к просветлению',
      text: 'Открой для себя мир аскезы, медитации и связи с Космосом. Развивайся духовно каждый день! 🧘‍♀️✨',
      url: 'https://asket.online',
    });
  },
};
