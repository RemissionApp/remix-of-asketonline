import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface MonthlyHoroscopeRequest {
  userId: string;
  zodiacSign: string;
  month: number;
  year: number;
  language: string;
}

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    // Create Supabase client using environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const {
      userId,
      zodiacSign,
      month,
      year,
      language,
    } = (await req.json()) as MonthlyHoroscopeRequest;

    if (!userId || !zodiacSign || !month || !year) {
      throw new Error('Missing required parameters');
    }

    // Get user's birth year for caching
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('birth_date')
      .eq('id', userId)
      .single();
      
    const birthYear = userProfile?.birth_date ? new Date(userProfile.birth_date).getFullYear() : null;

    // Check global cache first if birth year is available
    let monthlyHoroscope = null;
    if (birthYear) {
      console.log('Checking monthly horoscope cache...');
      const { data: cachedHoroscope } = await supabase
        .from('cached_monthly_horoscopes')
        .select('content')
        .eq('zodiac_sign', zodiacSign)
        .eq('month', month)
        .eq('year', year)
        .eq('birth_year', birthYear)
        .eq('language', language)
        .maybeSingle();

      if (cachedHoroscope) {
        console.log('Found cached monthly horoscope');
        monthlyHoroscope = cachedHoroscope.content;
      }
    }

    // Generate new horoscope if not found in cache
    if (!monthlyHoroscope) {
      console.log('No cached monthly horoscope found, generating new one...');
      
      const systemPrompt = getSystemPrompt(language);
      const userPrompt = getUserPrompt(zodiacSign, month, year, language);

      console.log('Calling OpenAI API for monthly horoscope...');
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
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
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('OpenAI API error:', data.error);
        throw new Error(data.error.message || 'Error from OpenAI API');
      }

      const generatedText = data.choices[0].message.content;
      
      // Parse the generated text into sections
      monthlyHoroscope = {
        generalForecast: extractSection(generatedText, 'Общий прогноз', 'General Forecast', 'Pronóstico General'),
        careerFinance: extractSection(generatedText, 'Карьера и финансы', 'Career and Finance', 'Carrera y Finanzas'),
        loveRelationships: extractSection(generatedText, 'Любовь и отношения', 'Love and Relationships', 'Amor y Relaciones'),
        healthWellbeing: extractSection(generatedText, 'Здоровье и благополучие', 'Health and Wellbeing', 'Salud y Bienestar'),
        fullText: generatedText,
      };

      // Save to cache if birth year is available
      if (birthYear) {
        try {
          console.log('Saving monthly horoscope to cache...');
          await supabase.from('cached_monthly_horoscopes').insert({
            zodiac_sign: zodiacSign,
            month: month,
            year: year,
            birth_year: birthYear,
            language: language,
            content: monthlyHoroscope,
          });
          console.log('Successfully saved monthly horoscope to cache');
        } catch (cacheError) {
          console.error('Error saving to monthly cache:', cacheError);
        }
      }
    }

    return new Response(JSON.stringify(monthlyHoroscope), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-monthly-horoscope function:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: `Error generating monthly horoscope: ${error.message}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getSystemPrompt(language: string): string {
  const prompts = {
    ru: `Ты опытный астролог, создающий месячные гороскопы. 
    Создай детальный прогноз на месяц с разбивкой на 4 блока:
    
    **Общий прогноз** - основные тенденции и энергии месяца
    **Карьера и финансы** - профессиональные возможности, финансовые перспективы
    **Любовь и отношения** - романтические возможности, семейные аспекты
    **Здоровье и благополучие** - физическое и эмоциональное состояние
    
    Используй мудрый, позитивный тон. Пиши конкретно, с практическими советами.`,

    en: `You are an experienced astrologer creating monthly horoscopes.
    Create a detailed monthly forecast with 4 sections:
    
    **General Forecast** - main trends and energies of the month
    **Career and Finance** - professional opportunities, financial prospects
    **Love and Relationships** - romantic opportunities, family aspects
    **Health and Wellbeing** - physical and emotional state
    
    Use a wise, positive tone. Write specifically with practical advice.`,

    es: `Eres un astrólogo experimentado que crea horóscopos mensuales.
    Crea un pronóstico mensual detallado con 4 secciones:
    
    **Pronóstico General** - principales tendencias y energías del mes
    **Carrera y Finanzas** - oportunidades profesionales, perspectivas financieras
    **Amor y Relaciones** - oportunidades románticas, aspectos familiares
    **Salud y Bienestar** - estado físico y emocional
    
    Usa un tono sabio y positivo. Escribe específicamente con consejos prácticos.`,
  };

  return prompts[language] || prompts.en;
}

function getUserPrompt(sign: string, month: number, year: number, language: string): string {
  const monthNames = {
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
         'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
         'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  };

  const monthName = monthNames[language]?.[month - 1] || monthNames.en[month - 1];

  const prompts = {
    ru: `Создай месячный гороскоп для знака ${sign} на ${monthName} ${year} года.`,
    en: `Create a monthly horoscope for ${sign} for ${monthName} ${year}.`,
    es: `Crea un horóscopo mensual para ${sign} para ${monthName} ${year}.`,
  };

  return prompts[language] || prompts.en;
}

function extractSection(text: string, ruTitle: string, enTitle: string, esTitle: string): string {
  const patterns = [
    new RegExp(`\\*\\*${ruTitle}\\*\\*[^*]*`, 'i'),
    new RegExp(`\\*\\*${enTitle}\\*\\*[^*]*`, 'i'),
    new RegExp(`\\*\\*${esTitle}\\*\\*[^*]*`, 'i'),
    new RegExp(`${ruTitle}[^\\n]*(?:\\n(?!\\*\\*)[^\\n]*)*`, 'i'),
    new RegExp(`${enTitle}[^\\n]*(?:\\n(?!\\*\\*)[^\\n]*)*`, 'i'),
    new RegExp(`${esTitle}[^\\n]*(?:\\n(?!\\*\\*)[^\\n]*)*`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/\*\*/g, '').trim();
    }
  }

  return text.split('\n\n')[0] || text.substring(0, 200);
}