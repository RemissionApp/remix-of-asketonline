import { Translations, SupportedLanguage } from './types/translationTypes';
import { enTranslations } from './languages/en';
import { ruTranslations } from './languages/ru';
import { esTranslations } from './languages/es';

// Define the actual translations
export const translations: Record<SupportedLanguage, Translations> = {
  en: enTranslations,
  ru: ruTranslations,
  es: esTranslations,
};

// Re-export the type for compatibility
export type { SupportedLanguage, Translations };
