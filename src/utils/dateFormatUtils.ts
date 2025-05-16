
import { format } from 'date-fns';
import { ru, es, enUS } from 'date-fns/locale';
import { SupportedLanguage } from '@/i18n/translations';

/**
 * Get the appropriate date-fns locale based on the language
 */
export const getLocaleByLanguage = (language: SupportedLanguage) => {
  switch (language) {
    case 'ru':
      return ru;
    case 'es':
      return es;
    default:
      return enUS;
  }
};

/**
 * Get the date format pattern based on the language
 */
export const getDateFormatByLanguage = (language: SupportedLanguage, includeTime: boolean = false) => {
  const timeFormat = includeTime ? ' HH:mm' : '';
  
  switch (language) {
    case 'ru':
      return `dd.MM.yyyy${timeFormat}`; // Russian format: DD.MM.YYYY
    case 'es':
      return `dd/MM/yyyy${timeFormat}`; // Spanish format: DD/MM/YYYY
    default:
      return `MM/dd/yyyy${timeFormat}`; // English format: MM/DD/YYYY
  }
};

/**
 * Format a date according to the current language
 */
export const formatDate = (date: Date | string | undefined | null, language: SupportedLanguage, includeTime: boolean = false) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  
  const formatPattern = getDateFormatByLanguage(language, includeTime);
  const locale = getLocaleByLanguage(language);
  
  return format(dateObj, formatPattern, { locale });
};

/**
 * Format a date with full month name according to the current language
 */
export const formatDateLong = (date: Date | string | undefined | null, language: SupportedLanguage) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  
  const locale = getLocaleByLanguage(language);
  
  return format(dateObj, 'PPP', { locale });
};
