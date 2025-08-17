/**
 * Calculates the life path number based on a birthdate string
 * @param birthDate - Birthdate in string format
 * @returns The life path number (1-9, 11, 22, or 33)
 */
export const calculateLifePathNumber = (birthDate: string): number => {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const year = date.getFullYear();

  // Sum all digits
  const sumDigits = (num: number): number => {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    return sum;
  };

  // Reduce to single digit (except 11, 22, 33 which are master numbers)
  const reduceToSingleDigit = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    while (num > 9) {
      num = sumDigits(num);
    }
    return num;
  };

  let sum = sumDigits(day) + sumDigits(month) + sumDigits(year);
  return reduceToSingleDigit(sum);
};

/**
 * Returns the numerology meaning for a life path number
 * @param lifePathNumber - The life path number
 * @param language - The language to return the meaning in
 * @returns An object containing the title and description for the life path number
 */
export const getNumerologyMeaning = (
  lifePathNumber: number,
  language: string = 'en'
) => {
  const meanings: Record<
    number,
    {
      title: { ru: string; en: string; es: string };
      description: { ru: string; en: string; es: string };
    }
  > = {
    1: {
      title: {
        ru: 'Лидер',
        en: 'The Leader',
        es: 'El Líder',
      },
      description: {
        ru: 'Энергичность, независимость, оригинальность',
        en: 'Energy, independence, originality',
        es: 'Energía, independencia, originalidad',
      },
    },
    2: {
      title: {
        ru: 'Дипломат',
        en: 'The Diplomat',
        es: 'El Diplomático',
      },
      description: {
        ru: 'Сотрудничество, интуиция, гармония',
        en: 'Cooperation, intuition, harmony',
        es: 'Cooperación, intuición, armonía',
      },
    },
    3: {
      title: {
        ru: 'Творец',
        en: 'The Creator',
        es: 'El Creador',
      },
      description: {
        ru: 'Выражение, радость, творчество',
        en: 'Expression, joy, creativity',
        es: 'Expresión, alegría, creatividad',
      },
    },
    4: {
      title: {
        ru: 'Строитель',
        en: 'The Builder',
        es: 'El Constructor',
      },
      description: {
        ru: 'Стабильность, организованность, надежность',
        en: 'Stability, organization, reliability',
        es: 'Estabilidad, organización, fiabilidad',
      },
    },
    5: {
      title: {
        ru: 'Искатель',
        en: 'The Adventurer',
        es: 'El Aventurero',
      },
      description: {
        ru: 'Свобода, перемены, приключения',
        en: 'Freedom, change, adventure',
        es: 'Libertad, cambio, aventura',
      },
    },
    6: {
      title: {
        ru: 'Хранитель',
        en: 'The Nurturer',
        es: 'El Protector',
      },
      description: {
        ru: 'Забота, ответственность, гармония',
        en: 'Nurturing, responsibility, harmony',
        es: 'Cuidado, responsabilidad, armonía',
      },
    },
    7: {
      title: {
        ru: 'Мыслитель',
        en: 'The Thinker',
        es: 'El Pensador',
      },
      description: {
        ru: 'Анализ, интроспе��ция, духовность',
        en: 'Analysis, introspection, spirituality',
        es: 'Análisis, introspección, espiritualidad',
      },
    },
    8: {
      title: {
        ru: 'Достигатель',
        en: 'The Achiever',
        es: 'El Triunfador',
      },
      description: {
        ru: 'Амбиции, материальный успех, власть',
        en: 'Ambition, material success, power',
        es: 'Ambición, éxito material, poder',
      },
    },
    9: {
      title: {
        ru: 'Гуманист',
        en: 'The Humanitarian',
        es: 'El Humanitario',
      },
      description: {
        ru: 'Сочувствие, альтруизм, мудрость',
        en: 'Compassion, altruism, wisdom',
        es: 'Compasión, altruismo, sabiduría',
      },
    },
    11: {
      title: {
        ru: 'Интуитивный Лидер',
        en: 'The Intuitive Leader',
        es: 'El Líder Intuitivo',
      },
      description: {
        ru: 'Вдохновение, интуиция, духовность высокого уровня',
        en: 'Inspiration, intuition, high spirituality',
        es: 'Inspiración, intuición, alta espiritualidad',
      },
    },
    22: {
      title: {
        ru: 'Мастер-Строитель',
        en: 'The Master Builder',
        es: 'El Maestro Constructor',
      },
      description: {
        ru: 'Практичность, лидерство, крупные достижения',
        en: 'Practicality, leadership, major achievements',
        es: 'Practicidad, liderazgo, grandes logros',
      },
    },
    33: {
      title: {
        ru: 'Мастер Учитель',
        en: 'The Master Teacher',
        es: 'El Maestro Instructor',
      },
      description: {
        ru: 'Служение, исцеление, альтруизм самого высокого уровня',
        en: 'Service, healing, highest level of altruism',
        es: 'Servicio, curación, máximo nivel de altruismo',
      },
    },
  };

  return (
    meanings[lifePathNumber] || {
      title: { ru: 'Загадка', en: 'Mystery', es: 'Misterio' },
      description: {
        ru: 'Уникальное число',
        en: 'Unique number',
        es: 'Número único',
      },
    }
  );
};

/**
 * Calculate the Expression Number (also known as Destiny Number) based on the person's full name
 * This number represents the talents and abilities available to the person
 * @param name - The person's full name
 * @returns The Expression Number (1-9, 11, 22, 33)
 */
export const calculateExpressionNumber = (name: string): number => {
  if (!name || name.trim() === '') return 0;

  // Assign numerical values to letters based on Pythagorean numerology
  const letterValues: Record<string, number> = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 1,
    k: 2,
    l: 3,
    m: 4,
    n: 5,
    o: 6,
    p: 7,
    q: 8,
    r: 9,
    s: 1,
    t: 2,
    u: 3,
    v: 4,
    w: 5,
    x: 6,
    y: 7,
    z: 8,
  };

  // Reduce to single digit (except 11, 22, 33 which are master numbers)
  const reduceToSingleDigit = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    while (num > 9) {
      let sum = 0;
      while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
      }
      num = sum;
    }
    return num;
  };

  // Convert name to lowercase and calculate expression number
  const normalizedName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;

  for (const letter of normalizedName) {
    if (letterValues[letter]) {
      sum += letterValues[letter];
    }
  }

  return reduceToSingleDigit(sum);
};

/**
 * Calculate the Personality Number based on the consonants in a person's name
 * This number represents how others perceive the person
 * @param name - The person's full name
 * @returns The Personality Number (1-9, 11, 22, 33)
 */
export const calculatePersonalityNumber = (name: string): number => {
  if (!name || name.trim() === '') return 0;

  // Assign numerical values to letters based on Pythagorean numerology
  const letterValues: Record<string, number> = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 1,
    k: 2,
    l: 3,
    m: 4,
    n: 5,
    o: 6,
    p: 7,
    q: 8,
    r: 9,
    s: 1,
    t: 2,
    u: 3,
    v: 4,
    w: 5,
    x: 6,
    y: 7,
    z: 8,
  };

  // Reduce to single digit (except 11, 22, 33 which are master numbers)
  const reduceToSingleDigit = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    while (num > 9) {
      let sum = 0;
      while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
      }
      num = sum;
    }
    return num;
  };

  // Convert name to lowercase and calculate personality number (using only consonants)
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const normalizedName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;

  for (const letter of normalizedName) {
    // Only include consonants (non-vowels)
    if (letterValues[letter] && !vowels.includes(letter)) {
      sum += letterValues[letter];
    }
  }

  return reduceToSingleDigit(sum);
};

/**
 * Calculate all numbers for the destiny matrix
 * @param birthDate - Birth date string
 * @param name - Full name
 * @returns Complete destiny matrix data
 */
export const calculateDestinyMatrix = (birthDate: string, name: string = '') => {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Helper function to reduce numbers while preserving master numbers
  const reduceToSingleDigit = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    while (num > 9) {
      let sum = 0;
      while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
      }
      num = sum;
    }
    return num;
  };

  // Calculate basic numbers
  const dayNumber = reduceToSingleDigit(day);
  const monthNumber = reduceToSingleDigit(month);
  const yearNumber = reduceToSingleDigit(year);
  const lifePathNumber = calculateLifePathNumber(birthDate);

  // Calculate additional matrix numbers
  const spiritualNumber = reduceToSingleDigit(dayNumber + monthNumber);
  const materialNumber = reduceToSingleDigit(monthNumber + yearNumber);
  const planetNumber = reduceToSingleDigit(dayNumber + yearNumber);
  
  // Karmic numbers (center cross)
  const personalKarma = reduceToSingleDigit(dayNumber + monthNumber + yearNumber);
  const socialKarma = reduceToSingleDigit(spiritualNumber + materialNumber);
  const planetaryKarma = reduceToSingleDigit(spiritualNumber + planetNumber);
  const cosmicKarma = reduceToSingleDigit(materialNumber + planetNumber);

  // Central destiny number
  const destinyCenter = reduceToSingleDigit(personalKarma + socialKarma + planetaryKarma + cosmicKarma);

  // Talent numbers (corners)
  const talent1 = reduceToSingleDigit(spiritualNumber + personalKarma);
  const talent2 = reduceToSingleDigit(materialNumber + personalKarma);
  const talent3 = reduceToSingleDigit(planetNumber + personalKarma);
  const talent4 = reduceToSingleDigit(destinyCenter + personalKarma);

  return {
    // Basic numbers (main positions)
    dayNumber,
    monthNumber,
    yearNumber,
    lifePathNumber,
    
    // Secondary numbers
    spiritualNumber,
    materialNumber,
    planetNumber,
    
    // Karmic numbers (center cross)
    personalKarma,
    socialKarma,
    planetaryKarma,
    cosmicKarma,
    
    // Central destiny
    destinyCenter,
    
    // Talent numbers
    talents: [talent1, talent2, talent3, talent4],
    
    // Matrix layout (3x3 grid positions)
    matrix: [
      [spiritualNumber, personalKarma, materialNumber],
      [socialKarma, destinyCenter, planetaryKarma],
      [planetNumber, cosmicKarma, dayNumber]
    ]
  };
};

/**
 * Get meaning for any number in the destiny matrix
 * @param number - The number to get meaning for
 * @param type - Type of number (basic, karmic, talent, destiny)
 * @param language - Language for the meaning
 * @returns Meaning object with title and description
 */
export const getMatrixNumberMeaning = (
  number: number,
  type: 'basic' | 'karmic' | 'talent' | 'destiny' = 'basic',
  language: string = 'ru'
) => {
  const meanings: Record<string, Record<number, { title: { ru: string; en: string; es: string }; description: { ru: string; en: string; es: string } }>> = {
    basic: {
      1: {
        title: { ru: 'Единица', en: 'One', es: 'Uno' },
        description: { ru: 'Лидерство, инициатива, новые начинания', en: 'Leadership, initiative, new beginnings', es: 'Liderazgo, iniciativa, nuevos comienzos' }
      },
      2: {
        title: { ru: 'Двойка', en: 'Two', es: 'Dos' },
        description: { ru: 'Сотрудничество, дипломатия, партнерство', en: 'Cooperation, diplomacy, partnership', es: 'Cooperación, diplomacia, asociación' }
      },
      3: {
        title: { ru: 'Тройка', en: 'Three', es: 'Tres' },
        description: { ru: 'Творчество, самовыражение, общение', en: 'Creativity, self-expression, communication', es: 'Creatividad, autoexpresión, comunicación' }
      },
      4: {
        title: { ru: 'Четверка', en: 'Four', es: 'Cuatro' },
        description: { ru: 'Стабильность, трудолюбие, порядок', en: 'Stability, hard work, order', es: 'Estabilidad, trabajo duro, orden' }
      },
      5: {
        title: { ru: 'Пятерка', en: 'Five', es: 'Cinco' },
        description: { ru: 'Свобода, приключения, перемены', en: 'Freedom, adventure, change', es: 'Libertad, aventura, cambio' }
      },
      6: {
        title: { ru: 'Шестерка', en: 'Six', es: 'Seis' },
        description: { ru: 'Семья, забота, ответственность', en: 'Family, care, responsibility', es: 'Familia, cuidado, responsabilidad' }
      },
      7: {
        title: { ru: 'Семерка', en: 'Seven', es: 'Siete' },
        description: { ru: 'Духовность, анализ, мудрость', en: 'Spirituality, analysis, wisdom', es: 'Espiritualidad, análisis, sabiduría' }
      },
      8: {
        title: { ru: 'Восьмерка', en: 'Eight', es: 'Ocho' },
        description: { ru: 'Материальный успех, власть, достижения', en: 'Material success, power, achievements', es: 'Éxito material, poder, logros' }
      },
      9: {
        title: { ru: 'Девятка', en: 'Nine', es: 'Nueve' },
        description: { ru: 'Служение, мудрость, завершение', en: 'Service, wisdom, completion', es: 'Servicio, sabiduría, finalización' }
      }
    },
    karmic: {
      1: {
        title: { ru: 'Кармическая 1', en: 'Karmic 1', es: 'Kármico 1' },
        description: { ru: 'Развитие лидерских качеств', en: 'Developing leadership qualities', es: 'Desarrollando cualidades de liderazgo' }
      },
      2: {
        title: { ru: 'Кармическая 2', en: 'Karmic 2', es: 'Kármico 2' },
        description: { ru: 'Обучение сотрудничеству', en: 'Learning cooperation', es: 'Aprendiendo cooperación' }
      },
      3: {
        title: { ru: 'Кармическая 3', en: 'Karmic 3', es: 'Kármico 3' },
        description: { ru: 'Развитие творческих способностей', en: 'Developing creative abilities', es: 'Desarrollando habilidades creativas' }
      },
      4: {
        title: { ru: 'Кармическая 4', en: 'Karmic 4', es: 'Kármico 4' },
        description: { ru: 'Построение стабильности', en: 'Building stability', es: 'Construyendo estabilidad' }
      },
      5: {
        title: { ru: 'Кармическая 5', en: 'Karmic 5', es: 'Kármico 5' },
        description: { ru: 'Поиск свободы и опыта', en: 'Seeking freedom and experience', es: 'Buscando libertad y experiencia' }
      },
      6: {
        title: { ru: 'Кармическая 6', en: 'Karmic 6', es: 'Kármico 6' },
        description: { ru: 'Служение и забота о других', en: 'Service and caring for others', es: 'Servicio y cuidado de otros' }
      },
      7: {
        title: { ru: 'Кармическая 7', en: 'Karmic 7', es: 'Kármico 7' },
        description: { ru: 'Духовное развитие', en: 'Spiritual development', es: 'Desarrollo espiritual' }
      },
      8: {
        title: { ru: 'Кармическая 8', en: 'Karmic 8', es: 'Kármico 8' },
        description: { ru: 'Материальные уроки', en: 'Material lessons', es: 'Lecciones materiales' }
      },
      9: {
        title: { ru: 'Кармическая 9', en: 'Karmic 9', es: 'Kármico 9' },
        description: { ru: 'Завершение кармических циклов', en: 'Completion of karmic cycles', es: 'Finalización de ciclos kármicos' }
      }
    },
    talent: {
      1: {
        title: { ru: 'Талант Лидера', en: 'Leader Talent', es: 'Talento de Líder' },
        description: { ru: 'Природная способность к руководству', en: 'Natural leadership ability', es: 'Habilidad natural de liderazgo' }
      },
      2: {
        title: { ru: 'Талант Дипломата', en: 'Diplomat Talent', es: 'Talento Diplomático' },
        description: { ru: 'Умение находить компромиссы', en: 'Ability to find compromises', es: 'Capacidad para encontrar compromisos' }
      },
      3: {
        title: { ru: 'Талант Творца', en: 'Creator Talent', es: 'Talento Creativo' },
        description: { ru: 'Художественные и творческие способности', en: 'Artistic and creative abilities', es: 'Habilidades artísticas y creativas' }
      },
      4: {
        title: { ru: 'Талант Строителя', en: 'Builder Talent', es: 'Talento Constructor' },
        description: { ru: 'Способность создавать прочные основы', en: 'Ability to create solid foundations', es: 'Capacidad para crear bases sólidas' }
      },
      5: {
        title: { ru: 'Талант Путешественника', en: 'Traveler Talent', es: 'Talento Viajero' },
        description: { ru: 'Стремление к новому опыту', en: 'Drive for new experiences', es: 'Impulso por nuevas experiencias' }
      },
      6: {
        title: { ru: 'Талант Целителя', en: 'Healer Talent', es: 'Talento Sanador' },
        description: { ru: 'Способность помогать и исцелять', en: 'Ability to help and heal', es: 'Capacidad para ayudar y sanar' }
      },
      7: {
        title: { ru: 'Талант Мудреца', en: 'Sage Talent', es: 'Talento Sabio' },
        description: { ru: 'Глубокая интуиция и мудрость', en: 'Deep intuition and wisdom', es: 'Intuición profunda y sabiduría' }
      },
      8: {
        title: { ru: 'Талант Достигателя', en: 'Achiever Talent', es: 'Talento Triunfador' },
        description: { ru: 'Способность к материальному успеху', en: 'Ability for material success', es: 'Capacidad para el éxito material' }
      },
      9: {
        title: { ru: 'Талант Учителя', en: 'Teacher Talent', es: 'Talento Maestro' },
        description: { ru: 'Способность делиться знаниями', en: 'Ability to share knowledge', es: 'Capacidad para compartir conocimiento' }
      }
    }
  };

  const typeMap = meanings[type] || meanings.basic;
  const meaning = typeMap[number] || {
    title: { ru: 'Особое число', en: 'Special number', es: 'Número especial' },
    description: { ru: 'Уникальная энергия', en: 'Unique energy', es: 'Energía única' }
  };

  return meaning;
};
