
type Language = 'en' | 'ru' | 'es';

// Translate traits based on language
export const translateTraits = (traits: string[], language: Language): string[] => {
  if (language === 'ru') {
    return traits.map(trait => {
      switch (trait) {
        case 'Courageous': return 'Смелый';
        case 'Determined': return 'Решительный';
        case 'Passionate': return 'Страстный';
        case 'Confident': return 'Уверенный';
        case 'Reliable': return 'Надежный';
        case 'Patient': return 'Терпеливый';
        case 'Practical': return 'Практичный';
        case 'Devoted': return 'Преданный';
        case 'Adaptable': return 'Адаптивный';
        case 'Outgoing': return 'Общительный';
        case 'Curious': return 'Любознательный';
        case 'Intelligent': return 'Умный';
        case 'Empathetic': return 'Эмпатичный';
        case 'Nurturing': return 'Заботливый';
        case 'Intuitive': return 'Интуитивный';
        case 'Protective': return 'Защищающий';
        case 'Creative': return 'Творческий';
        case 'Generous': return 'Щедрый';
        case 'Charismatic': return 'Харизматичный';
        case 'Analytical': return 'Аналитический';
        case 'Diligent': return 'Усердный';
        case 'Detail-oriented': return 'Внимательный к деталям';
        case 'Diplomatic': return 'Дипломатичный';
        case 'Fair-minded': return 'Справедливый';
        case 'Harmonious': return 'Гармоничный';
        case 'Social': return 'Социальный';
        case 'Resourceful': return 'Находчивый';
        case 'Intense': return 'Интенсивный';
        case 'Optimistic': return 'Оптимистичный';
        case 'Freedom-loving': return 'Свободолюбивый';
        case 'Adventurous': return 'Авантюрный';
        case 'Philosophical': return 'Философский';
        case 'Disciplined': return 'Дисциплинированный';
        case 'Responsible': return 'Ответственный';
        case 'Self-controlled': return 'Самоконтролируемый';
        case 'Ambitious': return 'Амбициозный';
        case 'Progressive': return 'Прогрессивный';
        case 'Original': return 'Оригинальный';
        case 'Independent': return 'Независимый';
        case 'Humanitarian': return 'Гуманист';
        case 'Compassionate': return 'Сострадательный';
        case 'Gentle': return 'Нежный';
        case 'Artistic': return 'Артистичный';
        default: return trait;
      }
    });
  } else if (language === 'es') {
    return traits.map(trait => {
      switch (trait) {
        case 'Courageous': return 'Valiente';
        case 'Determined': return 'Determinado';
        case 'Passionate': return 'Apasionado';
        case 'Confident': return 'Seguro';
        case 'Reliable': return 'Confiable';
        case 'Patient': return 'Paciente';
        case 'Practical': return 'Práctico';
        case 'Devoted': return 'Devoto';
        case 'Adaptable': return 'Adaptable';
        case 'Outgoing': return 'Extrovertido';
        case 'Curious': return 'Curioso';
        case 'Intelligent': return 'Inteligente';
        case 'Empathetic': return 'Empático';
        case 'Nurturing': return 'Nutritivo';
        case 'Intuitive': return 'Intuitivo';
        case 'Protective': return 'Protector';
        case 'Creative': return 'Creativo';
        case 'Generous': return 'Generoso';
        case 'Charismatic': return 'Carismático';
        case 'Analytical': return 'Analítico';
        case 'Diligent': return 'Diligente';
        case 'Detail-oriented': return 'Detallista';
        case 'Diplomatic': return 'Diplomático';
        case 'Fair-minded': return 'Justo';
        case 'Harmonious': return 'Armonioso';
        case 'Social': return 'Social';
        case 'Resourceful': return 'Ingenioso';
        case 'Intense': return 'Intenso';
        case 'Optimistic': return 'Optimista';
        case 'Freedom-loving': return 'Amante de la libertad';
        case 'Adventurous': return 'Aventurero';
        case 'Philosophical': return 'Filosófico';
        case 'Disciplined': return 'Disciplinado';
        case 'Responsible': return 'Responsable';
        case 'Self-controlled': return 'Autocontrolado';
        case 'Ambitious': return 'Ambicioso';
        case 'Progressive': return 'Progresista';
        case 'Original': return 'Original';
        case 'Independent': return 'Independiente';
        case 'Humanitarian': return 'Humanitario';
        case 'Compassionate': return 'Compasivo';
        case 'Gentle': return 'Gentil';
        case 'Artistic': return 'Artístico';
        default: return trait;
      }
    });
  }
  return traits;
};
