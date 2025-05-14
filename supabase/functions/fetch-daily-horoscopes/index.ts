
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

interface HoroscopeData {
  date_range: string;
  current_date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

interface HoroscopeChartResponse {
  // We'll just store the SVG code for now
  svg_code: string;
}

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// Language mapping for translations
const translations: Record<string, Record<string, string>> = {
  'ru': {
    'title': 'Гороскоп на сегодня',
    'mood': 'Настроение',
    'lucky_number': 'Счастливое число',
    'lucky_time': 'Счастливое время',
    'color': 'Цвет дня'
  },
  'es': {
    'title': 'Horóscopo para hoy',
    'mood': 'Estado de ánimo',
    'lucky_number': 'Número de la suerte',
    'lucky_time': 'Hora de la suerte',
    'color': 'Color del día'
  }
};

// Initialize Supabase client with Deno runtime
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  try {
    // Check if this is a scheduled function run
    const isScheduled = req.headers.get('Authorization') === `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`;
    
    if (!isScheduled) {
      // Ensure this function can only be triggered by cron job
      return new Response(
        JSON.stringify({ error: "Unauthorized access" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log("Starting daily horoscope fetch");
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // First check if we've already fetched horoscopes today
    const { data: existingData, error: checkError } = await supabaseClient
      .from('daily_horoscopes')
      .select('*')
      .eq('forecast_date', today)
      .limit(1);
    
    if (checkError) {
      throw new Error(`Error checking existing horoscopes: ${checkError.message}`);
    }
    
    // If we already have today's horoscopes, return them
    if (existingData && existingData.length > 0) {
      console.log("Already fetched horoscopes for today");
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Horoscopes already fetched for today",
          data: existingData
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log("Fetching horoscopes for all zodiac signs");
    const horoscopePromises = zodiacSigns.map(async (sign) => {
      // Fetch horoscopes from the Aztro API
      const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching horoscope for ${sign}: ${response.statusText}`);
      }
      
      const data: HoroscopeData = await response.json();
      
      return {
        sign,
        forecast_date: today,
        horoscope_data: data
      };
    });
    
    // Wait for all horoscopes to be fetched
    const horoscopes = await Promise.all(horoscopePromises);
    
    // Insert horoscopes to Supabase
    const { error: insertError } = await supabaseClient
      .from('daily_horoscopes')
      .insert(horoscopes);
    
    if (insertError) {
      throw new Error(`Error inserting horoscopes: ${insertError.message}`);
    }
    
    console.log("Successfully fetched and stored daily horoscopes");
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Successfully fetched daily horoscopes",
        count: horoscopes.length
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-daily-horoscopes:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
