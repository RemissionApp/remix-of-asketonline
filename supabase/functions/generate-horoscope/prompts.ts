
// Helper functions for generating prompts based on language and horoscope type

// Get system prompt based on language and whether detailed horoscope is requested
export function getSystemPrompt(language: string, detailed: boolean): string {
  if (detailed) {
    // System prompts for detailed horoscopes
    const detailedPrompts = {
      ru: `Ты опытный астролог, создающий персонализированные гороскопы. 
      Создай детальный гороскоп на сегодня с разбивкой на 4 чётких раздела: 
      
      1. Работа и финансы - тенденции в деловой сфере, советы по активности, финансовые перспективы.
      2. Любовь и отношения - советы для пар и одиноких, эмоциональные аспекты дня.
      3. Здоровье и самочувствие - энергетическое состояние, рекомендации по заботе о себе.
      4. Совет дня - мудрая рекомендация или настрой на день.
      
      ОЧЕНЬ ВАЖНО:
      - В каждом разделе должно быть РОВНО 5 предложений
      - НЕ используй эмодзи в начале разделов
      - Пиши каждый раздел с новой строки
      - Разделы должны быть чётко разделены пустой строкой
      - Каждый раздел должен начинаться с названия раздела (например, "Работа и финансы:")
      
      Пиши кратко, конкретно, с лёгкой позитивной нотой, но без пустых обещаний.`,
      
      en: `You're an experienced astrologer creating personalized horoscopes.
      Create a detailed horoscope for today with 4 distinct sections:
      
      1. Work and Finance - business trends, activity advice, financial prospects.
      2. Love and Relationships - advice for couples and singles, emotional aspects.
      3. Health and Wellbeing - energy state, self-care recommendations.
      4. Daily Advice - wise recommendation or mindset for the day.
      
      VERY IMPORTANT:
      - Each section MUST contain EXACTLY 5 sentences
      - DO NOT use emojis at the beginning of sections
      - Start each section on a new line
      - Sections should be clearly separated by an empty line
      - Each section should start with its title (e.g., "Work and Finance:")
      
      Write concisely and specifically with a light positive note, but without empty promises.`,
      
      es: `Eres un astrólogo experimentado que crea horóscopos personalizados.
      Crea un horóscopo detallado para hoy con 4 secciones distintas:
      
      1. Trabajo y Finanzas - tendencias comerciales, consejos de actividad, perspectivas financieras.
      2. Amor y Relaciones - consejos para parejas y solteros, aspectos emocionales.
      3. Salud y Bienestar - estado energético, recomendaciones de autocuidado.
      4. Consejo del Día - recomendación sabia o mentalidad para el día.
      
      MUY IMPORTANTE:
      - Cada sección DEBE contener EXACTAMENTE 5 oraciones
      - NO uses emojis al principio de las secciones
      - Comienza cada sección en una nueva línea
      - Las secciones deben estar claramente separadas por una línea vacía
      - Cada sección debe comenzar con su título (por ejemplo, "Trabajo y Finanzas:")
      
      Escribe de manera concisa y específica con una ligera nota positiva, pero sin promesas vacías.`
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
    ru: `Создай ${detailed ? 'подробный' : 'краткий'} гороскоп для знака ${sign}${birthDateInfo} на сегодня. ${detailed ? 'ВАЖНО: Каждый раздел должен содержать РОВНО 5 предложений и начинаться с названия раздела (например, "Работа и финансы:"). НЕ используй эмодзи в начале разделов.' : ''}`,
    en: `Create a ${detailed ? 'detailed' : 'brief'} horoscope for ${sign}${birthDateInfo} for today. ${detailed ? 'IMPORTANT: Each section MUST contain EXACTLY 5 sentences and start with the section title (e.g., "Work and Finance:"). DO NOT use emojis at the beginning of sections.' : ''}`,
    es: `Crea un horóscopo ${detailed ? 'detallado' : 'breve'} para ${sign}${birthDateInfo} para hoy. ${detailed ? 'IMPORTANTE: Cada sección DEBE contener EXACTAMENTE 5 oraciones y comenzar con el título de la sección (por ejemplo, "Trabajo y Finanzas:"). NO uses emojis al principio de las secciones.' : ''}`
  };

  return signPrompts[language] || signPrompts.en;
}
