
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
export const getNumerologyMeaning = (lifePathNumber: number, language: string = 'en') => {
  const meanings: Record<number, { 
    title: {ru: string, en: string, es: string}, 
    description: {ru: string, en: string, es: string}
  }> = {
    1: {
      title: {
        ru: "Лидер", 
        en: "The Leader", 
        es: "El Líder"
      },
      description: {
        ru: "Энергичность, независимость, оригинальность", 
        en: "Energy, independence, originality", 
        es: "Energía, independencia, originalidad"
      }
    },
    2: {
      title: {
        ru: "Дипломат", 
        en: "The Diplomat", 
        es: "El Diplomático"
      },
      description: {
        ru: "Сотрудничество, интуиция, гармония", 
        en: "Cooperation, intuition, harmony", 
        es: "Cooperación, intuición, armonía"
      }
    },
    3: {
      title: {
        ru: "Творец", 
        en: "The Creator", 
        es: "El Creador"
      },
      description: {
        ru: "Выражение, радость, творчество", 
        en: "Expression, joy, creativity", 
        es: "Expresión, alegría, creatividad"
      }
    },
    4: {
      title: {
        ru: "Строитель", 
        en: "The Builder", 
        es: "El Constructor"
      },
      description: {
        ru: "Стабильность, организованность, надежность", 
        en: "Stability, organization, reliability", 
        es: "Estabilidad, organización, fiabilidad"
      }
    },
    5: {
      title: {
        ru: "Искатель", 
        en: "The Adventurer", 
        es: "El Aventurero"
      },
      description: {
        ru: "Свобода, перемены, приключения", 
        en: "Freedom, change, adventure", 
        es: "Libertad, cambio, aventura"
      }
    },
    6: {
      title: {
        ru: "Хранитель", 
        en: "The Nurturer", 
        es: "El Protector"
      },
      description: {
        ru: "Забота, ответственность, гармония", 
        en: "Nurturing, responsibility, harmony", 
        es: "Cuidado, responsabilidad, armonía"
      }
    },
    7: {
      title: {
        ru: "Мыслитель", 
        en: "The Thinker", 
        es: "El Pensador"
      },
      description: {
        ru: "Анализ, интроспекция, духовность", 
        en: "Analysis, introspection, spirituality", 
        es: "Análisis, introspección, espiritualidad"
      }
    },
    8: {
      title: {
        ru: "Достигатель", 
        en: "The Achiever", 
        es: "El Triunfador"
      },
      description: {
        ru: "Амбиции, материальный успех, власть", 
        en: "Ambition, material success, power", 
        es: "Ambición, éxito material, poder"
      }
    },
    9: {
      title: {
        ru: "Гуманист", 
        en: "The Humanitarian", 
        es: "El Humanitario"
      },
      description: {
        ru: "Сочувствие, альтруизм, мудрость", 
        en: "Compassion, altruism, wisdom", 
        es: "Compasión, altruismo, sabiduría"
      }
    },
    11: {
      title: {
        ru: "Интуитивный Лидер", 
        en: "The Intuitive Leader", 
        es: "El Líder Intuitivo"
      },
      description: {
        ru: "Вдохновение, интуиция, духовность высокого уровня", 
        en: "Inspiration, intuition, high spirituality", 
        es: "Inspiración, intuición, alta espiritualidad"
      }
    },
    22: {
      title: {
        ru: "Мастер-Строитель", 
        en: "The Master Builder", 
        es: "El Maestro Constructor"
      },
      description: {
        ru: "Практичность, лидерство, крупные достижения", 
        en: "Practicality, leadership, major achievements", 
        es: "Practicidad, liderazgo, grandes logros"
      }
    },
    33: {
      title: {
        ru: "Мастер Учитель", 
        en: "The Master Teacher", 
        es: "El Maestro Instructor"
      },
      description: {
        ru: "Служение, исцеление, альтруизм самого высокого уровня", 
        en: "Service, healing, highest level of altruism", 
        es: "Servicio, curación, máximo nivel de altruismo"
      }
    }
  };
  
  return meanings[lifePathNumber] || {
    title: {ru: "Загадка", en: "Mystery", es: "Misterio"},
    description: {ru: "Уникальное число", en: "Unique number", es: "Número único"}
  };
};
