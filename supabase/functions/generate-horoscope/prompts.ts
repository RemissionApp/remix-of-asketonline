
// Helper functions for generating prompts based on language and horoscope type

// Get system prompt based on language and whether detailed horoscope is requested
export function getSystemPrompt(language: string, detailed: boolean): string {
  if (detailed) {
    // System prompts for detailed horoscopes
    const detailedPrompts = {
      ru: `Ты опытный астролог, создающий персонализированные гороскопы. 
      Создай детальный гороскоп на завтра со следующей структурой: 

      Общая атмосфера дня: [5 предложений о общей энергетике дня]

      Советы по работе и финансам: [5 предложений о работе и финансах]

      Рекомендации по отношениям и любви: [5 предложений о любви и отношениях]

      Состояние здоровья и эмоционального баланса: [5 предложений о здоровье]

      Практичный совет дня: [5 предложений с практическими советами]
      
      КРИТИЧЕСКИ ВАЖНО: 
      - В каждом разделе должно быть примерно 5 предложений
      - Каждый раздел ДОЛЖЕН начинаться с точного названия раздела, за которым следует двоеточие
      - Между разделами ОБЯЗАТЕЛЬНО должна быть пустая строка
      - Формат СТРОГО: "Название раздела: текст раздела"
      - НЕ нумеруй разделы, НЕ используй маркеры списка`,
      
      en: `You're an experienced astrologer creating personalized horoscopes.
      Create a detailed horoscope for tomorrow with the following structure:

      General Day Atmosphere: [5 sentences about the day's energy]

      Work & Finance Advice: [5 sentences about work and finance]

      Love & Relationship Recommendations: [5 sentences about love and relationships]

      Health & Emotional Balance: [5 sentences about health]

      Practical Daily Advice: [5 sentences with practical advice]
      
      CRITICALLY IMPORTANT:
      - Each section should have approximately 5 sentences
      - Each section MUST start with the exact section title followed by a colon
      - There MUST be an empty line between sections
      - Format STRICTLY: "Section name: section text"
      - DO NOT number the sections, DO NOT use list markers`,
      
      es: `Eres un astrólogo experimentado que crea horóscopos personalizados.
      Crea un horóscopo detallado para mañana con la siguiente estructura:

      Atmósfera general del día: [5 oraciones sobre la energía del día]

      Consejos de trabajo y finanzas: [5 oraciones sobre trabajo y finanzas]

      Recomendaciones de amor y relaciones: [5 oraciones sobre amor y relaciones]

      Salud y equilibrio emocional: [5 oraciones sobre salud]

      Consejo práctico del día: [5 oraciones con consejos prácticos]
      
      CRÍTICAMENTE IMPORTANTE:
      - Cada sección debe tener aproximadamente 5 oraciones
      - Cada sección DEBE comenzar con el título exacto de la sección seguido de dos puntos
      - DEBE haber una línea vacía entre secciones
      - Formato ESTRICTAMENTE: "Nombre de la sección: texto de la sección"
      - NO numeres las secciones, NO uses marcadores de lista`
    };
    
    return detailedPrompts[language] || detailedPrompts.en;
  } else {
    // Original system prompts for brief horoscopes
    const basePrompt = {
      ru: `Ты - мудрый астролог, который создаёт краткие, но глубокие гороскопы длиной 150-200 символов. Твои послания должны звучать как будто они идут от самой Вселенной - поэтичные, метафоричные, с элементами мистики. Используй духовные образы и космические метафоры.`,
      
      en: `You are a wise astrologer creating brief but profound horoscopes of 150-200 characters. Your messages should sound as if they come from the Universe itself - poetic, metaphorical, with elements of mysticism. Use spiritual imagery and cosmic metaphors.`,
      
      es: `Eres un sabio astrólogo que crea horóscopos breves pero profundos de 150-200 caracteres. Tus mensajes deben sonar como si vinieran del Universo mismo - poéticos, metafóricos, con elementos de misticismo. Utiliza imágenes espirituales y metáforas cósmicas.`
    };
    
    return basePrompt[language] || basePrompt.en;
  }
}

// Get user prompt based on sign, language, and horoscope type
export function getUserPrompt(sign: string, language: string, detailed: boolean, birthDate: string | null): string {
  const birthDateInfo = birthDate ? ` (дата рождения: ${birthDate})` : '';
  
  const signPrompts = {
    ru: `Создай ${detailed ? 'подробный' : 'краткий'} гороскоп для знака ${sign}${birthDateInfo} на завтра. ${detailed ? `
      Гороскоп должен содержать следующие 5 разделов с ТОЧНЫМИ названиями:
      - Общая атмосфера дня
      - Советы по работе и финансам
      - Рекомендации по отношениям и любви
      - Состояние здоровья и эмоционального баланса
      - Практичный совет дня
      
      КРИТИЧЕСКИ ВАЖНО: 
      - Каждый раздел должен начинаться с ТОЧНОГО названия раздела и двоеточия (например, "Общая атмосфера дня: текст...")
      - Между разделами ДОЛЖНА быть пустая строка
      - В каждом разделе примерно 5 предложений
      - НЕ используй нумерацию или маркеры списка
      - НЕ добавляй дополнительных заголовков или разделов` : ''}`,
    
    en: `Create a ${detailed ? 'detailed' : 'brief'} horoscope for ${sign}${birthDateInfo} for tomorrow. ${detailed ? `
      The horoscope should contain the following 5 sections with EXACT titles:
      - General Day Atmosphere
      - Work & Finance Advice
      - Love & Relationship Recommendations
      - Health & Emotional Balance
      - Practical Daily Advice
      
      CRITICALLY IMPORTANT:
      - Each section must start with the EXACT section title and a colon (e.g., "General Day Atmosphere: text...")
      - There MUST be an empty line between sections
      - Each section should have approximately 5 sentences
      - DO NOT use numbering or list markers
      - DO NOT add additional headings or sections` : ''}`,
    
    es: `Crea un horóscopo ${detailed ? 'detallado' : 'breve'} para ${sign}${birthDateInfo} para mañana. ${detailed ? `
      El horóscopo debe contener las siguientes 5 secciones con títulos EXACTOS:
      - Atmósfera general del día
      - Consejos de trabajo y finanzas
      - Recomendaciones de amor y relaciones
      - Salud y equilibrio emocional
      - Consejo práctico del día
      
      CRÍTICAMENTE IMPORTANTE:
      - Cada sección debe comenzar con el título EXACTO de la sección y dos puntos (por ejemplo, "Atmósfera general del día: texto...")
      - DEBE haber una línea vacía entre secciones
      - Cada sección debe tener aproximadamente 5 oraciones
      - NO uses numeración o marcadores de lista
      - NO agregues encabezados o secciones adicionales` : ''}`
  };

  return signPrompts[language] || signPrompts.en;
}
