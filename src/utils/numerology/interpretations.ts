/**
 * Asceta numerology — base interpretations for numbers 1-9, 11, 22, 33.
 *
 * These are concise, mystical, non-judgemental templates.
 * Deep personalized analysis is generated via the AI edge function.
 */

import type { CellStrength } from './calculations';

export type Lang = 'ru' | 'en' | 'es';

export interface I18nText {
  ru: string;
  en: string;
  es: string;
}

export interface I18nList {
  ru: string[];
  en: string[];
  es: string[];
}

export interface PythagoreanLifePathBlock {
  title: I18nText;
  essence: I18nText;
  shadow: I18nText;
  gifts: I18nList;
  challenges: I18nList;
  mission: I18nText;
  relationships: I18nText;
  career: I18nText;
  spiritual: I18nText;
  affirmation: I18nText;
}

export interface ShortBlock {
  title: I18nText;
  essence: I18nText;
}

export interface NumberMeaning {
  pythagorean: {
    lifePath: PythagoreanLifePathBlock;
    soul: ShortBlock;
    personality: ShortBlock;
    expression: ShortBlock;
  };
  chaldean: {
    single: ShortBlock;
  };
  crystals: I18nList;
  luckyDay: I18nText;
  luckyNumbers: number[];
}

/* Helper to keep entries terse. */
const t = (ru: string, en: string, es: string): I18nText => ({ ru, en, es });
const l = (ru: string[], en: string[], es: string[]): I18nList => ({ ru, en, es });

/* ────────────────────────────────────────────────────────────────────
   Number meanings
   ──────────────────────────────────────────────────────────────────── */

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    pythagorean: {
      lifePath: {
        title: t('Лидер', 'The Leader', 'El Líder'),
        essence: t(
          'Единица — это первый луч, прорезающий тьму. Вы пришли, чтобы быть первооткрывателем, инициировать новое и вести за собой. В вас живёт солнечная воля и творческий импульс начала.',
          'One is the first ray that pierces the dark. You came to pioneer, initiate, and lead. Within you lives a solar will and the creative impulse of beginning.',
          'El uno es el primer rayo que atraviesa la oscuridad. Vienes a iniciar, abrir caminos y liderar.'
        ),
        shadow: t(
          'Тень единицы — упрямство, эгоцентризм и одиночество того, кто не научился слышать других.',
          'The shadow of One is stubbornness, ego, and the loneliness of one who has not learned to listen.',
          'La sombra del uno: terquedad, ego y la soledad de quien no escucha.'
        ),
        gifts: l(
          ['воля', 'независимость', 'оригинальность', 'смелость'],
          ['will', 'independence', 'originality', 'courage'],
          ['voluntad', 'independencia', 'originalidad', 'coraje']
        ),
        challenges: l(
          ['эгоизм', 'упрямство', 'нетерпение'],
          ['ego', 'stubbornness', 'impatience'],
          ['ego', 'terquedad', 'impaciencia']
        ),
        mission: t(
          'Ваша миссия — стать самим собой настолько полно, чтобы это вдохновляло других. Вы здесь, чтобы открыть новые пути и доверить миру свою уникальность.',
          'Your mission is to become yourself so fully that it inspires others. You are here to open new paths and entrust the world with your uniqueness.',
          'Tu misión es ser tú mismo de forma tan plena que inspires a otros.'
        ),
        relationships: t(
          'В отношениях единице важна свобода. Вы расцветаете рядом с тем, кто уважает вашу независимость и не пытается приручить.',
          'In love, One needs freedom. You bloom beside someone who respects your independence and does not try to tame.',
          'En el amor el uno necesita libertad y respeto a su independencia.'
        ),
        career: t(
          'Профессии лидера, основателя, первопроходца. Свой бизнес, наука, спорт, изобретательство — всё, где можно начать с чистого листа.',
          'Roles of a leader, founder, pioneer. Own business, science, sport, invention — anywhere a clean start is possible.',
          'Liderazgo, emprendimiento, ciencia, deporte, invención.'
        ),
        spiritual: t(
          'Духовный путь — научиться различать свою волю и волю целого, быть лучом, а не центром мироздания.',
          'The spiritual path: to discern your will from the will of the whole, to be a ray and not the center of all.',
          'Camino espiritual: distinguir tu voluntad de la voluntad del todo.'
        ),
        affirmation: t(
          'Я — первый луч творения, я смело иду своим путём.',
          'I am the first ray of creation, I walk my path with courage.',
          'Soy el primer rayo de la creación, camino mi sendero con coraje.'
        ),
      },
      soul: {
        title: t('Душа лидера', 'Leader Soul', 'Alma de líder'),
        essence: t(
          'Внутри вы жаждете быть первым, оставить след, быть собой без оглядки.',
          'Within, you long to be first, to leave a mark, to be yourself unapologetically.',
          'En el alma anhelas ser el primero y dejar tu huella.'
        ),
      },
      personality: {
        title: t('Образ лидера', 'Leader Persona', 'Personaje líder'),
        essence: t(
          'Окружающие видят вас уверенным, прямым и решительным.',
          'Others see you confident, direct, and decisive.',
          'Los demás te ven seguro, directo y decidido.'
        ),
      },
      expression: {
        title: t('Путь созидателя', 'Creator Path', 'Sendero creador'),
        essence: t(
          'Ваши таланты — инициатива, вдохновение и смелость пробовать первым.',
          'Your gifts: initiative, inspiration, the courage to try first.',
          'Tus dones: iniciativa, inspiración y coraje pionero.'
        ),
      },
    },
    chaldean: {
      single: {
        title: t('Солнечное Я', 'Solar Self', 'Yo solar'),
        essence: t(
          'В Халдейской системе единица — солнечный свет личности, харизма и прямота.',
          'In Chaldean, One is the solar light of personality, charisma and directness.',
          'En el sistema caldeo el uno es la luz solar de la personalidad.'
        ),
      },
    },
    crystals: l(['янтарь', 'рубин', 'цитрин'], ['amber', 'ruby', 'citrine'], ['ámbar', 'rubí', 'citrino']),
    luckyDay: t('воскресенье', 'Sunday', 'domingo'),
    luckyNumbers: [1, 10, 19, 28],
  },

  2: {
    pythagorean: {
      lifePath: {
        title: t('Дипломат', 'The Diplomat', 'El Diplomático'),
        essence: t(
          'Двойка — лунный свет, мягко связывающий миры. Вы здесь, чтобы быть мостом между людьми, чувствовать тонкие токи и приносить мир.',
          'Two is moonlight gently linking worlds. You are here to bridge people, feel subtle currents, and bring peace.',
          'El dos es la luz lunar que une mundos. Vienes a tender puentes y traer paz.'
        ),
        shadow: t(
          'Тень двойки — нерешительность, зависимость от чужого мнения и страх собственной силы.',
          'The shadow of Two: indecision, dependence on others, fear of your own power.',
          'Sombra del dos: indecisión y dependencia.'
        ),
        gifts: l(['чуткость', 'дипломатия', 'интуиция'], ['sensitivity', 'diplomacy', 'intuition'], ['sensibilidad', 'diplomacia', 'intuición']),
        challenges: l(['нерешительность', 'обидчивость', 'зависимость'], ['indecision', 'over-sensitivity', 'dependence'], ['indecisión', 'susceptibilidad', 'dependencia']),
        mission: t(
          'Ваша миссия — учиться быть в паре, в команде, в диалоге, не теряя себя. Вы — носитель тихой женственной силы, которая исцеляет миром.',
          'Your mission: to learn to be in pair, team, dialogue without losing yourself. You carry the quiet feminine power that heals through peace.',
          'Misión: ser en pareja y diálogo sin perderte; eres el poder suave que sana.'
        ),
        relationships: t(
          'В отношениях двойка расцветает в искреннем партнёрстве, где её мягкость не принимают за слабость.',
          'In love, Two blooms in honest partnership where softness is not mistaken for weakness.',
          'En el amor florece en una pareja sincera.'
        ),
        career: t(
          'Профессии посредника, советника, психолога, дипломата. Искусства, музыка, тонкая работа с людьми.',
          'Roles of mediator, advisor, psychologist, diplomat. Arts, music, subtle people work.',
          'Mediador, consejero, psicólogo, artista.'
        ),
        spiritual: t(
          'Духовный путь — научиться быть и не растворяться, любить и не сливаться.',
          'The spiritual path: to be without dissolving, to love without fusing.',
          'Camino: ser sin disolverte, amar sin fundirte.'
        ),
        affirmation: t(
          'Я живу в гармонии и сохраняю свою силу.',
          'I live in harmony and keep my strength.',
          'Vivo en armonía y mantengo mi fuerza.'
        ),
      },
      soul: { title: t('Душа гармонии', 'Harmony Soul', 'Alma de armonía'), essence: t('Вы жаждете глубокого союза и тихой близости.', 'You long for deep union and quiet closeness.', 'Anhelas unión profunda.') },
      personality: { title: t('Мягкий образ', 'Gentle Persona', 'Persona suave'), essence: t('Вас воспринимают тёплым, чутким и располагающим.', 'You are seen as warm, sensitive, approachable.', 'Te perciben cálido y receptivo.') },
      expression: { title: t('Путь миротворца', 'Peacemaker Path', 'Sendero del mediador'), essence: t('Ваш дар — соединять людей и смягчать острые углы.', 'Your gift: to connect people and soften sharp edges.', 'Don: unir personas y suavizar tensiones.') },
    },
    chaldean: { single: { title: t('Лунное чувство', 'Lunar Feeling', 'Sentir lunar'), essence: t('Халдейская двойка — лунная чуткость и переменчивость настроений.', 'Chaldean Two — lunar sensitivity and changing moods.', 'Dos caldeo: sensibilidad lunar y cambios de ánimo.') } },
    crystals: l(['жемчуг', 'лунный камень', 'селенит'], ['pearl', 'moonstone', 'selenite'], ['perla', 'piedra luna', 'selenita']),
    luckyDay: t('понедельник', 'Monday', 'lunes'),
    luckyNumbers: [2, 11, 20, 29],
  },

  3: {
    pythagorean: {
      lifePath: {
        title: t('Творец', 'The Creator', 'El Creador'),
        essence: t(
          'Тройка — радостный огонь Юпитера. Вы — голос, краска и улыбка мира. Через вас творчество находит форму, а тяжёлое — лёгкость.',
          'Three is the joyful fire of Jupiter. You are voice, color, and smile of the world. Through you creativity takes form and heaviness becomes light.',
          'El tres es el fuego alegre de Júpiter: voz, color y sonrisa del mundo.'
        ),
        shadow: t(
          'Тень тройки — поверхностность, разбрасывание сил и страх глубины.',
          'Shadow of Three: superficiality, scattered energy, fear of depth.',
          'Sombra: superficialidad y dispersión.'
        ),
        gifts: l(['творчество', 'оптимизм', 'красноречие'], ['creativity', 'optimism', 'eloquence'], ['creatividad', 'optimismo', 'elocuencia']),
        challenges: l(['разбросанность', 'поверхностность', 'критичность'], ['scatter', 'shallowness', 'criticism'], ['dispersión', 'superficialidad', 'crítica']),
        mission: t(
          'Ваша миссия — нести радость и красоту, превращать обыденное в искусство, говорить миру слова, которые лечат.',
          'Your mission: bring joy and beauty, turn the ordinary into art, speak words that heal.',
          'Misión: traer alegría, belleza y palabras que sanan.'
        ),
        relationships: t('В любви вам нужна лёгкость, юмор и пространство для выражения себя.', 'In love you need lightness, humor and room to express yourself.', 'En el amor: ligereza y humor.'),
        career: t('Творчество, искусство, журналистика, обучение, шоу-бизнес — везде, где есть слово и сцена.', 'Creative work, arts, journalism, teaching, performance.', 'Arte, comunicación, escenario.'),
        spiritual: t('Духовный путь — научиться углубляться, не теряя радости поверхности.', 'Path: to go deep without losing the joy of the surface.', 'Camino: profundizar sin perder la alegría.'),
        affirmation: t('Я — живая радость, я творю с лёгкостью.', 'I am living joy, I create with ease.', 'Soy alegría viva y creo con facilidad.'),
      },
      soul: { title: t('Душа артиста', 'Artist Soul', 'Alma artista'), essence: t('Вы жаждете самовыражения и творческого огня.', 'You long for self-expression and creative fire.', 'Anhelas expresarte.') },
      personality: { title: t('Сияющий образ', 'Radiant Persona', 'Persona radiante'), essence: t('Вас видят обаятельным, ярким, артистичным.', 'Others see you charming, bright, artistic.', 'Te ven encantador y artístico.') },
      expression: { title: t('Путь художника', 'Artist Path', 'Sendero del artista'), essence: t('Ваш дар — слово, образ и вдохновляющее общение.', 'Your gift: word, image, inspiring communication.', 'Don: palabra, imagen y comunicación.') },
    },
    chaldean: { single: { title: t('Юпитерианский размах', 'Jovian Sweep', 'Amplitud joviana'), essence: t('Халдейская тройка — щедрость, талант и стремление к большему.', 'Chaldean Three — generosity, talent, hunger for more.', 'Tres caldeo: generosidad y talento.') } },
    crystals: l(['аметист', 'топаз', 'сердолик'], ['amethyst', 'topaz', 'carnelian'], ['amatista', 'topacio', 'cornalina']),
    luckyDay: t('четверг', 'Thursday', 'jueves'),
    luckyNumbers: [3, 12, 21, 30],
  },

  4: {
    pythagorean: {
      lifePath: {
        title: t('Строитель', 'The Builder', 'El Constructor'),
        essence: t(
          'Четвёрка — это камень в основании. Вы пришли строить — отношения, дело, мир, который переживёт вас. В вас живёт верность форме, ритуалу и труду.',
          'Four is the stone in the foundation. You came to build — relationships, work, a world that outlasts you. In you lives devotion to form, ritual, and labor.',
          'El cuatro es la piedra fundacional. Vienes a construir.'
        ),
        shadow: t('Тень четвёрки — ригидность, страх перемен, превращение труда в каторгу.', 'Shadow of Four: rigidity, fear of change, turning work into bondage.', 'Sombra: rigidez y miedo al cambio.'),
        gifts: l(['надёжность', 'дисциплина', 'трудолюбие'], ['reliability', 'discipline', 'diligence'], ['fiabilidad', 'disciplina', 'diligencia']),
        challenges: l(['жёсткость', 'упрямство', 'переутомление'], ['rigidity', 'stubbornness', 'burnout'], ['rigidez', 'terquedad', 'agotamiento']),
        mission: t('Ваша миссия — создать прочное и научиться менять его, когда жизнь зовёт. Вы — мастер формы, в которую втекает дух.', 'Mission: build the lasting and learn to change it when life calls. You are master of form into which spirit flows.', 'Misión: construir lo duradero y saber transformarlo.'),
        relationships: t('В любви четвёрке нужна верность, постоянство и совместный труд.', 'In love Four needs loyalty, constancy and shared labor.', 'En amor: lealtad y constancia.'),
        career: t('Архитектура, инженерия, финансы, ремёсла, юриспруденция, всё что требует точности и времени.', 'Architecture, engineering, finance, craft, law — anything requiring precision and time.', 'Arquitectura, ingeniería, finanzas, derecho.'),
        spiritual: t('Духовный путь — превратить дисциплину в радость и понять, что форма служит духу.', 'Path: turn discipline into joy and see that form serves spirit.', 'Camino: que la disciplina sea alegría.'),
        affirmation: t('Я строю прочное и остаюсь свободным.', 'I build the lasting and remain free.', 'Construyo lo duradero y soy libre.'),
      },
      soul: { title: t('Душа труженика', 'Worker Soul', 'Alma laboriosa'), essence: t('Вы жаждете порядка и осмысленного труда.', 'You long for order and meaningful work.', 'Anhelas orden y trabajo con sentido.') },
      personality: { title: t('Надёжный образ', 'Reliable Persona', 'Persona fiable'), essence: t('Вас воспринимают серьёзным, основательным, надёжным.', 'You are seen serious, grounded, reliable.', 'Te perciben sólido y fiable.') },
      expression: { title: t('Путь мастера', 'Master Path', 'Sendero del maestro'), essence: t('Ваш дар — превращать идеи в работающие системы.', 'Your gift: turn ideas into working systems.', 'Don: convertir ideas en sistemas.') },
    },
    chaldean: { single: { title: t('Уран четвёрки', 'Uranian Four', 'Cuatro uraniano'), essence: t('Халдейская четвёрка несёт уранический заряд — нестандартность и внутренний мятеж.', 'Chaldean Four carries Uranian charge — unconventionality and inner rebellion.', 'Cuatro caldeo: carga uraniana y rebeldía interior.') } },
    crystals: l(['гранат', 'оникс', 'тигровый глаз'], ['garnet', 'onyx', 'tiger eye'], ['granate', 'ónix', 'ojo de tigre']),
    luckyDay: t('суббота', 'Saturday', 'sábado'),
    luckyNumbers: [4, 13, 22, 31],
  },

  5: {
    pythagorean: {
      lifePath: {
        title: t('Исследователь', 'The Explorer', 'El Explorador'),
        essence: t(
          'Пятёрка — это ветер, проходящий сквозь все формы. Вы пришли пробовать жизнь на вкус: пять чувств, пять путей, пять огней свободы. Через вас мир познаёт собственное многообразие.',
          'Five is the wind passing through all forms. You came to taste life: five senses, five paths, five fires of freedom. Through you the world tastes its own diversity.',
          'El cinco es el viento que cruza todas las formas. Vienes a saborear la vida.'
        ),
        shadow: t('Тень пятёрки — непостоянство, бегство от обязательств, импульсивность и зависимости.', 'Shadow of Five: inconstancy, flight from commitment, impulsivity, addictions.', 'Sombra: inconstancia y fuga de los compromisos.'),
        gifts: l(['свобода', 'адаптивность', 'харизма', 'любопытство'], ['freedom', 'adaptability', 'charisma', 'curiosity'], ['libertad', 'adaptabilidad', 'carisma', 'curiosidad']),
        challenges: l(['непостоянство', 'избегание', 'импульсивность'], ['inconstancy', 'avoidance', 'impulsivity'], ['inconstancia', 'evasión', 'impulsividad']),
        mission: t('Ваша миссия — пройти через множество дверей и принести из странствий мудрость, которой не научишься в одном месте.', 'Mission: pass through many doors and bring back wisdom no single place could teach.', 'Misión: cruzar muchas puertas y traer sabiduría.'),
        relationships: t('В любви пятёрке нужна свобода, движение и партнёр-друг, с которым не скучно ни дня.', 'In love Five needs freedom, motion and a partner-friend who never bores.', 'En amor: libertad y compañero amigo.'),
        career: t('Путешествия, журналистика, продажи, маркетинг, языки, всё связанное с движением и общением.', 'Travel, journalism, sales, marketing, languages — anything involving motion and contact.', 'Viajes, comunicación, ventas, idiomas.'),
        spiritual: t('Духовный путь — найти свободу не вовне, а внутри, и научиться оставаться, когда это просит душа.', 'Path: find freedom within, not without, and learn to stay when the soul asks.', 'Camino: hallar libertad interior y saber permanecer.'),
        affirmation: t('Я свободен и открыт переменам, я — живой ветер.', 'I am free and open to change, I am the living wind.', 'Soy libre y abierto al cambio, soy viento vivo.'),
      },
      soul: { title: t('Душа странника', 'Wanderer Soul', 'Alma viajera'), essence: t('Вы жаждете опыта, новизны и свободы.', 'You long for experience, novelty and freedom.', 'Anhelas experiencia y libertad.') },
      personality: { title: t('Образ свободного', 'Free Persona', 'Persona libre'), essence: t('Вас видят живым, контактным, любопытным.', 'You are seen lively, contactful, curious.', 'Te ven vital y curioso.') },
      expression: { title: t('Путь вестника', 'Messenger Path', 'Sendero del mensajero'), essence: t('Ваш дар — общение, передача информации и смелость пробовать первым.', 'Your gift: communication, transmission, courage to try first.', 'Don: comunicar y atreverte.') },
    },
    chaldean: { single: { title: t('Меркурианская скорость', 'Mercurial Speed', 'Velocidad mercurial'), essence: t('Халдейская пятёрка — острый ум Меркурия и магнетизм слова.', 'Chaldean Five — sharp Mercurial mind and magnetic speech.', 'Cinco caldeo: mente aguda y palabra magnética.') } },
    crystals: l(['аквамарин', 'бирюза', 'сапфир'], ['aquamarine', 'turquoise', 'sapphire'], ['aguamarina', 'turquesa', 'zafiro']),
    luckyDay: t('среда', 'Wednesday', 'miércoles'),
    luckyNumbers: [5, 14, 23],
  },

  6: {
    pythagorean: {
      lifePath: {
        title: t('Хранитель', 'The Caregiver', 'El Guardián'),
        essence: t(
          'Шестёрка — тёплое сердце дома и красота, которую видит Венера. Вы пришли заботиться, любить, создавать пространство, где другие исцеляются.',
          'Six is the warm heart of the home and the beauty Venus sees. You came to care, love, and craft spaces where others heal.',
          'El seis es el corazón cálido del hogar.'
        ),
        shadow: t('Тень шестёрки — жертвенность, контроль через заботу и страх своих границ.', 'Shadow of Six: martyrdom, control through care, fear of boundaries.', 'Sombra: martirio y control a través del cuidado.'),
        gifts: l(['любовь', 'забота', 'эстетика', 'верность'], ['love', 'care', 'aesthetics', 'loyalty'], ['amor', 'cuidado', 'estética', 'lealtad']),
        challenges: l(['жертвенность', 'контроль', 'ревность'], ['self-sacrifice', 'control', 'jealousy'], ['sacrificio', 'control', 'celos']),
        mission: t('Ваша миссия — учиться любить, не растворяясь, заботиться, не контролируя, и видеть красоту даже в трудном.', 'Mission: love without dissolving, care without controlling, see beauty even in the difficult.', 'Misión: amar sin disolverte y cuidar sin controlar.'),
        relationships: t('В любви шестёрке нужны глубокая верность, дом и взаимная забота.', 'In love Six needs deep loyalty, home, and mutual care.', 'En amor: lealtad profunda y hogar.'),
        career: t('Медицина, педагогика, дизайн, искусство, семейный консалтинг, забота и красота.', 'Medicine, teaching, design, arts, family work — care and beauty.', 'Medicina, enseñanza, diseño, arte.'),
        spiritual: t('Духовный путь — научиться брать так же щедро, как отдавать.', 'Path: learn to receive as generously as you give.', 'Camino: recibir con la misma generosidad con la que das.'),
        affirmation: t('Я люблю свободно и щедро, и сам наполняюсь любовью.', 'I love freely and generously, and I am filled with love.', 'Amo libremente y soy colmado de amor.'),
      },
      soul: { title: t('Душа любящего', 'Loving Soul', 'Alma amorosa'), essence: t('Вы жаждете любить и быть нужным.', 'You long to love and to be needed.', 'Anhelas amar y ser necesario.') },
      personality: { title: t('Тёплый образ', 'Warm Persona', 'Persona cálida'), essence: t('Вас воспринимают тёплым, ответственным, эстетичным.', 'You are seen warm, responsible, aesthetic.', 'Te ven cálido y estético.') },
      expression: { title: t('Путь хранителя', 'Caregiver Path', 'Sendero del guardián'), essence: t('Ваш дар — создавать гармонию и красоту в любом пространстве.', 'Your gift: create harmony and beauty anywhere.', 'Don: crear armonía y belleza.') },
    },
    chaldean: { single: { title: t('Венерианская гармония', 'Venusian Harmony', 'Armonía venusina'), essence: t('Халдейская шестёрка — магнетизм красоты и дар притягивать любовь.', 'Chaldean Six — magnetism of beauty and the gift of attracting love.', 'Seis caldeo: magnetismo de la belleza.') } },
    crystals: l(['розовый кварц', 'изумруд', 'малахит'], ['rose quartz', 'emerald', 'malachite'], ['cuarzo rosa', 'esmeralda', 'malaquita']),
    luckyDay: t('пятница', 'Friday', 'viernes'),
    luckyNumbers: [6, 15, 24],
  },

  7: {
    pythagorean: {
      lifePath: {
        title: t('Мистик', 'The Mystic', 'El Místico'),
        essence: t(
          'Семёрка — глубокий колодец, отражающий звёзды. Вы пришли искать истину под поверхностью, видеть невидимое и слышать тишину.',
          'Seven is the deep well that mirrors stars. You came to seek truth beneath the surface, to see the unseen and hear the silence.',
          'El siete es el pozo profundo que refleja las estrellas.'
        ),
        shadow: t('Тень семёрки — изоляция, подозрительность, побег от мира в холодный анализ.', 'Shadow of Seven: isolation, suspicion, fleeing into cold analysis.', 'Sombra: aislamiento y desconfianza.'),
        gifts: l(['мудрость', 'аналитика', 'духовность', 'интуиция'], ['wisdom', 'analysis', 'spirituality', 'intuition'], ['sabiduría', 'análisis', 'espiritualidad', 'intuición']),
        challenges: l(['изоляция', 'подозрительность', 'холодность'], ['isolation', 'suspicion', 'coldness'], ['aislamiento', 'desconfianza', 'frialdad']),
        mission: t('Ваша миссия — углубляться в тайны жизни и приносить найденную истину людям так, чтобы она грела.', 'Mission: dive deep into life’s mysteries and bring back truth that warms.', 'Misión: profundizar en los misterios y traer una verdad que abrigue.'),
        relationships: t('В любви семёрке нужны пространство, глубина и партнёр, уважающий тишину.', 'In love Seven needs space, depth and a partner who honors silence.', 'En amor: espacio, profundidad y silencio.'),
        career: t('Наука, исследования, эзотерика, психология, философия, технологии будущего.', 'Science, research, esoterics, psychology, philosophy, frontier tech.', 'Ciencia, investigación, esoterismo, filosofía.'),
        spiritual: t('Духовный путь — соединить ум и сердце, не уходя ни в один полюс.', 'Path: unite mind and heart without abandoning either pole.', 'Camino: unir mente y corazón.'),
        affirmation: t('Я доверяю своей мудрости и открыт глубине жизни.', 'I trust my wisdom and open to life’s depth.', 'Confío en mi sabiduría y me abro a lo profundo.'),
      },
      soul: { title: t('Душа искателя', 'Seeker Soul', 'Alma buscadora'), essence: t('Вы жаждете истины и тихого внутреннего знания.', 'You long for truth and quiet inner knowing.', 'Anhelas verdad y saber interior.') },
      personality: { title: t('Загадочный образ', 'Enigmatic Persona', 'Persona enigmática'), essence: t('Вас воспринимают загадочным, глубоким, утончённым.', 'You are seen enigmatic, deep, refined.', 'Te ven enigmático y profundo.') },
      expression: { title: t('Путь мудреца', 'Sage Path', 'Sendero del sabio'), essence: t('Ваш дар — глубина анализа и духовное видение.', 'Your gift: depth of analysis and spiritual sight.', 'Don: análisis profundo y visión espiritual.') },
    },
    chaldean: { single: { title: t('Нептунианская тайна', 'Neptunian Mystery', 'Misterio neptuniano'), essence: t('Халдейская семёрка — мистическая глубина и тонкое чутьё.', 'Chaldean Seven — mystic depth and subtle sensing.', 'Siete caldeo: profundidad mística.') } },
    crystals: l(['аметист', 'лазурит', 'аквамарин'], ['amethyst', 'lapis lazuli', 'aquamarine'], ['amatista', 'lapislázuli', 'aguamarina']),
    luckyDay: t('воскресенье', 'Sunday', 'domingo'),
    luckyNumbers: [7, 16, 25],
  },

  8: {
    pythagorean: {
      lifePath: {
        title: t('Властелин', 'The Achiever', 'El Realizador'),
        essence: t(
          'Восьмёрка — кольцо вечности, замкнувшее дух и материю. Вы пришли владеть, влиять и нести ответственность за то, что создали.',
          'Eight is the ring of infinity binding spirit and matter. You came to wield, influence, and be responsible for what you create.',
          'El ocho es el anillo del infinito.'
        ),
        shadow: t('Тень восьмёрки — жажда контроля, материализм и страх потери власти.', 'Shadow of Eight: hunger for control, materialism, fear of losing power.', 'Sombra: control y miedo a perder.'),
        gifts: l(['амбиции', 'управление', 'материальный успех', 'воля'], ['ambition', 'leadership', 'material success', 'will'], ['ambición', 'liderazgo', 'éxito material', 'voluntad']),
        challenges: l(['контроль', 'жёсткость', 'трудоголизм'], ['control', 'rigidity', 'workaholism'], ['control', 'rigidez', 'adicción al trabajo']),
        mission: t('Ваша миссия — научиться обращаться с властью и ресурсами как с инструментом служения, а не как с целью.', 'Mission: learn to wield power and wealth as tools of service, not as ends.', 'Misión: usar poder y recursos al servicio.'),
        relationships: t('В любви восьмёрке нужен сильный, равный партнёр, способный быть в зрелой паре.', 'In love Eight needs an equal, mature partner.', 'En amor: pareja fuerte e igual.'),
        career: t('Бизнес, финансы, управление, юриспруденция, крупные проекты.', 'Business, finance, executive roles, law, large projects.', 'Negocios, finanzas, dirección.'),
        spiritual: t('Духовный путь — увидеть в материи дух и в каждом долге — карму.', 'Path: see spirit in matter and karma in every duty.', 'Camino: ver espíritu en la materia.'),
        affirmation: t('Я обладаю силой и использую её мудро.', 'I hold power and use it wisely.', 'Tengo poder y lo uso con sabiduría.'),
      },
      soul: { title: t('Душа воина', 'Warrior Soul', 'Alma guerrera'), essence: t('Вы жаждете быть значимым и оставить след в материи.', 'You long to matter and leave a mark on matter.', 'Anhelas dejar huella material.') },
      personality: { title: t('Сильный образ', 'Strong Persona', 'Persona fuerte'), essence: t('Вас видят влиятельным, успешным, статусным.', 'You are seen influential, successful, with status.', 'Te ven influyente y exitoso.') },
      expression: { title: t('Путь руководителя', 'Executive Path', 'Sendero ejecutivo'), essence: t('Ваш дар — стратегия, организация и движение масштабов.', 'Your gift: strategy, organization, scale.', 'Don: estrategia y organización.') },
    },
    chaldean: { single: { title: t('Сатурнианская карма', 'Saturnian Karma', 'Karma saturniano'), essence: t('Халдейская восьмёрка — кармические уроки Сатурна и зрелая ответственность.', 'Chaldean Eight — Saturn karma and mature responsibility.', 'Ocho caldeo: karma saturniano.') } },
    crystals: l(['чёрный турмалин', 'обсидиан', 'гематит'], ['black tourmaline', 'obsidian', 'hematite'], ['turmalina negra', 'obsidiana', 'hematites']),
    luckyDay: t('суббота', 'Saturday', 'sábado'),
    luckyNumbers: [8, 17, 26],
  },

  9: {
    pythagorean: {
      lifePath: {
        title: t('Гуманист', 'The Humanitarian', 'El Humanitario'),
        essence: t(
          'Девятка — последний цвет радуги, в котором уже видна белая нота возвращения. Вы пришли любить мир целиком и служить большему, чем «я».',
          'Nine is the last color of the rainbow, where the white note of return is already heard. You came to love the world whole and to serve something larger than self.',
          'El nueve es el último color del arcoíris, ya con la nota del retorno.'
        ),
        shadow: t('Тень девятки — мученичество, завершённость без действия, утрата границ.', 'Shadow of Nine: martyrdom, finishing without action, loss of boundaries.', 'Sombra: martirio y pérdida de límites.'),
        gifts: l(['сострадание', 'мудрость', 'универсальность', 'щедрость'], ['compassion', 'wisdom', 'universality', 'generosity'], ['compasión', 'sabiduría', 'universalidad', 'generosidad']),
        challenges: l(['мученичество', 'идеализм', 'эмоциональная буря'], ['martyrdom', 'idealism', 'emotional storms'], ['martirio', 'idealismo', 'tormentas emocionales']),
        mission: t('Ваша миссия — отпускать старое и нести в мир универсальную любовь, которая не делит на своих и чужих.', 'Mission: release the old and bring universal love that does not split into us and them.', 'Misión: soltar lo viejo y traer amor universal.'),
        relationships: t('В любви девятке нужен партнёр, разделяющий её идеалы и большое сердце.', 'In love Nine needs a partner sharing ideals and big-heartedness.', 'En amor: ideales y corazón compartidos.'),
        career: t('Гуманитарные миссии, искусство, медицина, психотерапия, духовное наставничество.', 'Humanitarian missions, arts, medicine, therapy, spiritual mentoring.', 'Misiones humanitarias, arte, medicina.'),
        spiritual: t('Духовный путь — научиться любить, не теряя себя, и завершать с благодарностью.', 'Path: love without losing yourself, end with gratitude.', 'Camino: amar sin perderte y cerrar con gratitud.'),
        affirmation: t('Я отпускаю прошлое и излучаю любовь миру.', 'I release the past and radiate love to the world.', 'Suelto el pasado e irradio amor.'),
      },
      soul: { title: t('Душа сострадания', 'Compassionate Soul', 'Alma compasiva'), essence: t('Вы жаждете служить большему и любить безусловно.', 'You long to serve the larger and love unconditionally.', 'Anhelas servir y amar.') },
      personality: { title: t('Благородный образ', 'Noble Persona', 'Persona noble'), essence: t('Вас воспринимают благородным, мудрым, самоотверженным.', 'You are seen noble, wise, self-giving.', 'Te ven noble y sabio.') },
      expression: { title: t('Путь служения', 'Path of Service', 'Sendero del servicio'), essence: t('Ваш дар — соединять разные миры и нести универсальные ценности.', 'Your gift: bridge worlds and carry universal values.', 'Don: unir mundos y valores universales.') },
    },
    chaldean: { single: { title: t('Марсова сила', 'Martial Strength', 'Fuerza marciana'), essence: t('Халдейская девятка — огненная сила Марса и страсть к борьбе за идеал.', 'Chaldean Nine — fiery Mars and passion to fight for ideal.', 'Nueve caldeo: fuerza marciana.') } },
    crystals: l(['рубин', 'красная яшма', 'гранат'], ['ruby', 'red jasper', 'garnet'], ['rubí', 'jaspe rojo', 'granate']),
    luckyDay: t('вторник', 'Tuesday', 'martes'),
    luckyNumbers: [9, 18, 27],
  },

  11: {
    pythagorean: {
      lifePath: {
        title: t('Озарённый', 'The Illumined', 'El Iluminado'),
        essence: t(
          'Одиннадцать — мастер-число интуиции, мост между мирами. Вы пришли быть антенной высших смыслов и нести свет другим.',
          'Eleven is the master number of intuition, a bridge between worlds. You came to be an antenna of higher meaning and bring light.',
          'El once es el número maestro de la intuición.'
        ),
        shadow: t('Тень одиннадцати — тревожность, ощущение «не от мира сего», нервное истощение.', 'Shadow of Eleven: anxiety, feeling out of place, nervous burnout.', 'Sombra: ansiedad y agotamiento nervioso.'),
        gifts: l(['ясновидение', 'вдохновение', 'духовность', 'харизма'], ['clairvoyance', 'inspiration', 'spirituality', 'charisma'], ['clarividencia', 'inspiración', 'espiritualidad', 'carisma']),
        challenges: l(['тревожность', 'нервозность', 'идеализм'], ['anxiety', 'nervousness', 'idealism'], ['ansiedad', 'nerviosismo', 'idealismo']),
        mission: t('Ваша миссия — переводить высокие вибрации в слова и формы, которые могут принять другие.', 'Mission: translate high vibration into words and forms others can receive.', 'Misión: traducir vibración alta en formas comprensibles.'),
        relationships: t('В любви одиннадцати нужен духовно зрелый партнёр, способный к глубине.', 'In love Eleven needs a spiritually mature partner capable of depth.', 'En amor: pareja espiritualmente madura.'),
        career: t('Наставничество, духовные практики, искусство, психология, исцеление.', 'Mentorship, spiritual practice, arts, psychology, healing.', 'Mentoría, prácticas espirituales, sanación.'),
        spiritual: t('Духовный путь — заземлять видения и делать их полезными миру.', 'Path: ground visions and make them useful to the world.', 'Camino: aterrizar las visiones.'),
        affirmation: t('Я ясно слышу свет и приношу его в мир.', 'I clearly hear the light and bring it to the world.', 'Escucho la luz y la traigo al mundo.'),
      },
      soul: { title: t('Душа провидца', 'Visionary Soul', 'Alma visionaria'), essence: t('Вы жаждете истины и духовной реализации.', 'You long for truth and spiritual realization.', 'Anhelas verdad y realización.') },
      personality: { title: t('Светлый образ', 'Luminous Persona', 'Persona luminosa'), essence: t('Вас воспринимают вдохновляющим, утончённым, особенным.', 'You are seen inspiring, refined, special.', 'Te ven inspirador y especial.') },
      expression: { title: t('Путь вдохновителя', 'Inspirer Path', 'Sendero del inspirador'), essence: t('Ваш дар — вдохновлять одним присутствием.', 'Your gift: inspire by presence alone.', 'Don: inspirar con tu presencia.') },
    },
    chaldean: { single: { title: t('Лунно-солнечный мост', 'Lunar-Solar Bridge', 'Puente lunar-solar'), essence: t('Халдейская одиннадцать редуцируется до 2 — но несёт в себе двойной заряд света.', 'Chaldean Eleven reduces to 2 yet carries a doubled charge of light.', 'Once caldeo: doble carga de luz.') } },
    crystals: l(['селенит', 'лабрадорит', 'лунный камень'], ['selenite', 'labradorite', 'moonstone'], ['selenita', 'labradorita', 'piedra luna']),
    luckyDay: t('понедельник', 'Monday', 'lunes'),
    luckyNumbers: [11, 29, 38],
  },

  22: {
    pythagorean: {
      lifePath: {
        title: t('Мастер-Строитель', 'The Master Builder', 'El Maestro Constructor'),
        essence: t(
          'Двадцать два — мастер-число воплощения. Вы способны переводить большие видения в реальные структуры, изменяющие мир.',
          'Twenty-two is the master number of manifestation. You translate big visions into real structures that change the world.',
          'El veintidós es el número maestro de la manifestación.'
        ),
        shadow: t('Тень двадцати двух — тяжесть ответственности, страх собственного масштаба.', 'Shadow of 22: heaviness of responsibility, fear of your own scale.', 'Sombra: peso de la responsabilidad.'),
        gifts: l(['масштаб', 'практичность', 'видение', 'дисциплина'], ['scale', 'practicality', 'vision', 'discipline'], ['escala', 'practicidad', 'visión', 'disciplina']),
        challenges: l(['перегрузка', 'перфекционизм', 'страх масштаба'], ['overload', 'perfectionism', 'fear of scale'], ['sobrecarga', 'perfeccionismo', 'miedo a la escala']),
        mission: t('Ваша миссия — построить нечто большее личного: систему, школу, дело, которое служит многим.', 'Mission: build something larger than personal — a system, school, cause that serves many.', 'Misión: construir algo más grande que tú.'),
        relationships: t('В любви вам нужен партнёр-соратник, разделяющий вашу большую цель.', 'In love you need an ally-partner sharing your big goal.', 'En amor: aliado de tu gran meta.'),
        career: t('Крупные проекты, архитектура изменений, бизнес мирового масштаба, общественные движения.', 'Large projects, architecture of change, world-scale business, movements.', 'Proyectos grandes y movimientos.'),
        spiritual: t('Духовный путь — опереться на дух, когда материя становится тяжёлой.', 'Path: lean on spirit when matter grows heavy.', 'Camino: apoyarte en el espíritu.'),
        affirmation: t('Я воплощаю великое с лёгкостью и опорой на дух.', 'I manifest the great with ease, supported by spirit.', 'Manifiesto lo grande con apoyo del espíritu.'),
      },
      soul: { title: t('Душа созидателя миров', 'World-Builder Soul', 'Alma constructora'), essence: t('Вы жаждете создавать большое и долгое.', 'You long to create big and lasting things.', 'Anhelas crear lo grande y duradero.') },
      personality: { title: t('Монументальный образ', 'Monumental Persona', 'Persona monumental'), essence: t('Вас воспринимают весомым, надёжным, с большим потенциалом.', 'You are seen weighty, reliable, of great potential.', 'Te ven sólido y de gran potencial.') },
      expression: { title: t('Путь архитектора', 'Architect Path', 'Sendero del arquitecto'), essence: t('Ваш дар — превращать видение в работающую реальность мирового уровня.', 'Your gift: turn vision into working world-class reality.', 'Don: visión en realidad de nivel mundial.') },
    },
    chaldean: { single: { title: t('Земное мастерство', 'Earthly Mastery', 'Maestría terrenal'), essence: t('Халдейская двадцать два редуцируется до 4 — мастер материи.', 'Chaldean 22 reduces to 4 — master of matter.', 'Veintidós caldeo: maestro de la materia.') } },
    crystals: l(['оникс', 'тигровый глаз', 'зелёный авантюрин'], ['onyx', 'tiger eye', 'green aventurine'], ['ónix', 'ojo de tigre', 'aventurina']),
    luckyDay: t('суббота', 'Saturday', 'sábado'),
    luckyNumbers: [22, 4, 13, 31],
  },

  33: {
    pythagorean: {
      lifePath: {
        title: t('Мастер Любви', 'The Master Teacher', 'El Maestro del Amor'),
        essence: t(
          'Тридцать три — мастер-число безусловной любви и духовного учительства. Вы пришли быть сосудом высшей любви, исцеляющей других.',
          'Thirty-three is the master number of unconditional love and spiritual teaching. You came to be a vessel of higher love that heals.',
          'El treinta y tres es el número del amor incondicional.'
        ),
        shadow: t('Тень тридцати трёх — выгорание, спасательство, отказ от собственных границ.', 'Shadow of 33: burnout, saviorism, denial of own boundaries.', 'Sombra: agotamiento y salvacionismo.'),
        gifts: l(['безусловная любовь', 'исцеление', 'духовное учительство'], ['unconditional love', 'healing', 'spiritual teaching'], ['amor incondicional', 'sanación', 'enseñanza espiritual']),
        challenges: l(['жертвенность', 'выгорание', 'идеализация'], ['martyrdom', 'burnout', 'idealization'], ['martirio', 'agotamiento', 'idealización']),
        mission: t('Ваша миссия — учить любовью, исцелять присутствием и помнить, что начать нужно с себя.', 'Mission: teach by love, heal by presence, and remember to start with yourself.', 'Misión: enseñar con amor y comenzar contigo.'),
        relationships: t('В любви вам нужен партнёр, понимающий вашу планетарную миссию и помогающий заземляться.', 'In love you need a partner who understands your planetary mission and helps you ground.', 'En amor: pareja que comprenda tu misión.'),
        career: t('Целительство, наставничество, духовные традиции, искусство, гуманитарные миссии.', 'Healing, mentorship, spiritual traditions, arts, humanitarian work.', 'Sanación, mentoría, arte, misiones humanitarias.'),
        spiritual: t('Духовный путь — научиться принимать любовь, а не только отдавать.', 'Path: learn to receive love, not only to give.', 'Camino: recibir amor, no solo dar.'),
        affirmation: t('Я — сосуд безусловной любви, я начинаю с любви к себе.', 'I am a vessel of unconditional love, I begin with love for myself.', 'Soy vasija de amor incondicional, comienzo conmigo.'),
      },
      soul: { title: t('Душа учителя', 'Teacher Soul', 'Alma maestra'), essence: t('Вы жаждете служить и учить через любовь.', 'You long to serve and teach through love.', 'Anhelas servir y enseñar con amor.') },
      personality: { title: t('Святой образ', 'Saintly Persona', 'Persona luminosa'), essence: t('Вас воспринимают мудрым, светлым, исцеляющим.', 'You are seen wise, luminous, healing.', 'Te ven sabio y sanador.') },
      expression: { title: t('Путь мастера любви', 'Master of Love', 'Maestro del amor'), essence: t('Ваш дар — пробуждать в других любовь и веру.', 'Your gift: awaken love and faith in others.', 'Don: despertar amor y fe.') },
    },
    chaldean: { single: { title: t('Высшее учительство', 'Higher Teaching', 'Enseñanza superior'), essence: t('Халдейская тридцать три редуцируется до 6 — мастер любви и красоты.', 'Chaldean 33 reduces to 6 — master of love and beauty.', 'Treinta y tres caldeo: maestro del amor.') } },
    crystals: l(['аметист', 'розовый кварц', 'селенит'], ['amethyst', 'rose quartz', 'selenite'], ['amatista', 'cuarzo rosa', 'selenita']),
    luckyDay: t('пятница', 'Friday', 'viernes'),
    luckyNumbers: [33, 6, 15, 24],
  },
};

/* ────────────────────────────────────────────────────────────────────
   Pythagorean Square — cell strength interpretations
   ──────────────────────────────────────────────────────────────────── */

export const SQUARE_CELL_LABELS: Record<number, I18nText> = {
  1: t('Характер', 'Character', 'Carácter'),
  2: t('Энергия', 'Energy', 'Energía'),
  3: t('Интерес', 'Interest', 'Interés'),
  4: t('Здоровье', 'Health', 'Salud'),
  5: t('Логика', 'Logic', 'Lógica'),
  6: t('Труд', 'Work', 'Trabajo'),
  7: t('Удача', 'Luck', 'Suerte'),
  8: t('Долг', 'Duty', 'Deber'),
  9: t('Память', 'Memory', 'Memoria'),
};

export const SQUARE_CELL_MEANINGS: Record<number, Record<CellStrength, I18nText>> = {
  1: {
    absent:      t('Характер мягкий, гибкий, восприимчивый.', 'Soft, pliant, receptive character.', 'Carácter suave y receptivo.'),
    weak:        t('Доброжелательный, не любите конфликтов.', 'Friendly, dislike conflict.', 'Amable, evitas el conflicto.'),
    medium:      t('Уравновешенный характер с нотой настойчивости.', 'Balanced character with quiet persistence.', 'Carácter equilibrado.'),
    strong:      t('Сильный характер, лидерские задатки.', 'Strong character, natural leader.', 'Carácter fuerte y líder.'),
    very_strong: t('Очень волевой характер, риск авторитарности.', 'Very willful, risk of authoritarianism.', 'Voluntad fuerte, cuidado con autoritarismo.'),
  },
  2: {
    absent:      t('Энергии мало — берегите силы и заряжайтесь природой.', 'Low energy — guard your strength and recharge in nature.', 'Energía baja — recárgate.'),
    weak:        t('Чувствительная энергия, важно избегать токсичной среды.', 'Sensitive energy, avoid toxic environments.', 'Energía sensible.'),
    medium:      t('Достаточно жизненной силы для своих задач.', 'Enough vital force for your tasks.', 'Suficiente fuerza vital.'),
    strong:      t('Высокая энергия, способность вдохновлять других.', 'High energy, ability to inspire.', 'Alta energía e inspiración.'),
    very_strong: t('Огромная энергия, важно её правильно направлять.', 'Enormous energy — direct it well.', 'Enorme energía a canalizar.'),
  },
  3: {
    absent:      t('Интересы переменчивы — пробуйте, ищите своё.', 'Interests shift — keep exploring to find your own.', 'Intereses cambiantes.'),
    weak:        t('Точечный интерес к избранным темам.', 'Focused interest in select topics.', 'Interés selectivo.'),
    medium:      t('Здоровое любопытство и интерес к миру.', 'Healthy curiosity about the world.', 'Curiosidad sana.'),
    strong:      t('Глубокий познавательный интерес — талант учёного.', 'Deep cognitive interest — scholar’s gift.', 'Interés profundo, dote académica.'),
    very_strong: t('Слишком много интересов — учитесь концентрации.', 'Too many interests — practice focus.', 'Demasiados intereses, enfoca.'),
  },
  4: {
    absent:      t('Уделите внимание здоровью и режиму.', 'Pay attention to health and routine.', 'Cuida la salud y rutinas.'),
    weak:        t('Здоровье требует регулярной заботы.', 'Health needs regular care.', 'La salud necesita cuidado.'),
    medium:      t('Хорошее здоровье при здоровом образе жизни.', 'Good health with healthy living.', 'Buena salud.'),
    strong:      t('Крепкое здоровье и выносливость.', 'Strong health and stamina.', 'Salud fuerte.'),
    very_strong: t('Атлетическое здоровье — берегите от перегрузок.', 'Athletic health — avoid overload.', 'Salud atlética.'),
  },
  5: {
    absent:      t('Логика интуитивна — доверяйте чувствам.', 'Intuitive logic — trust feelings.', 'Lógica intuitiva.'),
    weak:        t('Аналитика по необходимости, чувства первичны.', 'Analysis when needed, feelings come first.', 'Análisis ocasional.'),
    medium:      t('Хороший баланс логики и интуиции.', 'Good balance of logic and intuition.', 'Equilibrio lógica-intuición.'),
    strong:      t('Острый аналитический ум.', 'Sharp analytical mind.', 'Mente analítica aguda.'),
    very_strong: t('Очень сильная логика, риск сухости.', 'Very strong logic, risk of dryness.', 'Lógica muy fuerte.'),
  },
  6: {
    absent:      t('Труд по вдохновению, не по принуждению.', 'Work by inspiration, not force.', 'Trabajo por inspiración.'),
    weak:        t('Тонкий вкус к делу, нелюбовь к рутине.', 'Refined taste for work, dislike of routine.', 'Gusto fino, evita rutina.'),
    medium:      t('Стабильное отношение к труду.', 'Steady relationship with work.', 'Relación estable con el trabajo.'),
    strong:      t('Трудолюбие и мастерство — золотые руки.', 'Diligence and craft — golden hands.', 'Diligencia y maestría.'),
    very_strong: t('Трудоголизм — учитесь отдыхать.', 'Workaholism — learn to rest.', 'Adicción al trabajo.'),
  },
  7: {
    absent:      t('Удачу нужно создавать действиями.', 'Luck must be created by action.', 'La suerte se crea actuando.'),
    weak:        t('Удача приходит через усилие.', 'Luck comes through effort.', 'Suerte por esfuerzo.'),
    medium:      t('Везучи в важных моментах.', 'Lucky at key moments.', 'Suerte en momentos clave.'),
    strong:      t('Удача — ваш постоянный спутник.', 'Luck is your steady companion.', 'Suerte constante.'),
    very_strong: t('Особый дар удачи — благословение пути.', 'Special gift of luck — a blessing on the path.', 'Don especial de suerte.'),
  },
  8: {
    absent:      t('Чувство долга формируется через опыт.', 'Sense of duty forms through experience.', 'Sentido del deber por experiencia.'),
    weak:        t('Долг исполняете по любви, а не по обязанности.', 'You honor duty from love, not obligation.', 'Deber por amor.'),
    medium:      t('Здоровое чувство ответственности.', 'Healthy sense of responsibility.', 'Responsabilidad sana.'),
    strong:      t('Высокое чувство долга и заботы о близких.', 'Strong sense of duty and care for kin.', 'Alto sentido del deber.'),
    very_strong: t('Сверхответственность — учитесь делегировать.', 'Hyper-responsibility — learn to delegate.', 'Hiper-responsabilidad.'),
  },
  9: {
    absent:      t('Память избирательна — записывайте важное.', 'Selective memory — write down what matters.', 'Memoria selectiva.'),
    weak:        t('Эмоциональная память сильнее фактической.', 'Emotional memory stronger than factual.', 'Memoria emocional fuerte.'),
    medium:      t('Хорошая память, особенно на образы.', 'Good memory, especially for images.', 'Buena memoria visual.'),
    strong:      t('Острая память — талант синтеза знаний.', 'Sharp memory — talent for synthesis.', 'Memoria aguda.'),
    very_strong: t('Феноменальная память — дар учёного.', 'Phenomenal memory — scholar’s gift.', 'Memoria fenomenal.'),
  },
};

/** Convenience getter with safe defaults. */
export function getNumberMeaning(n: number): NumberMeaning {
  return NUMBER_MEANINGS[n] ?? NUMBER_MEANINGS[1];
}

export function pickI18n(text: I18nText, lang: Lang): string {
  return text[lang] ?? text.en ?? text.ru;
}

export function pickI18nList(list: I18nList, lang: Lang): string[] {
  return list[lang] ?? list.en ?? list.ru;
}