
// Helper functions for processing horoscopes

// Extract specific section from the horoscope text
export function extractSections(text: string, sectionType: string): string {
  // Log the input text for debugging
  console.log(`Extracting ${sectionType} section, text length: ${text.length}`);
  
  // Улучшаем регулярные выражения для более точного поиска секций
  const sectionPatterns = {
    general_atmosphere: [
      /(?:^|\n)(?:Общая атмосфера дня|General Day Atmosphere|Общая атмосфера|general atmosphere)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
      /(?:^|\n)(?:атмосфера дня|day atmosphere)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
    ],
    work_finance: [
      /(?:^|\n)(?:Советы по работе и финансам|Work & Finance|работа|work|финансы|finance)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
      /(?:^|\n)(?:работа и финансы|work and finance)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
    ],
    love_relationships: [
      /(?:^|\n)(?:Рекомендации по отношениям и любви|Love & Relationship|любовь|love|отношения|relationships)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
      /(?:^|\n)(?:любовь и отношения|love and relationships)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
    ],
    health_wellbeing: [
      /(?:^|\n)(?:Состояние здоровья и эмоционального баланса|Health & Emotional|здоровье|health|самочувствие|wellbeing)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
      /(?:^|\n)(?:здоровье и самочувствие|health and wellbeing)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
      /(?:^|\n)(?:эмоциональный баланс|emotional balance)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
    ],
    daily_advice: [
      /(?:^|\n)(?:Практичный совет дня|Daily Advice|совет|advice)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
      /(?:^|\n)(?:практичный совет|practical advice)[^:]*:(?:\n|.)*?(?=\n\n|\n(?:[А-Я]|[A-Z])|$)/i,
    ]
  };
  
  const patterns = sectionPatterns[sectionType] || [];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      console.log(`Found match for section ${sectionType}`);
      console.log(`Match result: ${match[0].substring(0, 50)}...`);
      // Удаляем заголовок секции из ответа
      const content = match[0].replace(/^.*?:\s*/s, '').trim();
      return content;
    }
  }
  
  console.log(`No match found for section ${sectionType}, using fallback`);
  
  // If no match found, create a default response based on section type
  const fallbackResponses = {
    general_atmosphere: 'Сегодня день будет наполнен возможностями для личностного роста и самопознания. Влияние планет способствует ясности мышления и принятию взвешенных решений. Внешние обстоятельства будут складываться в вашу пользу, особенно в первой половине дня. Вечером возможен небольшой эмоциональный спад, который легко преодолеть с помощью любимого хобби. Постарайтесь быть открытыми к новому опыту и идеям, которые могут неожиданно появиться.',
    work_finance: 'Сегодня благоприятный день для профессиональных начинаний и деловых переговоров. Ваша продуктивность будет высокой, если вы сосредоточитесь на приоритетных задачах и не станете распылять внимание. Возможны новые деловые предложения или финансовые поступления, которые стоит внимательно рассмотреть. Избегайте рискованных инвестиций и необдуманных трат, особенно во второй половине дня. Доверяйте своей интуиции в финансовых вопросах, она сегодня особенно остра.',
    love_relationships: 'В личной жизни сегодня наступает период гармонии и взаимопонимания с близкими людьми. Открытое и честное общение поможет укрепить существующие отношения и разрешить любые недопонимания. Если вы одиноки, то велика вероятность интересного знакомства, которое может перерасти в нечто большее. Проявите внимание и заботу к партнеру, даже небольшой знак внимания будет высоко оценен. Избегайте чрезмерного контроля и давления, позвольте отношениям развиваться естественно.',
    health_wellbeing: 'Сегодня стоит уделить особое внимание своему физическому и эмоциональному здоровью. Небольшая прогулка на свежем воздухе или легкая физическая активность поможет восстановить энергетический баланс. Избегайте стрессовых ситуаций и конфликтов, они могут негативно сказаться на вашем самочувствии. Хорошее время для начала новой программы оздоровления или изменения режима питания. Вечером уделите время медитации или другим практикам расслабления, это поможет снять накопившееся напряжение.',
    daily_advice: 'Разбейте большие цели на маленькие, выполнимые задачи и отмечайте каждое достижение. Это поможет поддерживать мотивацию и видеть свой прогресс. Не бойтесь просить помощи, когда она вам действительно нужна - это признак силы, а не слабости. Развивайте гибкость мышления и готовность адаптироваться к меняющимся обстоятельствам. Помните, что иногда лучший выход - это сделать перерыв и вернуться к проблеме со свежим взглядом. Практикуйте благодарность за то, что уже есть в вашей жизни, это привлечет еще больше позитивных изменений.'
  };
  
  return fallbackResponses[sectionType] || 'Информация временно недоступна. Пожалуйста, попробуйте обновить страницу или повторите попытку позже.';
}

// Helper function to get random color based on language
export function getRandomColor(language: string): string {
  const colors = {
    ru: ['красный', 'синий', 'зеленый', 'фиолетовый', 'оранжевый', 'розовый', 'золотой', 'серебряный', 'бирюзовый', 'индиго'],
    en: ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'gold', 'silver', 'turquoise', 'indigo'],
    es: ['rojo', 'azul', 'verde', 'púrpura', 'naranja', 'rosa', 'oro', 'plata', 'turquesa', 'índigo']
  };
  
  const colorList = colors[language] || colors.en;
  return colorList[Math.floor(Math.random() * colorList.length)];
}

// Helper function to get random mood based on language
export function getRandomMood(language: string): string {
  const moods = {
    ru: ['радостный', 'задумчивый', 'спокойный', 'энергичный', 'вдохновленный', 'мечтательный', 'созерцательный', 'творческий'],
    en: ['joyful', 'thoughtful', 'peaceful', 'energetic', 'inspired', 'dreamy', 'contemplative', 'creative'],
    es: ['alegre', 'pensativo', 'tranquilo', 'enérgico', 'inspirado', 'soñador', 'contemplativo', 'creativo']
  };
  
  const moodList = moods[language] || moods.en;
  return moodList[Math.floor(Math.random() * moodList.length)];
}
