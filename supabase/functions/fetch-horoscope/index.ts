
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

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client with Deno runtime
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let payload;
    try {
      payload = await req.json();
    } catch (e) {
      console.error("Error parsing request JSON:", e);
      throw new Error("Invalid JSON in request body");
    }
    
    const { sign, day = 'today', language = 'en' } = payload;
    
    console.log(`Fetching horoscope for ${sign}, day: ${day}, language: ${language}`);
    
    if (!sign) {
      return new Response(
        JSON.stringify({ success: false, error: "Sign parameter is required" }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }
    
    // For now, we only support "today" for the day parameter
    if (day !== 'today') {
      return new Response(
        JSON.stringify({ success: false, error: "Only 'today' is supported for day parameter" }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }
    
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Try to get horoscope from our database first
    const { data: storedHoroscope, error: fetchError } = await supabaseClient
      .from('daily_horoscopes')
      .select('horoscope_data')
      .eq('sign', sign)
      .eq('forecast_date', today)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching from database:', fetchError);
      throw new Error(`Error fetching horoscope from database: ${fetchError.message}`);
    }
    
    let horoscopeData: HoroscopeData;
    
    // If we found it in our database, use that
    if (storedHoroscope) {
      console.log(`Found stored horoscope for ${sign}`);
      horoscopeData = storedHoroscope.horoscope_data;
    } else {
      // If not found in database, fetch from Aztro API
      console.log(`No stored horoscope found for ${sign}, fetching from API`);
      const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching horoscope from API: ${response.statusText}`);
      }
      
      try {
        horoscopeData = await response.json();
        
        // Store in database for future use
        const { error: insertError } = await supabaseClient
          .from('daily_horoscopes')
          .insert({
            sign,
            forecast_date: today,
            horoscope_data: horoscopeData
          });
          
        if (insertError) {
          console.error('Error storing horoscope:', insertError);
        }
      } catch (e) {
        console.error('Error parsing API response:', e);
        throw new Error('Invalid response from horoscope API');
      }
    }
    
    // Return the horoscope data
    return new Response(
      JSON.stringify({ 
        success: true,
        data: horoscopeData
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in fetch-horoscope:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
