
import { openAiModel, openAiTemperature } from "../generate-horoscope/config.ts";

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
  userProfile: any
): Promise<FullHoroscopeData> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const systemPrompt = `You are an expert astrologer with decades of experience in providing insightful, detailed horoscope readings. 
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

  const userPrompt = `Please create a full astrological profile for a ${zodiacSign}${birthDate ? ` born on ${birthDate}` : ''}.
Include all six sections: Personality Analysis, Year Ahead Forecast, Career Path, Relationship Forecast, Health & Wellbeing, and Personal Growth.`;

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
  const sections = parseHoroscopeSections(generatedText);
  console.log("Parsed sections:", Object.keys(sections));
  
  return sections;
}

function parseHoroscopeSections(text: string): FullHoroscopeData {
  const sections: Partial<FullHoroscopeData> = {};
  
  // Try to extract sections using common patterns
  const personalityMatch = text.match(/(?:Personality Analysis:?|1\.\s*Personality Analysis:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Year Ahead|2\.\s*Year))/s);
  sections.personalityAnalysis = personalityMatch ? personalityMatch[1].trim() : "";
  
  const yearMatch = text.match(/(?:Year Ahead Forecast:?|2\.\s*Year Ahead Forecast:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Career Path|3\.\s*Career))/s);
  sections.yearForecast = yearMatch ? yearMatch[1].trim() : "";
  
  const careerMatch = text.match(/(?:Career Path:?|3\.\s*Career Path:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Relationship|4\.\s*Relationship))/s);
  sections.careerPath = careerMatch ? careerMatch[1].trim() : "";
  
  const relationshipMatch = text.match(/(?:Relationship Forecast:?|4\.\s*Relationship Forecast:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Health|5\.\s*Health))/s);
  sections.relationshipForecast = relationshipMatch ? relationshipMatch[1].trim() : "";
  
  const healthMatch = text.match(/(?:Health & Wellbeing:?|5\.\s*Health & Wellbeing:?)(.*?)(?=(?:\n\n|\r\n\r\n)(?:Personal Growth|6\.\s*Personal))/s);
  sections.healthGuidance = healthMatch ? healthMatch[1].trim() : "";
  
  const growthMatch = text.match(/(?:Personal Growth:?|6\.\s*Personal Growth:?)(.*?)$/s);
  sections.personalGrowth = growthMatch ? growthMatch[1].trim() : "";
  
  // If any section is missing, use a fallback approach - split by numbered sections
  if (Object.values(sections).some(value => !value)) {
    console.log("Some sections not found, using fallback parsing approach");
    
    const fallbackSections = text.split(/(?:\n\n|\r\n\r\n)(?:\d\.\s*|(?:Personality|Year|Career|Relationship|Health|Personal))/);
    
    if (fallbackSections.length >= 6) {
      if (!sections.personalityAnalysis) sections.personalityAnalysis = fallbackSections[1].trim();
      if (!sections.yearForecast) sections.yearForecast = fallbackSections[2].trim();
      if (!sections.careerPath) sections.careerPath = fallbackSections[3].trim();
      if (!sections.relationshipForecast) sections.relationshipForecast = fallbackSections[4].trim();
      if (!sections.healthGuidance) sections.healthGuidance = fallbackSections[5].trim();
      if (!sections.personalGrowth) sections.personalGrowth = fallbackSections[6].trim();
    }
  }
  
  // If sections are still missing, use the entire text as a last resort
  if (Object.values(sections).some(value => !value)) {
    console.log("Fallback parsing failed, using entire text");
    const defaultText = "We couldn't properly parse this section from the generated horoscope. Please try regenerating your horoscope.";
    
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
