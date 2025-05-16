
// Helper functions for processing horoscopes

// Extract specific section from the horoscope text
export function extractSections(text: string, ru1: string, ru2: string, en1: string, en2: string, emoji: string): string {
  // Log the input text for debugging
  console.log(`Extracting section for ${emoji} ${ru1}/${en1}, text length: ${text.length}`);
  
  // Try to find the section using various patterns, starting with emoji which is most reliable
  const patterns = [
    // First try to find sections by emoji, which is most reliable
    new RegExp(`${emoji}[^\\n]*(?:\\n|.)*?(?=\\n\\n\\n|\\n\\n${emoji}|$)`, 'i'),
    new RegExp(`${emoji}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    
    // Then try other patterns if emoji matching fails
    new RegExp(`[^\\n]*${ru1}[^\\n]*(?:\\n|.)*?(?=\\n\\n\\n|\\n\\n[\\p{Emoji}]|$)`, 'iu'),
    new RegExp(`[^\\n]*${ru2}[^\\n]*(?:\\n|.)*?(?=\\n\\n\\n|\\n\\n[\\p{Emoji}]|$)`, 'iu'),
    new RegExp(`[^\\n]*${en1}[^\\n]*(?:\\n|.)*?(?=\\n\\n\\n|\\n\\n[\\p{Emoji}]|$)`, 'iu'),
    new RegExp(`[^\\n]*${en2}[^\\n]*(?:\\n|.)*?(?=\\n\\n\\n|\\n\\n[\\p{Emoji}]|$)`, 'iu'),
    
    // Finally fallback to basic section extraction
    new RegExp(`[^\\n]*${ru1}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`[^\\n]*${ru2}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`[^\\n]*${en1}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`[^\\n]*${en2}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      console.log(`Found match with pattern: ${pattern.source}`);
      console.log(`Match result: ${match[0].substring(0, 50)}...`);
      return match[0].trim();
    }
  }
  
  console.log(`No match found for section ${emoji} ${ru1}/${en1}, using fallback`);
  
  // If no match found, create a default response based on section indicators
  if (ru1 === "работа" || en1 === "work") {
    return `${emoji} Сегодня благоприятный день для профессиональных начинаний. Ваша продуктивность будет высокой, если вы сосредоточитесь на приоритетных задачах. Возможны новые деловые предложения или финансовые поступления.`;
  } else if (ru1 === "любовь" || en1 === "love") {
    return `${emoji} В личной жизни возможны приятные сюрпризы. Открытое общение поможет укрепить существующие отношения. Если вы одиноки, сегодня подходящий день для новых знакомств.`;
  } else if (ru1 === "здоровье" || en1 === "health") {
    return `${emoji} Уделите внимание своему физическому и эмоциональному здоровью. Небольшая прогулка на свежем воздухе поможет восстановить силы. Сегодня хороший день для начала новой программы упражнений.`;
  } else if (ru1 === "совет" || en1 === "advice") {
    return `${emoji} Слушайте свою интуицию, она укажет верное направление. Не торопитесь с принятием важных решений, но и не откладывайте их на неопределенный срок.`;
  }
  
  return `${emoji} Информация временно недоступна.`;
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
