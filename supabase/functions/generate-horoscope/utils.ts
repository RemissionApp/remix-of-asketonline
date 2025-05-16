
// Helper functions for processing horoscopes

// Extract specific section from the horoscope text
export function extractSections(text: string, ru1: string, ru2: string, en1: string, en2: string, sectionType: string): string {
  // Log the input text for debugging
  console.log(`Extracting ${sectionType} section, text length: ${text.length}`);
  
  // Try to find the section using various patterns
  const patterns = [
    // Try to match by section titles in different languages
    new RegExp(`(?:^|\\n)(?:${ru1}|${en1})[^\\n]*:(?:\\n|.)*?(?=\\n\\n(?:${ru1}|${ru2}|${en1}|${en2})|$)`, 'i'),
    new RegExp(`(?:^|\\n)(?:${ru2}|${en2})[^\\n]*:(?:\\n|.)*?(?=\\n\\n(?:${ru1}|${ru2}|${en1}|${en2})|$)`, 'i'),
    
    // More generic patterns as fallback
    new RegExp(`(?:^|\\n)[^\\n]*${ru1}[^\\n]*:(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`(?:^|\\n)[^\\n]*${ru2}[^\\n]*:(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`(?:^|\\n)[^\\n]*${en1}[^\\n]*:(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`(?:^|\\n)[^\\n]*${en2}[^\\n]*:(?:\\n|.)*?(?=\\n\\n|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      console.log(`Found match for section ${sectionType}`);
      console.log(`Match result: ${match[0].substring(0, 50)}...`);
      return match[0].trim();
    }
  }
  
  console.log(`No match found for section ${sectionType}, using fallback`);
  
  // If no match found, create a default response based on section type
  if (sectionType === "work_finance") {
    return `Работа и финансы: Сегодня благоприятный день для профессиональных начинаний. Ваша продуктивность будет высокой, если вы сосредоточитесь на приоритетных задачах. Возможны новые деловые предложения или финансовые поступления. Избегайте рискованных инвестиций и необдуманных трат. Доверяйте своей интуиции в деловых решениях.`;
  } else if (sectionType === "love_relationships") {
    return `Любовь и отношения: В личной жизни возможны приятные сюрпризы. Открытое общение поможет укрепить существующие отношения. Если вы одиноки, сегодня подходящий день для новых знакомств. Проявите внимание к близким людям и не держите обиды. Звезды советуют больше доверять партнеру.`;
  } else if (sectionType === "health_wellbeing") {
    return `Здоровье и самочувствие: Уделите внимание своему физическому и эмоциональному здоровью. Небольшая прогулка на свежем воздухе поможет восстановить силы. Сегодня хороший день для начала новой программы упражнений. Следите за питанием и избегайте переутомления. Медитация поможет снять стресс и восстановить энергетический баланс.`;
  } else if (sectionType === "daily_advice") {
    return `Совет дня: Слушайте свою интуицию, она укажет верное направление. Не торопитесь с принятием важных решений, но и не откладывайте их на неопределенный срок. Сегодня подходящий день для планирования будущих проектов. Обратите внимание на знаки, которые посылает вам Вселенная. Помните, что каждое действие имеет последствия.`;
  }
  
  return `Информация временно недоступна. Пожалуйста, попробуйте обновить страницу или повторите попытку позже.`;
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
