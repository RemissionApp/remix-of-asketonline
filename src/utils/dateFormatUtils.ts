import { format, formatRelative, formatDistance } from 'date-fns';
import { ru, enUS, es } from 'date-fns/locale';
import { AppLanguage } from '@/store/types';
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
export const getDateFormatByLanguage = (
  language: SupportedLanguage,
  includeTime: boolean = false
) => {
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
export const formatDate = (
  date: Date | string | undefined | null,
  language: SupportedLanguage,
  includeTime: boolean = false
) => {
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
export const formatDateLong = (
  date: Date | string | undefined | null,
  language: SupportedLanguage
) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }

  const locale = getLocaleByLanguage(language);

  return format(dateObj, 'PPP', { locale });
};

/**
 * Format a date with relative time
 */
export const formatRelativeTime = (
  date: Date,
  language: AppLanguage = 'ru'
) => {
  const locales = {
    ru,
    en: enUS,
    es,
  };

  try {
    // For recent messages (less than a day old), show relative time like "5 minutes ago"
    if (Date.now() - date.getTime() < 24 * 60 * 60 * 1000) {
      return formatDistance(date, new Date(), {
        addSuffix: true,
        locale: locales[language],
      });
    }

    // For older messages, show the date and time
    return format(date, 'dd.MM.yyyy HH:mm', { locale: locales[language] });
  } catch (error) {
    console.error('Error formatting date:', error);
    // Fallback format if there's an error
    return date.toLocaleString();
  }
};
