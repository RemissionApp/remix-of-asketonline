
import { openAiModel, openAiTemperature } from "./config.ts";

interface FullHoroscopeData {
  personalityAnalysis: string;
  yearForecast: string;
  careerPath: string;
  relationshipForecast: string;
  healthGuidance: string;
  personalGrowth: string;
}

export async function generateFullHoroscope(
  zodiacSign: string,
  birthDate: string | null,
  userProfile: any,
  language: string = 'en'
): Promise<FullHoroscopeData> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  // Create prompts in the appropriate language
  const systemPrompt = getSystemPrompt(zodiacSign, birthDate, language);
  const userPrompt = getUserPrompt(zodiacSign, birthDate, language);

  console.log("System prompt:", systemPrompt);
  console.log("User prompt:", userPrompt);

  // Call OpenAI API to generate the full horoscope
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openAiModel,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: openAiTemperature,
      max_tokens: 4000 // Increased token limit for longer response
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error("OpenAI API error:", data.error);
    throw new Error(data.error.message || 'Error from OpenAI API');
  }

  const generatedText = data.choices[0].message.content;

  // Parse the generated text into sections
  const sections = parseHoroscopeSections(generatedText, language);
  console.log("Parsed sections:", Object.keys(sections));
  
  return sections;
}

// Get system prompt based on language
function getSystemPrompt(zodiacSign: string, birthDate: string | null, language: string): string {
  const basePrompt = `You are an expert astrologer with decades of experience in providing insightful, detailed horoscope readings.`;
  
  let prompt = '';
  switch (language) {
    case 'ru':
      prompt = `${basePrompt}
Создай подробный астрологический профиль для человека со знаком ${zodiacSign}${birthDate ? `, родившегося ${birthDate}` : ''}.
Твой анализ должен быть разделен на 6 четких разделов:

1. Анализ личности - Проанализируй основные черты характера, сильные и слабые стороны, уникальные особенности.
2. Прогноз на год - Предоставь прогноз на предстоящие 12 месяцев, выделяя значимые периоды и возможности.
3. Карьерный путь - Предложи рекомендации по оптимальным направлениям карьеры, сильным сторонам в работе и потенциальным областям роста.
4. Прогноз отношений - Дай рекомендации по романтическим отношениям, дружбе и семейной динамике.
5. Здоровье и самочувствие - Предоставь советы по поддержанию физического и психического благополучия.
6. Личностный рост - Предложи области для саморазвития и духовного роста.

Для каждого раздела напиши не менее 150 слов конкретного, персонализированного содержания.
Форматируй свой ответ с четкими заголовками разделов, например: "1. Анализ личности:", "2. Прогноз на год:", и т.д.
Избегай общих утверждений и банальностей. Используй космические метафоры и ссылки на положения планет, где это уместно.
Тон должен быть проницательным, мудрым и познавательным, но также доступным и практичным.
НЕ упоминай, что это контент, сгенерированный ИИ.`;
      break;
      
    case 'es':
      prompt = `${basePrompt}
Crea un perfil astrológico completo para una persona con signo ${zodiacSign}${birthDate ? ` nacida el ${birthDate}` : ''}.
Tu análisis debe estar dividido en 6 secciones claras:

1. Análisis de Personalidad - Analiza los rasgos de personalidad principales, fortalezas, debilidades y características únicas.
2. Pronóstico del Año - Proporciona un pronóstico para los próximos 12 meses, destacando períodos y oportunidades significativas.
3. Trayectoria Profesional - Ofrece información sobre direcciones profesionales óptimas, fortalezas en el lugar de trabajo y áreas potenciales de crecimiento.
4. Pronóstico de Relaciones - Brinda orientación sobre relaciones románticas, amistades y dinámicas familiares.
5. Salud y Bienestar - Proporciona consejos para mantener el bienestar físico y mental.
6. Crecimiento Personal - Sugiere áreas para el desarrollo personal y el crecimiento espiritual.

Para cada sección, escribe al menos 150 palabras de contenido específico y personalizado.
Formatea tu respuesta con encabezados de sección claros como "1. Análisis de Personalidad:", "2. Pronóstico del Año:", etc.
Evita declaraciones genéricas y lugares comunes. Utiliza metáforas cósmicas y referencias a posiciones planetarias cuando sea relevante.
El tono debe ser perspicaz, sabio y educativo, pero también accesible y práctico.
NO menciones que este es contenido generado por IA.`;
      break;
      
    default: // English
      prompt = `${basePrompt}
Create a comprehensive astrological profile for a ${zodiacSign} individual${birthDate ? ` born on ${birthDate}` : ''}.
Your analysis should be divided into 6 clear sections:

1. Personality Analysis - Analyze the core personality traits, strengths, weaknesses, and unique characteristics.
2. Year Ahead Forecast - Provide a forecast for the upcoming 12 months, highlighting significant periods and opportunities.
3. Career Path - Offer insights into optimal career directions, strengths in the workplace, and potential growth areas.
4. Relationship Forecast - Give guidance on romantic relationships, friendships, and family dynamics.
5. Health & Wellbeing - Provide advice on maintaining physical and mental wellbeing.
6. Personal Growth - Suggest areas for personal development and spiritual growth.

For each section, write at least 150 words of specific, personalized content.
Format your response with clear section headers like "1. Personality Analysis:", "2. Year Ahead Forecast:", etc.
Avoid generic statements and platitudes. Use cosmic metaphors and reference planetary positions where relevant.
The tone should be insightful, wise, and educational but also accessible and practical.
DO NOT mention that this is AI-generated content.`;
      break;
  }
  
  return prompt;
}

// Get user prompt based on language
function getUserPrompt(zodiacSign: string, birthDate: string | null, language: string): string {
  switch (language) {
    case 'ru':
      return `Создай полный астрологический профиль для ${zodiacSign}${birthDate ? `, родившегося ${birthDate}` : ''}.
Включи все шесть разделов: Анализ личности, Прогноз на год, Карьерный путь, Прогноз отношений, Здоровье и самочувствие, и Личностный рост.`;
      
    case 'es':
      return `Crea un perfil astrológico completo para ${zodiacSign}${birthDate ? ` nacido el ${birthDate}` : ''}.
Incluye las seis secciones: Análisis de Personalidad, Pronóstico del Año, Trayectoria Profesional, Pronóstico de Relaciones, Salud y Bienestar, y Crecimiento Personal.`;
      
    default: // English
      return `Please create a full astrological profile for a ${zodiacSign}${birthDate ? ` born on ${birthDate}` : ''}.
Include all six sections: Personality Analysis, Year Ahead Forecast, Career Path, Relationship Forecast, Health & Wellbeing, and Personal Growth.`;
  }
}

function parseHoroscopeSections(text: string, language: string): FullHoroscopeData {
  const sections: Partial<FullHoroscopeData> = {};
  
  // Try to extract sections using regular expressions based on language
  let personalityMatch, yearMatch, careerMatch, relationshipMatch, healthMatch, growthMatch;
  
  if (language === 'ru') {
    personalityMatch = text.match(/(?:Анализ личности:?|1\.\s*Анализ личности:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Прогноз на год|2\.\s*Прогноз))/s);
    yearMatch = text.match(/(?:Прогноз на год:?|2\.\s*Прогноз на год:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Карьерный путь|3\.\s*Карьерный))/s);
    careerMatch = text.match(/(?:Карьерный путь:?|3\.\s*Карьерный путь:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Прогноз отношений|4\.\s*Прогноз отношений))/s);
    relationshipMatch = text.match(/(?:Прогноз отношений:?|4\.\s*Прогноз отношений:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Здоровье|5\.\s*Здоровье))/s);
    healthMatch = text.match(/(?:Здоровье и самочувствие:?|5\.\s*Здоровье и самочувствие:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Личностный рост|6\.\s*Личностный))/s);
    growthMatch = text.match(/(?:Личностный рост:?|6\.\s*Личностный рост:?)(.*?)$/s);
  } else if (language === 'es') {
    personalityMatch = text.match(/(?:Análisis de Personalidad:?|1\.\s*Análisis de Personalidad:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Pronóstico del Año|2\.\s*Pronóstico))/s);
    yearMatch = text.match(/(?:Pronóstico del Año:?|2\.\s*Pronóstico del Año:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Trayectoria Profesional|3\.\s*Trayectoria))/s);
    careerMatch = text.match(/(?:Trayectoria Profesional:?|3\.\s*Trayectoria Profesional:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Pronóstico de Relaciones|4\.\s*Pronóstico de Relaciones))/s);
    relationshipMatch = text.match(/(?:Pronóstico de Relaciones:?|4\.\s*Pronóstico de Relaciones:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Salud|5\.\s*Salud))/s);
    healthMatch = text.match(/(?:Salud y Bienestar:?|5\.\s*Salud y Bienestar:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Crecimiento Personal|6\.\s*Crecimiento))/s);
    growthMatch = text.match(/(?:Crecimiento Personal:?|6\.\s*Crecimiento Personal:?)(.*?)$/s);
  } else {
    // English patterns
    personalityMatch = text.match(/(?:Personality Analysis:?|1\.\s*Personality Analysis:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Year Ahead|2\.\s*Year))/s);
    yearMatch = text.match(/(?:Year Ahead Forecast:?|2\.\s*Year Ahead Forecast:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Career Path|3\.\s*Career))/s);
    careerMatch = text.match(/(?:Career Path:?|3\.\s*Career Path:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Relationship|4\.\s*Relationship))/s);
    relationshipMatch = text.match(/(?:Relationship Forecast:?|4\.\s*Relationship Forecast:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Health|5\.\s*Health))/s);
    healthMatch = text.match(/(?:Health & Wellbeing:?|5\.\s*Health & Wellbeing:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Personal Growth|6\.\s*Personal))/s);
    growthMatch = text.match(/(?:Personal Growth:?|6\.\s*Personal Growth:?)(.*?)$/s);
  }
  
  sections.personalityAnalysis = personalityMatch ? personalityMatch[1].trim() : "";
  sections.yearForecast = yearMatch ? yearMatch[1].trim() : "";
  sections.careerPath = careerMatch ? careerMatch[1].trim() : "";
  sections.relationshipForecast = relationshipMatch ? relationshipMatch[1].trim() : "";
  sections.healthGuidance = healthMatch ? healthMatch[1].trim() : "";
  sections.personalGrowth = growthMatch ? growthMatch[1].trim() : "";
  
  // If any section is missing, use a fallback approach - split by numbered sections
  if (Object.values(sections).some(value => !value)) {
    console.log("Some sections not found, using fallback parsing approach");
    
    const fallbackSections = text.split(/(?:\n\n|\r\n\r\n)(?:\d\.\s*|(?:Personality|Year|Career|Relationship|Health|Personal|Анализ|Прогноз|Карьерный|Здоровье|Личностный|Análisis|Pronóstico|Trayectoria|Salud|Crecimiento))/);
    
    if (fallbackSections.length >= 6) {
      if (!sections.personalityAnalysis) sections.personalityAnalysis = fallbackSections[1].trim();
      if (!sections.yearForecast) sections.yearForecast = fallbackSections[2].trim();
      if (!sections.careerPath) sections.careerPath = fallbackSections[3].trim();
      if (!sections.relationshipForecast) sections.relationshipForecast = fallbackSections[4].trim();
      if (!sections.healthGuidance) sections.healthGuidance = fallbackSections[5].trim();
      if (!sections.personalGrowth) sections.personalGrowth = fallbackSections[6].trim();
    }
  }
  
  // Get localized default text based on language
  const defaultText = getLocalizedDefaultText(language);
  
  // If sections are still missing, use the entire text as a last resort
  if (Object.values(sections).some(value => !value)) {
    console.log("Fallback parsing failed, using entire text");
    
    return {
      personalityAnalysis: sections.personalityAnalysis || text || defaultText,
      yearForecast: sections.yearForecast || defaultText,
      careerPath: sections.careerPath || defaultText,
      relationshipForecast: sections.relationshipForecast || defaultText,
      healthGuidance: sections.healthGuidance || defaultText,
      personalGrowth: sections.personalGrowth || defaultText
    };
  }
  
  return sections as FullHoroscopeData;
}

// Get localized default text for missing sections
function getLocalizedDefaultText(language: string): string {
  switch (language) {
    case 'ru':
      return "Не удалось правильно обработать этот раздел гороскопа. Пожалуйста, попробуйте сгенерировать гороскоп заново.";
    case 'es':
      return "No pudimos procesar correctamente esta sección del horóscopo. Por favor, intenta regenerar tu horóscopo.";
    default:
      return "We couldn't properly parse this section from the generated horoscope. Please try regenerating your horoscope.";
  }
}
