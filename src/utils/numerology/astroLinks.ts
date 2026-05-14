/**
 * Asceta numerology — astrological links and 22 Tarot arcana.
 * Maps numbers to planets, zodiac signs, elements, colors, crystals.
 */

export type Planet =
  | 'sun' | 'moon' | 'mars' | 'venus' | 'mercury'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'
  | 'earth';

export type Element = 'fire' | 'earth' | 'air' | 'water';

export const NUMBER_PLANETS: Record<number, Planet> = {
  1: 'sun', 2: 'moon', 3: 'jupiter', 4: 'uranus',
  5: 'mercury', 6: 'venus', 7: 'neptune', 8: 'saturn', 9: 'mars',
  11: 'moon', 22: 'earth', 33: 'neptune',
};

export const NUMBER_ZODIAC: Record<number, string[]> = {
  1: ['aries', 'leo'],
  2: ['cancer', 'taurus'],
  3: ['sagittarius', 'pisces'],
  4: ['aquarius', 'capricorn'],
  5: ['gemini', 'virgo'],
  6: ['taurus', 'libra'],
  7: ['pisces', 'cancer'],
  8: ['capricorn', 'scorpio'],
  9: ['aries', 'scorpio'],
  11: ['aquarius'],
  22: ['capricorn'],
  33: ['pisces'],
};

export const NUMBER_ELEMENTS: Record<number, Element> = {
  1: 'fire', 2: 'water', 3: 'fire',
  4: 'earth', 5: 'air', 6: 'earth',
  7: 'water', 8: 'earth', 9: 'fire',
  11: 'air', 22: 'earth', 33: 'water',
};

export const NUMBER_COLORS: Record<number, [string, string]> = {
  1: ['#FFD166', '#F4A300'],
  2: ['#A0C4FF', '#7C9BE2'],
  3: ['#C792EA', '#8B5CF6'],
  4: ['#6EE7B7', '#34D399'],
  5: ['#6366F1', '#8B5CF6'],
  6: ['#FB7185', '#F472B6'],
  7: ['#67E8F9', '#0EA5E9'],
  8: ['#1E293B', '#475569'],
  9: ['#EF4444', '#B91C1C'],
  11: ['#E0E7FF', '#A5B4FC'],
  22: ['#C9A86A', '#A87C28'],
  33: ['#FDE68A', '#F59E0B'],
};

export const PLANET_SYMBOLS: Record<Planet, string> = {
  sun: '☉', moon: '☽', mars: '♂', venus: '♀',
  mercury: '☿', jupiter: '♃', saturn: '♄',
  uranus: '♅', neptune: '♆', pluto: '♇', earth: '⊕',
};

export const ZODIAC_SYMBOLS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

/* ────────────────────────────────────────────────────────────────────
   22 Tarot Major Arcana for Karma Matrix positions
   ──────────────────────────────────────────────────────────────────── */

export interface TarotArcana {
  name: { ru: string; en: string; es: string };
  planet: Planet;
  zodiac?: string;
  keywords: { ru: string[]; en: string[]; es: string[] };
  meaning: { ru: string; en: string; es: string };
}

export const TAROT_ARCANA: Record<number, TarotArcana> = {
  1: {
    name: { ru: 'Маг', en: 'The Magician', es: 'El Mago' },
    planet: 'mercury',
    keywords: {
      ru: ['воля', 'мастерство', 'творение'],
      en: ['will', 'mastery', 'creation'],
      es: ['voluntad', 'maestría', 'creación'],
    },
    meaning: {
      ru: 'Сила воли и мастерство воплощения идей в материи.',
      en: 'Willpower and mastery of bringing ideas into form.',
      es: 'Fuerza de voluntad y maestría para manifestar ideas.',
    },
  },
  2: {
    name: { ru: 'Жрица', en: 'The High Priestess', es: 'La Sacerdotisa' },
    planet: 'moon',
    keywords: {
      ru: ['интуиция', 'тайна', 'мудрость'],
      en: ['intuition', 'mystery', 'wisdom'],
      es: ['intuición', 'misterio', 'sabiduría'],
    },
    meaning: {
      ru: 'Доступ к скрытым знаниям и глубокой интуиции.',
      en: 'Access to hidden knowledge and deep intuition.',
      es: 'Acceso a conocimientos ocultos y profunda intuición.',
    },
  },
  3: {
    name: { ru: 'Императрица', en: 'The Empress', es: 'La Emperatriz' },
    planet: 'venus',
    keywords: {
      ru: ['изобилие', 'творчество', 'плодородие'],
      en: ['abundance', 'creativity', 'fertility'],
      es: ['abundancia', 'creatividad', 'fertilidad'],
    },
    meaning: {
      ru: 'Изобилие, творческая сила, плодородие во всех сферах.',
      en: 'Abundance, creative power, fertility in all spheres.',
      es: 'Abundancia, poder creativo, fertilidad en todas las áreas.',
    },
  },
  4: {
    name: { ru: 'Император', en: 'The Emperor', es: 'El Emperador' },
    planet: 'mars',
    keywords: {
      ru: ['власть', 'структура', 'стабильность'],
      en: ['power', 'structure', 'stability'],
      es: ['poder', 'estructura', 'estabilidad'],
    },
    meaning: {
      ru: 'Власть, чёткие структуры, способность строить надёжный мир.',
      en: 'Authority, clear structure, ability to build a stable world.',
      es: 'Autoridad, estructura clara, capacidad de construir estabilidad.',
    },
  },
  5: {
    name: { ru: 'Иерофант', en: 'The Hierophant', es: 'El Hierofante' },
    planet: 'venus', zodiac: 'taurus',
    keywords: {
      ru: ['традиция', 'духовность', 'наставник'],
      en: ['tradition', 'spirituality', 'mentor'],
      es: ['tradición', 'espiritualidad', 'mentor'],
    },
    meaning: {
      ru: 'Связь с традицией, духовное наставничество, передача знаний.',
      en: 'Connection to tradition, spiritual guidance, transmission of wisdom.',
      es: 'Conexión con la tradición y guía espiritual.',
    },
  },
  6: {
    name: { ru: 'Влюблённые', en: 'The Lovers', es: 'Los Enamorados' },
    planet: 'mercury', zodiac: 'gemini',
    keywords: {
      ru: ['выбор', 'любовь', 'союз'],
      en: ['choice', 'love', 'union'],
      es: ['elección', 'amor', 'unión'],
    },
    meaning: {
      ru: 'Любовь, осознанный выбор, союз сердца и разума.',
      en: 'Love, conscious choice, union of heart and mind.',
      es: 'Amor, elección consciente, unión de corazón y mente.',
    },
  },
  7: {
    name: { ru: 'Колесница', en: 'The Chariot', es: 'El Carro' },
    planet: 'moon', zodiac: 'cancer',
    keywords: {
      ru: ['победа', 'движение', 'контроль'],
      en: ['victory', 'movement', 'control'],
      es: ['victoria', 'movimiento', 'control'],
    },
    meaning: {
      ru: 'Победа через волю, движение к цели, контроль над страстями.',
      en: 'Victory through will, movement toward goals, mastery of impulses.',
      es: 'Victoria por la voluntad, movimiento y dominio de los impulsos.',
    },
  },
  8: {
    name: { ru: 'Сила', en: 'Strength', es: 'La Fuerza' },
    planet: 'sun', zodiac: 'leo',
    keywords: {
      ru: ['сила', 'смелость', 'укрощение'],
      en: ['strength', 'courage', 'taming'],
      es: ['fuerza', 'coraje', 'dominio'],
    },
    meaning: {
      ru: 'Внутренняя сила, мягкое укрощение страстей, тихое мужество.',
      en: 'Inner strength, gentle taming of passions, quiet courage.',
      es: 'Fuerza interior, dominio amable de las pasiones.',
    },
  },
  9: {
    name: { ru: 'Отшельник', en: 'The Hermit', es: 'El Ermitaño' },
    planet: 'mercury', zodiac: 'virgo',
    keywords: {
      ru: ['мудрость', 'уединение', 'поиск'],
      en: ['wisdom', 'solitude', 'search'],
      es: ['sabiduría', 'soledad', 'búsqueda'],
    },
    meaning: {
      ru: 'Мудрость, обретённая в уединении, внутренний свет ищущего.',
      en: 'Wisdom found in solitude, the inner light of the seeker.',
      es: 'Sabiduría hallada en soledad, luz interior del buscador.',
    },
  },
  10: {
    name: { ru: 'Колесо Фортуны', en: 'Wheel of Fortune', es: 'La Rueda' },
    planet: 'jupiter',
    keywords: {
      ru: ['судьба', 'цикл', 'удача'],
      en: ['fate', 'cycle', 'luck'],
      es: ['destino', 'ciclo', 'suerte'],
    },
    meaning: {
      ru: 'Колесо судьбы вращается — циклы перемен, везение и уроки.',
      en: 'The wheel turns — cycles of change, luck and lessons.',
      es: 'La rueda gira — ciclos de cambio, suerte y lecciones.',
    },
  },
  11: {
    name: { ru: 'Справедливость', en: 'Justice', es: 'La Justicia' },
    planet: 'venus', zodiac: 'libra',
    keywords: {
      ru: ['баланс', 'карма', 'правосудие'],
      en: ['balance', 'karma', 'justice'],
      es: ['equilibrio', 'karma', 'justicia'],
    },
    meaning: {
      ru: 'Точные весы кармы — каждое действие возвращается.',
      en: 'Precise scales of karma — every action returns.',
      es: 'Balanza exacta del karma — cada acción regresa.',
    },
  },
  12: {
    name: { ru: 'Повешенный', en: 'The Hanged Man', es: 'El Colgado' },
    planet: 'neptune',
    keywords: {
      ru: ['жертва', 'ожидание', 'перемены'],
      en: ['sacrifice', 'pause', 'shift'],
      es: ['sacrificio', 'pausa', 'cambio'],
    },
    meaning: {
      ru: 'Жертва ради нового взгляда, остановка ради прозрения.',
      en: 'Sacrifice for a new perspective, pause for insight.',
      es: 'Sacrificio para una nueva visión, pausa para comprender.',
    },
  },
  13: {
    name: { ru: 'Смерть', en: 'Death', es: 'La Muerte' },
    planet: 'mars', zodiac: 'scorpio',
    keywords: {
      ru: ['трансформация', 'конец', 'перерождение'],
      en: ['transformation', 'ending', 'rebirth'],
      es: ['transformación', 'fin', 'renacer'],
    },
    meaning: {
      ru: 'Глубокая трансформация — конец одного и рождение другого.',
      en: 'Deep transformation — end of one cycle, birth of another.',
      es: 'Transformación profunda — fin de un ciclo y nuevo nacer.',
    },
  },
  14: {
    name: { ru: 'Умеренность', en: 'Temperance', es: 'La Templanza' },
    planet: 'jupiter', zodiac: 'sagittarius',
    keywords: {
      ru: ['баланс', 'синтез', 'терпение'],
      en: ['balance', 'synthesis', 'patience'],
      es: ['equilibrio', 'síntesis', 'paciencia'],
    },
    meaning: {
      ru: 'Алхимия баланса, мягкое смешение противоположностей.',
      en: 'The alchemy of balance, gentle blending of opposites.',
      es: 'Alquimia del equilibrio y mezcla suave de opuestos.',
    },
  },
  15: {
    name: { ru: 'Дьявол', en: 'The Devil', es: 'El Diablo' },
    planet: 'saturn', zodiac: 'capricorn',
    keywords: {
      ru: ['искушение', 'зависимость', 'тень'],
      en: ['temptation', 'attachment', 'shadow'],
      es: ['tentación', 'apego', 'sombra'],
    },
    meaning: {
      ru: 'Тень и привязанности — точка освобождения через осознание.',
      en: 'Shadow and attachments — freedom through awareness.',
      es: 'Sombra y apegos — liberación por la conciencia.',
    },
  },
  16: {
    name: { ru: 'Башня', en: 'The Tower', es: 'La Torre' },
    planet: 'mars',
    keywords: {
      ru: ['разрушение', 'откровение', 'освобождение'],
      en: ['breakdown', 'revelation', 'release'],
      es: ['ruptura', 'revelación', 'liberación'],
    },
    meaning: {
      ru: 'Внезапное разрушение ложных опор ради подлинного.',
      en: 'Sudden breaking of false supports to reveal the real.',
      es: 'Caída súbita de lo falso para revelar lo verdadero.',
    },
  },
  17: {
    name: { ru: 'Звезда', en: 'The Star', es: 'La Estrella' },
    planet: 'uranus', zodiac: 'aquarius',
    keywords: {
      ru: ['надежда', 'вдохновение', 'исцеление'],
      en: ['hope', 'inspiration', 'healing'],
      es: ['esperanza', 'inspiración', 'sanación'],
    },
    meaning: {
      ru: 'Тихий свет надежды, вдохновение и медленное исцеление.',
      en: 'A quiet light of hope, inspiration and gentle healing.',
      es: 'Luz silenciosa de esperanza, inspiración y sanación.',
    },
  },
  18: {
    name: { ru: 'Луна', en: 'The Moon', es: 'La Luna' },
    planet: 'neptune', zodiac: 'pisces',
    keywords: {
      ru: ['иллюзия', 'страхи', 'подсознание'],
      en: ['illusion', 'fears', 'subconscious'],
      es: ['ilusión', 'miedos', 'inconsciente'],
    },
    meaning: {
      ru: 'Туман иллюзий, встреча с тенью и интуитивная навигация.',
      en: 'The fog of illusion, meeting the shadow, intuitive navigation.',
      es: 'Niebla de ilusiones y navegación intuitiva por la sombra.',
    },
  },
  19: {
    name: { ru: 'Солнце', en: 'The Sun', es: 'El Sol' },
    planet: 'sun',
    keywords: {
      ru: ['радость', 'успех', 'просветление'],
      en: ['joy', 'success', 'enlightenment'],
      es: ['alegría', 'éxito', 'iluminación'],
    },
    meaning: {
      ru: 'Сияющая радость, ясность и расцвет всех начинаний.',
      en: 'Radiant joy, clarity and flourishing of all endeavors.',
      es: 'Alegría radiante, claridad y florecimiento.',
    },
  },
  20: {
    name: { ru: 'Суд', en: 'Judgement', es: 'El Juicio' },
    planet: 'pluto',
    keywords: {
      ru: ['возрождение', 'призыв', 'итог'],
      en: ['rebirth', 'calling', 'reckoning'],
      es: ['renacer', 'llamada', 'balance'],
    },
    meaning: {
      ru: 'Призыв к возрождению, подведение итогов и новый старт.',
      en: 'A call to rebirth, reckoning and a fresh start.',
      es: 'Llamada al renacer, balance y nuevo comienzo.',
    },
  },
  21: {
    name: { ru: 'Мир', en: 'The World', es: 'El Mundo' },
    planet: 'saturn',
    keywords: {
      ru: ['завершение', 'интеграция', 'триумф'],
      en: ['completion', 'integration', 'triumph'],
      es: ['completitud', 'integración', 'triunfo'],
    },
    meaning: {
      ru: 'Цикл замкнут — целостность, мастерство и триумф пути.',
      en: 'The cycle closes — wholeness, mastery and triumph of the path.',
      es: 'El ciclo se cierra — plenitud, maestría y triunfo.',
    },
  },
  22: {
    name: { ru: 'Шут', en: 'The Fool', es: 'El Loco' },
    planet: 'uranus',
    keywords: {
      ru: ['начало', 'свобода', 'доверие'],
      en: ['beginning', 'freedom', 'trust'],
      es: ['inicio', 'libertad', 'confianza'],
    },
    meaning: {
      ru: 'Свежее начало, свобода и доверие пути в неизвестное.',
      en: 'A fresh beginning, freedom and trust in the unknown path.',
      es: 'Nuevo comienzo, libertad y confianza en lo desconocido.',
    },
  },
};

/* ────────────────────────────────────────────────────────────────────
   Number compatibility
   ──────────────────────────────────────────────────────────────────── */

export type CompatibilityType = 'soul_mates' | 'growth' | 'challenge' | 'neutral';

export interface Compatibility {
  score: number; // 1..10
  type: CompatibilityType;
}

/** Simple compatibility heuristic between two reduced numbers. */
export function numberCompatibility(n1: number, n2: number): Compatibility {
  const e1 = NUMBER_ELEMENTS[n1];
  const e2 = NUMBER_ELEMENTS[n2];
  if (n1 === n2) return { score: 9, type: 'soul_mates' };
  if (e1 === e2) return { score: 8, type: 'soul_mates' };
  const harmonic =
    (e1 === 'fire' && e2 === 'air') ||
    (e1 === 'air' && e2 === 'fire') ||
    (e1 === 'earth' && e2 === 'water') ||
    (e1 === 'water' && e2 === 'earth');
  if (harmonic) return { score: 7, type: 'growth' };
  return { score: 5, type: 'challenge' };
}