import { openAiModel, openAiTemperature } from './config.ts';

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
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY is not set');
  }

  // Create prompts in the appropriate language
  const systemPrompt = getSystemPrompt(zodiacSign, birthDate, language);
  const userPrompt = getUserPrompt(zodiacSign, birthDate, language);

  console.log('System prompt:', systemPrompt);
  console.log('User prompt:', userPrompt);

  // Call OpenAI API to generate the full horoscope
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openAiModel,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: openAiTemperature,
      max_tokens: 4000, // Increased token limit for longer response
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error('OpenAI API error:', data.error);
    throw new Error(data.error.message || 'Error from OpenAI API');
  }

  const generatedText = data.choices[0].message.content;

  // Log the full raw text for debugging
  console.log('Raw generated text:', generatedText.substring(0, 200) + '...');

  // Parse the generated text into sections
  const sections = parseHoroscopeSections(generatedText, language);
  console.log('Parsed sections:', Object.keys(sections));

  // Log first part of each section for debugging
  for (const [key, value] of Object.entries(sections)) {
    console.log(`Section ${key}: ${value.substring(0, 50)}...`);
  }

  return sections;
}

// Get system prompt based on language
function getSystemPrompt(
  zodiacSign: string,
  birthDate: string | null,
  language: string
): string {
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
Используй звездочки для выделения номера и названия раздела, например: **1. Анализ личности:** или **2. Прогноз на год:**
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
Utiliza asteriscos para resaltar el número y nombre de la sección, por ejemplo: **1. Análisis de Personalidad:** o **2. Pronóstico del Año:**
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
Use asterisks to highlight the section number and title, for example: **1. Personality Analysis:** or **2. Year Ahead Forecast:**
Avoid generic statements and platitudes. Use cosmic metaphors and reference planetary positions where relevant.
The tone should be insightful, wise, and educational but also accessible and practical.
DO NOT mention that this is AI-generated content.`;
      break;
  }

  return prompt;
}

// Get user prompt based on language
function getUserPrompt(
  zodiacSign: string,
  birthDate: string | null,
  language: string
): string {
  switch (language) {
    case 'ru':
      return `Создай полный астрологический профиль для ${zodiacSign}${birthDate ? `, родившегося ${birthDate}` : ''}.
Включи все шесть разделов: Анализ личности, Прогноз на год, Карьерный путь, Прогноз отношений, Здоровье и самочувствие, и Личностный рост.
Используй звездочки для выделения номера и названия каждого раздела, например: **1. Анализ личности:**`;

    case 'es':
      return `Crea un perfil astrológico completo para ${zodiacSign}${birthDate ? ` nacido el ${birthDate}` : ''}.
Incluye las seis secciones: Análisis de Personalidad, Pronóstico del Año, Trayectoria Profesional, Pronóstico de Relaciones, Salud y Bienestar, y Crecimiento Personal.
Utiliza asteriscos para resaltar el número y nombre de cada sección, por ejemplo: **1. Análisis de Personalidad:**`;

    default: // English
      return `Please create a full astrological profile for a ${zodiacSign}${birthDate ? ` born on ${birthDate}` : ''}.
Include all six sections: Personality Analysis, Year Ahead Forecast, Career Path, Relationship Forecast, Health & Wellbeing, and Personal Growth.
Use asterisks to highlight the section number and title for each section, for example: **1. Personality Analysis:**`;
  }
}

function parseHoroscopeSections(
  text: string,
  language: string
): FullHoroscopeData {
  // Create a default structure to fill in
  const sections: FullHoroscopeData = {
    personalityAnalysis: '',
    yearForecast: '',
    careerPath: '',
    relationshipForecast: '',
    healthGuidance: '',
    personalGrowth: '',
  };

  // Define regex patterns for different languages
  const patterns: { [key: string]: { [key: string]: RegExp } } = {
    ru: {
      personalityAnalysis:
        /\*\*(?:1\.?\s*)?Анализ личности:?\*\*([\s\S]*?)(?=\*\*(?:2\.?\s*)?Прогноз|$)/i,
      yearForecast:
        /\*\*(?:2\.?\s*)?Прогноз на год:?\*\*([\s\S]*?)(?=\*\*(?:3\.?\s*)?Карьерный|$)/i,
      careerPath:
        /\*\*(?:3\.?\s*)?Карьерный путь:?\*\*([\s\S]*?)(?=\*\*(?:4\.?\s*)?Прогноз отношений|$)/i,
      relationshipForecast:
        /\*\*(?:4\.?\s*)?Прогноз отношений:?\*\*([\s\S]*?)(?=\*\*(?:5\.?\s*)?Здоровье|$)/i,
      healthGuidance:
        /\*\*(?:5\.?\s*)?Здоровье и самочувствие:?\*\*([\s\S]*?)(?=\*\*(?:6\.?\s*)?Личностный|$)/i,
      personalGrowth:
        /\*\*(?:6\.?\s*)?Личностный рост:?\*\*([\s\S]*?)(?=$|(?:\*\*))/i,
    },
    es: {
      personalityAnalysis:
        /\*\*(?:1\.?\s*)?Análisis de Personalidad:?\*\*([\s\S]*?)(?=\*\*(?:2\.?\s*)?Pronóstico|$)/i,
      yearForecast:
        /\*\*(?:2\.?\s*)?Pronóstico del Año:?\*\*([\s\S]*?)(?=\*\*(?:3\.?\s*)?Trayectoria|$)/i,
      careerPath:
        /\*\*(?:3\.?\s*)?Trayectoria Profesional:?\*\*([\s\S]*?)(?=\*\*(?:4\.?\s*)?Pronóstico de Relaciones|$)/i,
      relationshipForecast:
        /\*\*(?:4\.?\s*)?Pronóstico de Relaciones:?\*\*([\s\S]*?)(?=\*\*(?:5\.?\s*)?Salud|$)/i,
      healthGuidance:
        /\*\*(?:5\.?\s*)?Salud y Bienestar:?\*\*([\s\S]*?)(?=\*\*(?:6\.?\s*)?Crecimiento|$)/i,
      personalGrowth:
        /\*\*(?:6\.?\s*)?Crecimiento Personal:?\*\*([\s\S]*?)(?=$|(?:\*\*))/i,
    },
    en: {
      personalityAnalysis:
        /\*\*(?:1\.?\s*)?Personality Analysis:?\*\*([\s\S]*?)(?=\*\*(?:2\.?\s*)?Year|$)/i,
      yearForecast:
        /\*\*(?:2\.?\s*)?Year Ahead Forecast:?\*\*([\s\S]*?)(?=\*\*(?:3\.?\s*)?Career|$)/i,
      careerPath:
        /\*\*(?:3\.?\s*)?Career Path:?\*\*([\s\S]*?)(?=\*\*(?:4\.?\s*)?Relationship|$)/i,
      relationshipForecast:
        /\*\*(?:4\.?\s*)?Relationship Forecast:?\*\*([\s\S]*?)(?=\*\*(?:5\.?\s*)?Health|$)/i,
      healthGuidance:
        /\*\*(?:5\.?\s*)?Health & Wellbeing:?\*\*([\s\S]*?)(?=\*\*(?:6\.?\s*)?Personal|$)/i,
      personalGrowth:
        /\*\*(?:6\.?\s*)?Personal Growth:?\*\*([\s\S]*?)(?=$|(?:\*\*))/i,
    },
  };

  // Alternate patterns as fallback
  const altPatterns: { [key: string]: { [key: string]: RegExp } } = {
    ru: {
      personalityAnalysis:
        /(?:1\.?\s*)?Анализ личности:?([\s\S]*?)(?=(?:2\.?\s*)?Прогноз на год|$)/i,
      yearForecast:
        /(?:2\.?\s*)?Прогноз на год:?([\s\S]*?)(?=(?:3\.?\s*)?Карьерный путь|$)/i,
      careerPath:
        /(?:3\.?\s*)?Карьерный путь:?([\s\S]*?)(?=(?:4\.?\s*)?Прогноз отношений|$)/i,
      relationshipForecast:
        /(?:4\.?\s*)?Прогноз отношений:?([\s\S]*?)(?=(?:5\.?\s*)?Здоровье|$)/i,
      healthGuidance:
        /(?:5\.?\s*)?Здоровье и самочувствие:?([\s\S]*?)(?=(?:6\.?\s*)?Личностный рост|$)/i,
      personalGrowth: /(?:6\.?\s*)?Личностный рост:?([\s\S]*?)$/i,
    },
    es: {
      personalityAnalysis:
        /(?:1\.?\s*)?Análisis de Personalidad:?([\s\S]*?)(?=(?:2\.?\s*)?Pronóstico|$)/i,
      yearForecast:
        /(?:2\.?\s*)?Pronóstico del Año:?([\s\S]*?)(?=(?:3\.?\s*)?Trayectoria|$)/i,
      careerPath:
        /(?:3\.?\s*)?Trayectoria Profesional:?([\s\S]*?)(?=(?:4\.?\s*)?Pronóstico de Relaciones|$)/i,
      relationshipForecast:
        /(?:4\.?\s*)?Pronóstico de Relaciones:?([\s\S]*?)(?=(?:5\.?\s*)?Salud|$)/i,
      healthGuidance:
        /(?:5\.?\s*)?Salud y Bienestar:?([\s\S]*?)(?=(?:6\.?\s*)?Crecimiento|$)/i,
      personalGrowth: /(?:6\.?\s*)?Crecimiento Personal:?([\s\S]*?)$/i,
    },
    en: {
      personalityAnalysis:
        /(?:1\.?\s*)?Personality Analysis:?([\s\S]*?)(?=(?:2\.?\s*)?Year Ahead|$)/i,
      yearForecast:
        /(?:2\.?\s*)?Year Ahead Forecast:?([\s\S]*?)(?=(?:3\.?\s*)?Career Path|$)/i,
      careerPath:
        /(?:3\.?\s*)?Career Path:?([\s\S]*?)(?=(?:4\.?\s*)?Relationship|$)/i,
      relationshipForecast:
        /(?:4\.?\s*)?Relationship Forecast:?([\s\S]*?)(?=(?:5\.?\s*)?Health|$)/i,
      healthGuidance:
        /(?:5\.?\s*)?Health & Wellbeing:?([\s\S]*?)(?=(?:6\.?\s*)?Personal Growth|$)/i,
      personalGrowth: /(?:6\.?\s*)?Personal Growth:?([\s\S]*?)$/i,
    },
  };

  // Select language patterns, default to English if not found
  const langPatterns = patterns[language] || patterns.en;
  const langAltPatterns = altPatterns[language] || altPatterns.en;

  // Try to extract each section with main patterns
  let hasMatches = false;
  Object.keys(sections).forEach(key => {
    const pattern = langPatterns[key];
    if (pattern) {
      const match = text.match(pattern);
      if (match && match[1]) {
        hasMatches = true;
        sections[key as keyof FullHoroscopeData] = match[1].trim();
      }
    }
  });

  // If no matches with main patterns, try alternate patterns
  if (!hasMatches) {
    console.log('No matches with main patterns, trying alternate patterns');
    Object.keys(sections).forEach(key => {
      const pattern = langAltPatterns[key];
      if (pattern) {
        const match = text.match(pattern);
        if (match && match[1]) {
          hasMatches = true;
          sections[key as keyof FullHoroscopeData] = match[1].trim();
        }
      }
    });
  }

  // If still no matches, try splitting by section number (1., 2., etc.)
  if (!hasMatches) {
    console.log(
      'No matches with alternate patterns, trying to split by section numbers'
    );
    const sectionParts = text.split(/(?:\r?\n|\r)\s*(?:\*\*)?[1-6]\.\s/);
    if (sectionParts.length >= 6) {
      sections.personalityAnalysis = (sectionParts[1] || '').trim();
      sections.yearForecast = (sectionParts[2] || '').trim();
      sections.careerPath = (sectionParts[3] || '').trim();
      sections.relationshipForecast = (sectionParts[4] || '').trim();
      sections.healthGuidance = (sectionParts[5] || '').trim();
      sections.personalGrowth = (sectionParts[6] || '').trim();

      hasMatches = Object.values(sections).some(
        value => value && value.length > 0
      );
      if (hasMatches)
        console.log('Successfully parsed sections by number splitting');
    }
  }

  // If we still have no matches, use a very simple approach - split the text into 6 roughly equal parts
  if (!hasMatches) {
    console.log(
      'All parsing methods failed, falling back to simple text division'
    );
    const plainText = text.replace(/\*\*/g, '').replace(/^\d+\.\s*/gm, '');
    const lines = plainText
      .split(/\r?\n/)
      .filter(line => line.trim().length > 0);

    if (lines.length >= 6) {
      const chunkSize = Math.floor(lines.length / 6);
      sections.personalityAnalysis = lines
        .slice(0, chunkSize)
        .join('\n')
        .trim();
      sections.yearForecast = lines
        .slice(chunkSize, chunkSize * 2)
        .join('\n')
        .trim();
      sections.careerPath = lines
        .slice(chunkSize * 2, chunkSize * 3)
        .join('\n')
        .trim();
      sections.relationshipForecast = lines
        .slice(chunkSize * 3, chunkSize * 4)
        .join('\n')
        .trim();
      sections.healthGuidance = lines
        .slice(chunkSize * 4, chunkSize * 5)
        .join('\n')
        .trim();
      sections.personalGrowth = lines
        .slice(chunkSize * 5)
        .join('\n')
        .trim();
    } else {
      // Last resort - just use the whole text as the first section
      sections.personalityAnalysis = text;
    }
  }

  // Get localized default text for any missing sections
  const defaultText = getLocalizedDefaultText(language);

  // Make sure all sections have at least some content
  Object.keys(sections).forEach(key => {
    if (
      !sections[key as keyof FullHoroscopeData] ||
      sections[key as keyof FullHoroscopeData].length === 0
    ) {
      sections[key as keyof FullHoroscopeData] = defaultText;
    }
  });

  return sections;
}

// Get localized default text for missing sections
function getLocalizedDefaultText(language: string): string {
  switch (language) {
    case 'ru':
      return 'Не удалось правильно обработать этот раздел гороскопа. Пожалуйста, попробуйте сгенерировать гороскоп заново.';
    case 'es':
      return 'No pudimos procesar correctamente esta sección del horóscopo. Por favor, intenta regenerar tu horóscopo.';
    default:
      return "We couldn't properly parse this section from the generated horoscope. Please try regenerating your horoscope.";
  }
}
