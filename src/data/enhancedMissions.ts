import { Mission } from '@/types';

// НОВЫЕ ИНТЕРАКТИВНЫЕ МИССИИ
export const enhancedMissions: Mission[] = [
  {
    id: 'synchronicity-hunter',
    title: 'Охотник за синхронностями',
    description: 'Исследуйте мистические совпадения в вашей жизни и научитесь читать знаки Вселенной',
    requirements: [
      'Ведите дневник синхронностей',
      'Анализируйте паттерны',
      'Создайте карту совпадений'
    ],
    reward: {
      energyPoints: 75,
      achievement: 'synchronicity-master'
    },
    completed: false,
    difficulty: 'explorer',
    category: 'mystical',
    duration: 7,
    type: 'multi-day',
    
    // Интерактивные элементы
    dailyQuestions: [
      {
        day: 1,
        question: 'Какие необычные совпадения вы заметили сегодня?',
        type: 'reflection',
        required: true
      },
      {
        day: 3,
        question: 'Оцените силу сегодняшних синхронностей от 1 до 10',
        type: 'scale',
        required: true
      },
      {
        day: 5,
        question: 'Сфотографируйте или опишите самое яркое совпадение',
        type: 'photo',
        required: false
      },
      {
        day: 7,
        question: 'Какие паттерны вы обнаружили за неделю наблюдений?',
        type: 'reflection',
        required: true
      }
    ],
    
    choiceEvents: [
      {
        id: 'sync-path-choice',
        day: 4,
        title: 'Путь исследования',
        description: 'Выберите, как вы будете развивать свои способности к замечанию синхронностей',
        choices: [
          {
            id: 'intuitive-path',
            text: 'Полагаться на интуицию и чувства',
            consequences: [
              { type: 'energy', value: 10 },
              { type: 'unlock', value: 'intuitive-insights' }
            ],
            energyModifier: 10
          },
          {
            id: 'analytical-path',
            text: 'Анализировать и записывать все детально',
            consequences: [
              { type: 'energy', value: 15 },
              { type: 'unlock', value: 'pattern-recognition' }
            ],
            energyModifier: 15
          }
        ]
      }
    ],
    
    milestoneRewards: [
      {
        day: 3,
        reward: {
          energyPoints: 20,
          mysticalInsight: {
            title: 'Первые знаки',
            content: 'Вы начинаете замечать тонкие связи между событиями...',
            category: 'synchronicity'
          }
        },
        celebrationMessage: 'Ваше восприятие обостряется! 🔮'
      },
      {
        day: 7,
        reward: {
          cosmicArtifact: {
            id: 'sync-crystal',
            name: 'Кристалл синхронности',
            description: 'Усиливает способность замечать знаки Вселенной',
            type: 'crystal',
            rarity: 'rare',
            effects: ['Увеличивает вероятность синхронностей', 'Повышает интуицию']
          }
        },
        celebrationMessage: 'Вы получили мистический артефакт! ✨'
      }
    ]
  },

  {
    id: 'energy-detox-21',
    title: 'Энергетический детокс',
    description: 'Комплексная трансформация энергетического поля через освобождение от токсичных привычек и практики очищения',
    requirements: [
      'Избавьтесь от энергетических вампиров',
      'Практикуйте очищающие техники',
      'Создайте новый энергетический режим'
    ],
    reward: {
      energyPoints: 150,
      achievement: 'energy-master'
    },
    completed: false,
    difficulty: 'master',
    category: 'challenge',
    duration: 21,
    type: 'multi-day',
    
    dailyQuestions: [
      {
        day: 1,
        question: 'Что больше всего истощает вашу энергию?',
        type: 'reflection',
        required: true
      },
      {
        day: 7,
        question: 'Оцените свой уровень энергии по сравнению с началом',
        type: 'scale',
        required: true
      },
      {
        day: 14,
        question: 'Какие новые практики принесли наибольшую пользу?',
        type: 'reflection',
        required: true
      },
      {
        day: 21,
        question: 'Сфотографируйте символ вашей обновленной энергии',
        type: 'photo',
        required: false
      }
    ],
    
    choiceEvents: [
      {
        id: 'detox-method',
        day: 3,
        title: 'Метод очищения',
        description: 'Выберите основной подход к энергетическому детоксу',
        choices: [
          {
            id: 'gentle-cleansing',
            text: 'Мягкое постепенное очищение',
            consequences: [
              { type: 'message', value: 'Путь гармонии выбран' }
            ],
            energyModifier: 5
          },
          {
            id: 'intensive-purge',
            text: 'Интенсивное кардинальное очищение',
            consequences: [
              { type: 'message', value: 'Путь радикальной трансформации' }
            ],
            energyModifier: 20
          }
        ]
      },
      {
        id: 'energy-source',
        day: 10,
        title: 'Источник силы',
        description: 'Определите, что будет вашим главным источником энергии',
        choices: [
          {
            id: 'nature-connection',
            text: 'Связь с природой и стихиями',
            consequences: [
              { type: 'unlock', value: 'nature-practices' }
            ]
          },
          {
            id: 'inner-fire',
            text: 'Внутренний огонь и самодисциплина',
            consequences: [
              { type: 'unlock', value: 'warrior-practices' }
            ]
          },
          {
            id: 'cosmic-flow',
            text: 'Поток космической энергии',
            consequences: [
              { type: 'unlock', value: 'cosmic-practices' }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'dream-explorer',
    title: 'Исследователь сновидений',
    description: 'Погрузитесь в мир осознанных сновидений и раскройте тайны вашего подсознания',
    requirements: [
      'Ведите подробный дневник снов',
      'Практикуйте техники осознанности',
      'Создайте карту сонного мира'
    ],
    reward: {
      energyPoints: 100,
      achievement: 'dream-walker'
    },
    completed: false,
    difficulty: 'master',
    category: 'mystical',
    duration: 14,
    type: 'multi-day',
    
    dailyQuestions: [
      {
        day: 1,
        question: 'Опишите самый яркий сон, который помните',
        type: 'reflection',
        required: true
      },
      {
        day: 5,
        question: 'Насколько ясно вы помните сны (1-10)?',
        type: 'scale',
        required: true
      },
      {
        day: 10,
        question: 'Были ли у вас осознанные сновидения?',
        type: 'reflection',
        required: true
      },
      {
        day: 14,
        question: 'Нарисуйте или опишите символ из ваших снов',
        type: 'photo',
        required: false
      }
    ],
    
    choiceEvents: [
      {
        id: 'dream-technique',
        day: 7,
        title: 'Техника осознанности',
        description: 'Выберите метод для развития осознанных сновидений',
        choices: [
          {
            id: 'reality-checks',
            text: 'Проверки реальности в течение дня',
            consequences: [
              { type: 'unlock', value: 'reality-check-practice' }
            ]
          },
          {
            id: 'wake-back-to-bed',
            text: 'Техника WBTB (проснуться и вернуться ко сну)',
            consequences: [
              { type: 'unlock', value: 'wbtb-practice' }
            ]
          },
          {
            id: 'mnemonic-induction',
            text: 'Мнемоническая индукция (MILD)',
            consequences: [
              { type: 'unlock', value: 'mild-practice' }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'gratitude-alchemist',
    title: 'Алхимик благодарности',
    description: 'Трансформируйте любые жизненные ситуации в источники благодарности и силы',
    requirements: [
      'Найдите благословения в трудностях',
      'Создайте ритуал благодарности',
      'Поделитесь благодарностью с миром'
    ],
    reward: {
      energyPoints: 80,
      achievement: 'gratitude-alchemist'
    },
    completed: false,
    difficulty: 'explorer',
    category: 'social',
    duration: 10,
    type: 'multi-day',
    
    dailyQuestions: [
      {
        day: 1,
        question: 'За что вы особенно благодарны сегодня?',
        type: 'reflection',
        required: true
      },
      {
        day: 5,
        question: 'Найдите скрытое благословение в недавней трудности',
        type: 'reflection',
        required: true
      },
      {
        day: 8,
        question: 'Кому вы выразили благодарность сегодня?',
        type: 'reflection',
        required: true
      },
      {
        day: 10,
        question: 'Сфотографируйте то, что символизирует вашу благодарность',
        type: 'photo',
        required: false
      }
    ],
    
    choiceEvents: [
      {
        id: 'gratitude-style',
        day: 3,
        title: 'Стиль благодарности',
        description: 'Как вы предпочитаете выражать благодарность?',
        choices: [
          {
            id: 'inner-gratitude',
            text: 'Внутренние медитации и размышления',
            consequences: [
              { type: 'unlock', value: 'meditation-practices' }
            ]
          },
          {
            id: 'creative-gratitude',
            text: 'Творческое выражение (письма, искусство)',
            consequences: [
              { type: 'unlock', value: 'creative-practices' }
            ]
          },
          {
            id: 'active-gratitude',
            text: 'Активные дела и помощь другим',
            consequences: [
              { type: 'unlock', value: 'service-practices' }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'time-alchemist',
    title: 'Алхимик времени',
    description: 'Измените своё восприятие времени и научитесь управлять его потоком',
    requirements: [
      'Исследуйте различные состояния времени',
      'Практикуйте техники расширения времени',
      'Создайте личный временной ритуал'
    ],
    reward: {
      energyPoints: 90,
      achievement: 'time-master'
    },
    completed: false,
    difficulty: 'master',
    category: 'challenge',
    duration: 14,
    type: 'multi-day',
    
    dailyQuestions: [
      {
        day: 1,
        question: 'Как вы ощущаете течение времени в разных ситуациях?',
        type: 'reflection',
        required: true
      },
      {
        day: 7,
        question: 'Оцените, насколько медленным было время сегодня (1-10)',
        type: 'scale',
        required: true
      },
      {
        day: 14,
        question: 'Опишите свой идеальный ритм жизни',
        type: 'reflection',
        required: true
      }
    ],
    
    choiceEvents: [
      {
        id: 'time-approach',
        day: 5,
        title: 'Подход ко времени',
        description: 'Выберите основную философию работы со временем',
        choices: [
          {
            id: 'flow-state',
            text: 'Погружение в состояние потока',
            consequences: [
              { type: 'unlock', value: 'flow-techniques' }
            ]
          },
          {
            id: 'mindful-presence',
            text: 'Осознанное присутствие в моменте',
            consequences: [
              { type: 'unlock', value: 'mindfulness-techniques' }
            ]
          },
          {
            id: 'time-expansion',
            text: 'Техники расширения времени',
            consequences: [
              { type: 'unlock', value: 'expansion-techniques' }
            ]
          }
        ]
      }
    ]
  }
];