
export type ZodiacSign = 
  | 'aries' 
  | 'taurus' 
  | 'gemini' 
  | 'cancer' 
  | 'leo' 
  | 'virgo' 
  | 'libra' 
  | 'scorpio' 
  | 'sagittarius' 
  | 'capricorn' 
  | 'aquarius' 
  | 'pisces';

export interface ZodiacInfo {
  sign: ZodiacSign;
  name: {
    en: string;
    ru: string;
    es: string;
  };
  symbol: string;
  dates: string;
  element: string;
  ruler: string;
  traits: string[];
}

export const zodiacData: Record<ZodiacSign, ZodiacInfo> = {
  aries: {
    sign: 'aries',
    name: {
      en: 'Aries',
      ru: 'Овен',
      es: 'Aries'
    },
    symbol: '♈',
    dates: 'March 21 - April 19',
    element: 'Fire',
    ruler: 'Mars',
    traits: ['Courageous', 'Determined', 'Passionate', 'Confident']
  },
  taurus: {
    sign: 'taurus',
    name: {
      en: 'Taurus',
      ru: 'Телец',
      es: 'Tauro'
    },
    symbol: '♉',
    dates: 'April 20 - May 20',
    element: 'Earth',
    ruler: 'Venus',
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted']
  },
  gemini: {
    sign: 'gemini',
    name: {
      en: 'Gemini',
      ru: 'Близнецы',
      es: 'Géminis'
    },
    symbol: '♊',
    dates: 'May 21 - June 20',
    element: 'Air',
    ruler: 'Mercury',
    traits: ['Adaptable', 'Outgoing', 'Curious', 'Intelligent']
  },
  cancer: {
    sign: 'cancer',
    name: {
      en: 'Cancer',
      ru: 'Рак',
      es: 'Cáncer'
    },
    symbol: '♋',
    dates: 'June 21 - July 22',
    element: 'Water',
    ruler: 'Moon',
    traits: ['Empathetic', 'Nurturing', 'Intuitive', 'Protective']
  },
  leo: {
    sign: 'leo',
    name: {
      en: 'Leo',
      ru: 'Лев',
      es: 'Leo'
    },
    symbol: '♌',
    dates: 'July 23 - August 22',
    element: 'Fire',
    ruler: 'Sun',
    traits: ['Creative', 'Passionate', 'Generous', 'Charismatic']
  },
  virgo: {
    sign: 'virgo',
    name: {
      en: 'Virgo',
      ru: 'Дева',
      es: 'Virgo'
    },
    symbol: '♍',
    dates: 'August 23 - September 22',
    element: 'Earth',
    ruler: 'Mercury',
    traits: ['Analytical', 'Practical', 'Diligent', 'Detail-oriented']
  },
  libra: {
    sign: 'libra',
    name: {
      en: 'Libra',
      ru: 'Весы',
      es: 'Libra'
    },
    symbol: '♎',
    dates: 'September 23 - October 22',
    element: 'Air',
    ruler: 'Venus',
    traits: ['Diplomatic', 'Fair-minded', 'Harmonious', 'Social']
  },
  scorpio: {
    sign: 'scorpio',
    name: {
      en: 'Scorpio',
      ru: 'Скорпион',
      es: 'Escorpio'
    },
    symbol: '♏',
    dates: 'October 23 - November 21',
    element: 'Water',
    ruler: 'Pluto, Mars',
    traits: ['Passionate', 'Resourceful', 'Intense', 'Determined']
  },
  sagittarius: {
    sign: 'sagittarius',
    name: {
      en: 'Sagittarius',
      ru: 'Стрелец',
      es: 'Sagitario'
    },
    symbol: '♐',
    dates: 'November 22 - December 21',
    element: 'Fire',
    ruler: 'Jupiter',
    traits: ['Optimistic', 'Freedom-loving', 'Adventurous', 'Philosophical']
  },
  capricorn: {
    sign: 'capricorn',
    name: {
      en: 'Capricorn',
      ru: 'Козерог',
      es: 'Capricornio'
    },
    symbol: '♑',
    dates: 'December 22 - January 19',
    element: 'Earth',
    ruler: 'Saturn',
    traits: ['Disciplined', 'Responsible', 'Self-controlled', 'Ambitious']
  },
  aquarius: {
    sign: 'aquarius',
    name: {
      en: 'Aquarius',
      ru: 'Водолей',
      es: 'Acuario'
    },
    symbol: '♒',
    dates: 'January 20 - February 18',
    element: 'Air',
    ruler: 'Uranus, Saturn',
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian']
  },
  pisces: {
    sign: 'pisces',
    name: {
      en: 'Pisces',
      ru: 'Рыбы',
      es: 'Piscis'
    },
    symbol: '♓',
    dates: 'February 19 - March 20',
    element: 'Water',
    ruler: 'Neptune, Jupiter',
    traits: ['Compassionate', 'Intuitive', 'Gentle', 'Artistic']
  }
};

export const getZodiacSign = (birthDate: Date | null): ZodiacSign | null => {
  if (!birthDate) return null;
  
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-based
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'aries';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'taurus';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'gemini';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'cancer';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'leo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'virgo';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'libra';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'scorpio';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'sagittarius';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'capricorn';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'aquarius';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 'pisces';
  }
  
  return null;
};
