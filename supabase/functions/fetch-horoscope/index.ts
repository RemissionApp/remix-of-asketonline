
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

// Initialize Supabase client with Deno runtime
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  try {
    const { sign, day = 'today', language = 'en' } = await req.json();
    
    if (!sign) {
      return new Response(
        JSON.stringify({ error: "Sign parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Fetching horoscope for ${sign}, day: ${day}, language: ${language}`);
    
    // For now, we only support "today" for the day parameter
    if (day !== 'today') {
      return new Response(
        JSON.stringify({ error: "Only 'today' is supported for day parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Try to get horoscope from our database first
    const { data: storedHoroscope, error: fetchError } = await supabaseClient
      .from('daily_horoscopes')
      .select('horoscope_data')
      .eq('sign', sign)
      .eq('forecast_date', today)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
      throw new Error(`Error fetching horoscope from database: ${fetchError.message}`);
    }
    
    let horoscopeData: HoroscopeData;
    
    // If we found it in our database, use that
    if (storedHoroscope) {
      console.log(`Found stored horoscope for ${sign}`);
      horoscopeData = storedHoroscope.horoscope_data;
    } else {
      // If not found in database, fetch from Aztro API as fallback
      console.log(`No stored horoscope found for ${sign}, fetching from API`);
      const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching horoscope from API: ${response.statusText}`);
      }
      
      horoscopeData = await response.json();
    }
    
    // Return the horoscope data
    return new Response(
      JSON.stringify({ 
        success: true,
        data: horoscopeData
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-horoscope:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
