
import { translations, SupportedLanguage } from '@/i18n/translations';

// Функция для загрузки переводов для определенного языка
export const loadTranslations = (language: string): any => {
  const supportedLanguage = language as SupportedLanguage || 'en';
  return translations[supportedLanguage] || translations.en;
};

// Функция для получения перевода конкретного текста
export const translate = (key: string, language: string, defaultText: string = ''): string => {
  const parts = key.split('.');
  if (parts.length === 0) return defaultText;
  
  try {
    let current: any = translations[language as SupportedLanguage];
    if (!current) return defaultText;
    
    for (const part of parts) {
      if (!current[part]) return defaultText;
      current = current[part];
    }
    
    return typeof current === 'string' ? current : defaultText;
  } catch (e) {
    return defaultText;
  }
};
