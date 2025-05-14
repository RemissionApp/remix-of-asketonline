
import { useAppStore } from '@/store/useAppStore';
import { translations, SupportedLanguage } from '@/i18n/translations';

/**
 * Returns correct Russian declension for years
 * @param age The age number
 * @returns Appropriate Russian word form for "year"
 */
const getRussianYearDeclension = (age: number): string => {
  // Handle exceptions (11-14 use "лет")
  if (age % 100 >= 11 && age % 100 <= 14) {
    return 'лет';
  }
  
  // Check the last digit
  const lastDigit = age % 10;
  
  if (lastDigit === 1) {
    return 'год';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года';
  } else {
    return 'лет';
  }
};

export const useTranslations = () => {
  const { language } = useAppStore();
  
  const getYearWord = (age: number): string => {
    if (language === 'ru') {
      return getRussianYearDeclension(age);
    } else if (language === 'es') {
      return age === 1 ? 'año' : 'años';
    } else {
      return age === 1 ? 'year' : 'years';
    }
  };
  
  return {
    t: translations[language],
    getYearWord
  };
};
