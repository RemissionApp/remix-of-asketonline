
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

interface HoroscopeResponse {
  date_range: string;
  current_date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { sign, day = 'today', language = 'en' } = await req.json();
    
    if (!sign) {
      return new Response(
        JSON.stringify({ error: "Sign parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create a Supabase client for database operations if needed
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Try to make request to the Aztro API
    try {
      const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching horoscope: ${response.statusText}`);
      }
      
      const data: HoroscopeResponse = await response.json();
      
      // Return successful response with horoscope data
      return new Response(
        JSON.stringify({ 
          success: true,
          data
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (apiError) {
      console.error("Error in fetch-horoscope API call:", apiError.message);
      
      // Generate fallback data since API call failed
      const fallbackData = {
        date_range: "",
        current_date: new Date().toLocaleDateString(),
        description: getRandomHoroscopeText(language),
        compatibility: "",
        mood: language === 'ru' ? 'задумчивый' : language === 'es' ? 'pensativo' : 'reflective',
        color: language === 'ru' ? 'фиолетовый' : language === 'es' ? 'púrpura' : 'purple',
        lucky_number: Math.floor(Math.random() * 100).toString(),
        lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      };
      
      // Return fallback horoscope data
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: fallbackData,
          originalError: apiError.message 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in fetch-horoscope:", error.message);
    
    // Create minimal fallback horoscope data for any unexpected errors
    const language = 'en'; // Default to English for the error case
    const defaultResponse = {
      date_range: "",
      current_date: new Date().toLocaleDateString(),
      description: getRandomHoroscopeText(language),
      compatibility: "",
      mood: language === 'ru' ? 'задумчивый' : language === 'es' ? 'pensativo' : 'reflective',
      color: language === 'ru' ? 'фиолетовый' : language === 'es' ? 'púrpura' : 'purple',
      lucky_number: Math.floor(Math.random() * 100).toString(),
      lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    };
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: defaultResponse,
        originalError: error.message 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to get random horoscope text when API fails
function getRandomHoroscopeText(language: string = 'en'): string {
  const texts = {
    ru: [
      'Звезды благоволят смелым решениям. Прислушайтесь к интуиции, она ведет вас по верному пути.',
      'Сегодня благоприятный день для начинаний. Вселенная открывает перед вами новые горизонты.',
      'Время перемен наступило. Отпустите старое, чтобы освободить место для нового.',
      'Космические энергии поддерживают вас. Двигайтесь вперед с уверенностью и благодарностью.',
      'Внутренний голос подскажет решение. Найдите тихий момент для глубокого размышления.'
    ],
    en: [
      'The stars favor bold decisions today. Listen to your intuition, it guides you on the right path.',
      'Today is favorable for new beginnings. The universe is opening new horizons before you.',
      'The time for change has come. Let go of the old to make room for the new.',
      'Cosmic energies support you now. Move forward with confidence and gratitude.',
      'Your inner voice will suggest the solution. Find a quiet moment for deep reflection.'
    ],
    es: [
      'Las estrellas favorecen decisiones audaces hoy. Escucha tu intuición, te guía por el camino correcto.',
      'Hoy es favorable para nuevos comienzos. El universo está abriendo nuevos horizontes ante ti.',
      'Ha llegado el momento del cambio. Deja ir lo viejo para dar espacio a lo nuevo.',
      'Las energías cósmicas te apoyan ahora. Avanza con confianza y gratitud.',
      'Tu voz interior te sugerirá la solución. Encuentra un momento tranquilo para una reflexión profunda.'
    ]
  };
  
  const defaultTexts = texts.en;
  const selectedTexts = texts[language] || defaultTexts;
  
  return selectedTexts[Math.floor(Math.random() * selectedTexts.length)];
}
