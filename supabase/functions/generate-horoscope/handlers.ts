import { corsHeaders } from './config.ts';
import { HoroscopeRequest, HoroscopeResponse } from './types.ts';
import { generateHoroscope } from './horoscopeGenerator.ts';
import { extractSections } from './utils.ts';
import { supabase } from './supabaseClient.ts';

export async function handleRequest(req: Request): Promise<Response> {
  // Log request for debugging
  console.log('Received request:', req.url);

  const requestBody = (await req.json()) as HoroscopeRequest;
  console.log('Request body:', JSON.stringify(requestBody));

  const { sign, language, detailed = false, birthDate = null } = requestBody;

  if (!sign) {
    throw new Error('Zodiac sign is required');
  }

  console.log(
    `Generating ${detailed ? 'detailed' : 'brief'} horoscope for sign: ${sign}, language: ${language}`
  );

  // Generate horoscope text using OpenAI
  const horoscopeText = await generateHoroscope(
    sign,
    language,
    detailed,
    birthDate
  );
  console.log(`Generated horoscope text length: ${horoscopeText.length}`);
  console.log(
    `Generated horoscope preview: ${horoscopeText.substring(0, 200)}...`
  );

  // Сохраним исходный текст в таблицу raw_horoscopes для отладки
  try {
    const { error } = await supabase.from('raw_horoscopes').insert({
      zodiac_sign: sign,
      language,
      content: horoscopeText,
      detailed: detailed,
    });

    if (error) {
      console.error('Error saving raw horoscope:', error);
    } else {
      console.log('Raw horoscope saved to database');
    }
  } catch (saveError) {
    console.error('Exception when saving raw horoscope:', saveError);
  }

  // Prepare response based on whether detailed or brief horoscope was requested
  let horoscopeResponse: HoroscopeResponse = { success: true };

  if (detailed) {
    console.log('Processing detailed horoscope and extracting sections');

    // Log the full text for debugging
    console.log('FULL horoscope text for debugging:');
    console.log(horoscopeText);

    // Extract sections with improved error handling
    try {
      const generalAtmosphere = extractSections(
        horoscopeText,
        'general_atmosphere'
      );
      const workFinance = extractSections(horoscopeText, 'work_finance');
      const loveRelationships = extractSections(
        horoscopeText,
        'love_relationships'
      );
      const healthWellbeing = extractSections(
        horoscopeText,
        'health_wellbeing'
      );
      const dailyAdvice = extractSections(horoscopeText, 'daily_advice');

      console.log('Extracted sections results:');
      console.log({
        generalAtmosphere: `${generalAtmosphere.substring(0, 50)}... (${generalAtmosphere.length} chars)`,
        workFinance: `${workFinance.substring(0, 50)}... (${workFinance.length} chars)`,
        loveRelationships: `${loveRelationships.substring(0, 50)}... (${loveRelationships.length} chars)`,
        healthWellbeing: `${healthWellbeing.substring(0, 50)}... (${healthWellbeing.length} chars)`,
        dailyAdvice: `${dailyAdvice.substring(0, 50)}... (${dailyAdvice.length} chars)`,
      });

      // Ensure all sections are filled
      horoscopeResponse.data = {
        description: horoscopeText,
        sections: {
          general_atmosphere:
            generalAtmosphere ||
            'Сегодня день будет наполнен возможностями для личностного роста.',
          work_finance:
            workFinance ||
            'В профессиональной сфере возможны интересные предложения.',
          love_relationships:
            loveRelationships || 'В личной жизни возможны приятные сюрпризы.',
          health_wellbeing:
            healthWellbeing ||
            'Уделите внимание своему физическому и эмоциональному здоровью.',
          daily_advice:
            dailyAdvice ||
            'Слушайте свою интуицию, она укажет верное направление.',
        },
      };
    } catch (error) {
      console.error('Error extracting horoscope sections:', error);
      // Provide fallback sections
      horoscopeResponse.data = {
        description: horoscopeText,
        sections: {
          general_atmosphere:
            'Сегодня день будет наполнен возможностями для личностного роста.',
          work_finance:
            'В профессиональной сфере возможны интересные предложения.',
          love_relationships: 'В личной жизни возможны приятные сюрпризы.',
          health_wellbeing:
            'Уделите внимание своему физическому и эмоциональному здоровью.',
          daily_advice:
            'Слушайте свою интуицию, она укажет верное направление.',
        },
      };
    }

    // Verify the final structure
    console.log('Final horoscope response structure:', {
      success: horoscopeResponse.success,
      sections: Object.keys(horoscopeResponse.data?.sections || {}),
      hasSections: !!horoscopeResponse.data?.sections,
      sectionLengths: {
        general_atmosphere:
          horoscopeResponse.data?.sections?.general_atmosphere?.length || 0,
        work_finance:
          horoscopeResponse.data?.sections?.work_finance?.length || 0,
        love_relationships:
          horoscopeResponse.data?.sections?.love_relationships?.length || 0,
        health_wellbeing:
          horoscopeResponse.data?.sections?.health_wellbeing?.length || 0,
        daily_advice:
          horoscopeResponse.data?.sections?.daily_advice?.length || 0,
      },
    });
  } else {
    horoscopeResponse.data = {
      description: horoscopeText,
    };
  }

  console.log(
    'Returning horoscope response with success:',
    horoscopeResponse.success
  );
  return new Response(JSON.stringify(horoscopeResponse), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
