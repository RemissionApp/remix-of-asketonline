
import { corsHeaders } from "./config.ts";
import { HoroscopeRequest, HoroscopeResponse } from "./types.ts";
import { generateHoroscope } from "./horoscopeGenerator.ts";
import { extractSections, getRandomColor, getRandomMood } from "./utils.ts";

export async function handleRequest(req: Request): Promise<Response> {
  // Log request for debugging
  console.log("Received request:", req.url);
  
  const requestBody = await req.json() as HoroscopeRequest;
  console.log("Request body:", JSON.stringify(requestBody));
  
  const { sign, language, detailed = false, birthDate = null } = requestBody;

  if (!sign) {
    throw new Error('Zodiac sign is required');
  }

  console.log(`Generating ${detailed ? 'detailed' : 'brief'} horoscope for sign: ${sign}, language: ${language}`);

  // Generate horoscope text using OpenAI
  const horoscopeText = await generateHoroscope(sign, language, detailed, birthDate);
  console.log(`Generated horoscope: ${horoscopeText.substring(0, 200)}...`);

  // Prepare response based on whether detailed or brief horoscope was requested
  let horoscopeResponse: HoroscopeResponse = { success: true };
  
  if (detailed) {
    const workFinance = extractSections(horoscopeText, "работа", "финанс", "work", "finance", "💼");
    const loveRelationships = extractSections(horoscopeText, "любовь", "отношения", "love", "relation", "❤️");
    const healthWellbeing = extractSections(horoscopeText, "здоровье", "самочувствие", "health", "wellbeing", "🧘‍♂️");
    const dailyAdvice = extractSections(horoscopeText, "совет", "рекомендация", "advice", "tip", "✨");
    
    console.log("Extracted sections:", {
      workFinance: workFinance.substring(0, 50) + "...",
      loveRelationships: loveRelationships.substring(0, 50) + "...",
      healthWellbeing: healthWellbeing.substring(0, 50) + "...", 
      dailyAdvice: dailyAdvice.substring(0, 50) + "..."
    });
    
    horoscopeResponse.data = {
      description: horoscopeText,
      sections: {
        work_finance: workFinance,
        love_relationships: loveRelationships,
        health_wellbeing: healthWellbeing,
        daily_advice: dailyAdvice
      },
      lucky_number: Math.floor(Math.random() * 100).toString(),
      lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      color: getRandomColor(language),
      mood: getRandomMood(language)
    };
  } else {
    horoscopeResponse.data = {
      description: horoscopeText
    };
  }

  console.log("Returning horoscope response:", JSON.stringify(horoscopeResponse).substring(0, 200) + "...");
  return new Response(JSON.stringify(horoscopeResponse), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
