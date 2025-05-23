
import { format, formatDistanceToNow } from 'date-fns';
import { enUS, ru, es } from 'date-fns/locale';
import type Language from '@/types/Language';

// Function to get locale based on language
export const getLocaleByLanguage = (language: Language) => {
  switch (language) {
    case 'ru':
      return ru;
    case 'es':
      return es;
    default:
      return enUS;
  }
};

// Format date in long format
export const formatDateLong = (date: Date | string, language: Language = 'en') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy', { locale: getLocaleByLanguage(language) });
};

// Format date in short format
export const formatDate = (date: Date | string, language: Language = 'en') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d, yyyy', { locale: getLocaleByLanguage(language) });
};

// Format relative time
export const formatRelativeTime = (date: Date | string, language: Language = 'en') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: getLocaleByLanguage(language) 
  });
};
