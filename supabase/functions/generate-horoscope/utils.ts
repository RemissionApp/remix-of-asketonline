// Helper functions for processing horoscopes

// Extract specific section from the horoscope text
export function extractSections(text: string, sectionType: string): string {
  // Log the input text for debugging
  console.log(`Extracting ${sectionType} section, text length: ${text.length}`);
  console.log(`First 100 chars of text: ${text.substring(0, 100)}`);
  console.log(`Last 100 chars of text: ${text.substring(text.length - 100)}`);
  
  // Заголовки разделов, которые могут встречаться в ответах
  const sectionHeaders = {
    general_atmosphere: [
      'Общая атмосфера дня',
      'General Day Atmosphere',
      'Атмосфера дня',
      'Общая атмосфера'
    ],
    work_finance: [
      'Советы по работе и финансам',
      'Work & Finance Advice',
      'Работа и финансы',
      'Финансы и работа'
    ],
    love_relationships: [
      'Рекомендации по отношениям и любви',
      'Love & Relationship Recommendations',
      'Любовь и отношения',
      'Отношения'
    ],
    health_wellbeing: [
      'Состояние здоровья и эмоционального баланса',
      'Health & Emotional Balance',
      'Здоровье и самочувствие',
      'Эмоциональный баланс'
    ],
    daily_advice: [
      'Практичный совет дня',
      'Practical Daily Advice',
      'Совет дня',
      'Практический совет'
    ]
  };
  
  const headers = sectionHeaders[sectionType] || [];
  
  // Пытаемся найти раздел, используя все возможные варианты заголовков
  for (const header of headers) {
    console.log(`Trying to find section with header: "${header}"`);
    
    // Более простой и надежный подход - ищем заголовок и берем текст до следующего заголовка
    // или до конца текста
    const headerIndex = text.indexOf(header);
    if (headerIndex !== -1) {
      console.log(`Found header "${header}" at position ${headerIndex}`);
      
      // Получаем текст после заголовка
      let startIndex = headerIndex + header.length;
      
      // Пропускаем двоеточие и пробелы если они есть
      if (text[startIndex] === ':') {
        startIndex++;
      }
      while (text[startIndex] === ' ' || text[startIndex] === '\n') {
        startIndex++;
      }
      
      // Ищем следующий заголовок из всех возможных
      let endIndex = text.length;
      
      // Создаем массив всех возможных заголовков из всех секций
      const allHeaders = [
        ...sectionHeaders.general_atmosphere,
        ...sectionHeaders.work_finance,
        ...sectionHeaders.love_relationships,
        ...sectionHeaders.health_wellbeing,
        ...sectionHeaders.daily_advice
      ].filter(h => h !== header); // исключаем текущий заголовок
      
      // Ищем следующий заголовок
      for (const nextHeader of allHeaders) {
        const nextHeaderIndex = text.indexOf(nextHeader, startIndex);
        if (nextHeaderIndex !== -1 && nextHeaderIndex < endIndex) {
          endIndex = nextHeaderIndex;
        }
      }
      
      // Извлекаем содержимое раздела
      const sectionContent = text.substring(startIndex, endIndex).trim();
      console.log(`Extracted section content: "${sectionContent.substring(0, 50)}..."`);
      
      if (sectionContent) {
        return sectionContent;
      }
    }
  }
  
  console.log(`NO MATCH found for section ${sectionType}, trying fallback regex approach`);
  
  // Если предыдущий подход не сработал, пробуем регулярные выражения
  const sectionPatterns = {
    general_atmosphere: [
      /Общая атмосфера дня[:\s]*([^]*?)(?=\n\s*\n|$)/i,
      /General Day Atmosphere[:\s]*([^]*?)(?=\n\s*\n|$)/i,
    ],
    work_finance: [
      /Советы по работе и финансам[:\s]*([^]*?)(?=\n\s*\n|$)/i,
      /Work & Finance[:\s]*([^]*?)(?=\n\s*\n|$)/i,
    ],
    love_relationships: [
      /Рекомендации по отношениям и любви[:\s]*([^]*?)(?=\n\s*\n|$)/i,
      /Love & Relationship[:\s]*([^]*?)(?=\n\s*\n|$)/i,
    ],
    health_wellbeing: [
      /Состояние здоровья и эмоционального баланса[:\s]*([^]*?)(?=\n\s*\n|$)/i,
      /Health & Emotional[:\s]*([^]*?)(?=\n\s*\n|$)/i,
    ],
    daily_advice: [
      /Практичный совет дня[:\s]*([^]*?)(?=\n\s*\n|$)/i,
      /Practical Daily Advice[:\s]*([^]*?)(?=\n\s*\n|$)/i,
    ]
  };
  
  const patterns = sectionPatterns[sectionType] || [];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      console.log(`REGEX MATCH FOUND for section ${sectionType}`);
      const content = match[1].trim();
      return content;
    }
  }
  
  console.log(`NO MATCH found for section ${sectionType} with any method, using fallback`);
  
  // Создаем секцию с дефолтным текстом и информацией о проблеме для отладки
  const debugSection = `[Не удалось извлечь содержимое секции "${sectionType}". 
  
  Для отладки:
  1. Полученный формат текста не соответствует ожидаемому. 
  2. Убедитесь, что каждая секция начинается с правильного заголовка. 
  3. Между секциями должна быть пустая строка.]`;
  
  // Дефолтный контент для разных секций
  const fallbackResponses = {
    general_atmosphere: debugSection || 'Сегодня день будет наполнен возможностями для личностного роста и самопознания. Влияние планет способствует ясности мышления и принятию взвешенных решений. Внешние обстоятельства будут складываться в вашу пользу, особенно в первой половине дня. Вечером возможен небольшой эмоциональный спад, который легко преодолеть с помощью любимого хобби. Постарайтесь быть открытыми к новому опыту и идеям, которые могут неожиданно появиться.',
    work_finance: debugSection || 'Сегодня благоприятный день для профессиональных начинаний и деловых переговоров. Ваша продуктивность будет высокой, если вы сосредоточитесь на приоритетных задачах и не станете распылять внимание. Возможны новые деловые предложения или финансовые поступления, которые стоит внимательно рассмотреть. Избегайте рискованных инвестиций и необдуманных трат, особенно во второй половине дня. Доверяйте своей интуиции в финансовых вопросах, она сегодня особенно остра.',
    love_relationships: debugSection || 'В личной жизни сегодня наступает период гармонии и взаимопонимания с близкими людьми. Открытое и честное общение поможет укрепить существующие отношения и разрешить любые недопонимания. Если вы одиноки, то велика вероятность интересного знакомства, которое может перерасти в нечто большее. Проявите внимание и заботу к партнеру, даже небольшой знак внимания будет высоко оценен. Избегайте чрезмерного контроля и давления, позвольте отношениям развиваться естественно.',
    health_wellbeing: debugSection || 'Сегодня стоит уделить особое внимание своему физическому и эмоциональному здоровью. Небольшая прогулка на свежем воздухе или легкая физическая активность поможет восстановить энергетический баланс. Избегайте стрессовых ситуаций и конфликтов, они могут негативно сказаться на вашем самочувствии. Хорошее время для начала новой программы оздоровления или изменения режима питания. Вечером уделите время медитации или другим практикам расслабления, это поможет снять накопившееся напряжение.',
    daily_advice: debugSection || 'Разбейте большие цели на маленькие, выполнимые задачи и отмечайте каждое достижение. Это поможет поддерживать мотивацию и видеть свой прогресс. Не бойтесь просить помощи, когда она вам действительно нужна - это признак силы, а не слабости. Развивайте гибкость мышления и готовность адаптироваться к меняющимся обстоятельствам. Помните, что иногда лучший выход - это сделать перерыв и вернуться к проблеме со свежим взглядом. Практикуйте благодарность за то, что уже есть в вашей жизни, это привлечет еще больше позитивных изменений.'
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
