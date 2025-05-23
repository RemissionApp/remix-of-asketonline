
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
