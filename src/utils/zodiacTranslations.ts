
type Language = 'en' | 'ru' | 'es';

// Translate element based on language
export const translateElement = (element: string, language: Language): string => {
  if (language === 'ru') {
    switch (element) {
      case 'Fire': return 'Огонь';
      case 'Earth': return 'Земля';
      case 'Air': return 'Воздух';
      case 'Water': return 'Вода';
      default: return element;
    }
  } else if (language === 'es') {
    switch (element) {
      case 'Fire': return 'Fuego';
      case 'Earth': return 'Tierra';
      case 'Air': return 'Aire';
      case 'Water': return 'Agua';
      default: return element;
    }
  }
  return element;
};

// Translate ruler based on language
export const translateRuler = (ruler: string, language: Language): string => {
  if (language === 'ru') {
    switch (ruler) {
      case 'Mars': return 'Марс';
      case 'Venus': return 'Венера';
      case 'Mercury': return 'Меркурий';
      case 'Moon': return 'Луна';
      case 'Sun': return 'Солнце';
      case 'Jupiter': return 'Юпитер';
      case 'Saturn': return 'Сатурн';
      case 'Uranus': return 'Уран';
      case 'Neptune': return 'Нептун';
      case 'Pluto': return 'Плутон';
      case 'Pluto, Mars': return 'Плутон, Марс';
      case 'Neptune, Jupiter': return 'Нептун, Юпитер';
      case 'Uranus, Saturn': return 'Уран, Сатурн';
      default: return ruler;
    }
  } else if (language === 'es') {
    switch (ruler) {
      case 'Mars': return 'Marte';
      case 'Venus': return 'Venus';
      case 'Mercury': return 'Mercurio';
      case 'Moon': return 'Luna';
      case 'Sun': return 'Sol';
      case 'Jupiter': return 'Júpiter';
      case 'Saturn': return 'Saturno';
      case 'Uranus': return 'Urano';
      case 'Neptune': return 'Neptuno';
      case 'Pluto': return 'Plutón';
      case 'Pluto, Mars': return 'Plutón, Marte';
      case 'Neptune, Jupiter': return 'Neptuno, Júpiter';
      case 'Uranus, Saturn': return 'Urano, Saturno';
      default: return ruler;
    }
  }
  return ruler;
};
