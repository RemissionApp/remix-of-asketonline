
import { useAppStore } from '@/store/useAppStore';

export const useMainPageUtils = () => {
  const { language } = useAppStore();

  // Function to format the rejection text based on language
  const formatRejection = (rejectionText: string) => {
    // Predefined options with translations
    const predefinedOptions: Record<string, Record<string, string>> = {
      ru: {
        'sugar': 'сахара',
        'phone_after_22': 'телефона после 22:00',
        'cigarettes': 'сигарет',
        'procrastination': 'прокрастинации',
        'social_media': 'социальных сетей',
        'alcohol': 'алкоголя',
        'junk_food': 'фастфуда'
      },
      en: {
        'sugar': 'sugar',
        'phone_after_22': 'phone after 10 PM',
        'cigarettes': 'cigarettes',
        'procrastination': 'procrastination',
        'social_media': 'social media',
        'alcohol': 'alcohol',
        'junk_food': 'junk food'
      },
      es: {
        'sugar': 'azúcar',
        'phone_after_22': 'teléfono después de las 22:00',
        'cigarettes': 'cigarrillos',
        'procrastination': 'procrastinación',
        'social_media': 'redes sociales',
        'alcohol': 'alcohol',
        'junk_food': 'comida rápida'
      }
    };
    
    if (!rejectionText) return '';
    
    // Get translations for current language
    const translations = predefinedOptions[language];
    
    // Check if it's a multiple rejection (comma-separated)
    if (rejectionText.includes(',')) {
      const items = rejectionText.split(',').map(item => item.trim());
      const translatedItems = items.map(item => translations[item] || item);
      return translatedItems.join(', ');
    }
    
    // Single rejection
    return translations[rejectionText] || rejectionText;
  };
  
  // Get the prefix for the ascesis title based on language
  const getAscesisPrefix = () => {
    switch (language) {
      case 'ru':
        return 'Аскеза от';
      case 'es':
        return 'Ascesis de';
      default:
        return 'Ascesis from';
    }
  };
  
  return {
    formatRejection,
    getAscesisPrefix
  };
};
