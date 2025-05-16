
import { corsHeaders } from "./config.ts";
import { HoroscopeRequest, HoroscopeResponse } from "./types.ts";
import { generateHoroscope } from "./horoscopeGenerator.ts";
import { extractSections } from "./utils.ts";

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
  console.log(`Generated horoscope text length: ${horoscopeText.length}`);
  console.log(`Generated horoscope preview: ${horoscopeText.substring(0, 200)}...`);

  // Prepare response based on whether detailed or brief horoscope was requested
  let horoscopeResponse: HoroscopeResponse = { success: true };
  
  if (detailed) {
    console.log("Processing detailed horoscope and extracting sections");
    
    // Log the full text for debugging
    console.log("Full horoscope text:");
    console.log("---START OF TEXT---");
    console.log(horoscopeText);
    console.log("---END OF TEXT---");
    
    const generalAtmosphere = extractSections(horoscopeText, "general_atmosphere");
    const workFinance = extractSections(horoscopeText, "work_finance");
    const loveRelationships = extractSections(horoscopeText, "love_relationships");
    const healthWellbeing = extractSections(horoscopeText, "health_wellbeing");
    const dailyAdvice = extractSections(horoscopeText, "daily_advice");
    
    console.log("Extracted sections results:");
    console.log({
      generalAtmosphere: `${generalAtmosphere.substring(0, 50)}... (${generalAtmosphere.length} chars)`,
      workFinance: `${workFinance.substring(0, 50)}... (${workFinance.length} chars)`,
      loveRelationships: `${loveRelationships.substring(0, 50)}... (${loveRelationships.length} chars)`, 
      healthWellbeing: `${healthWellbeing.substring(0, 50)}... (${healthWellbeing.length} chars)`,
      dailyAdvice: `${dailyAdvice.substring(0, 50)}... (${dailyAdvice.length} chars)`
    });
    
    horoscopeResponse.data = {
      description: horoscopeText,
      sections: {
        general_atmosphere: generalAtmosphere,
        work_finance: workFinance,
        love_relationships: loveRelationships,
        health_wellbeing: healthWellbeing,
        daily_advice: dailyAdvice
      }
    };
    
    // Verify the final structure
    console.log("Final horoscope response structure:", {
      success: horoscopeResponse.success,
      sections: Object.keys(horoscopeResponse.data?.sections || {}),
      hasSections: !!horoscopeResponse.data?.sections,
      sectionLengths: {
        general_atmosphere: horoscopeResponse.data?.sections?.general_atmosphere?.length || 0,
        work_finance: horoscopeResponse.data?.sections?.work_finance?.length || 0,
        love_relationships: horoscopeResponse.data?.sections?.love_relationships?.length || 0,
        health_wellbeing: horoscopeResponse.data?.sections?.health_wellbeing?.length || 0,
        daily_advice: horoscopeResponse.data?.sections?.daily_advice?.length || 0
      }
    });
  } else {
    horoscopeResponse.data = {
      description: horoscopeText
    };
  }

  console.log("Returning horoscope response with success:", horoscopeResponse.success);
  return new Response(JSON.stringify(horoscopeResponse), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
