
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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

serve(async (req) => {
  try {
    const { sign, day = 'today', language = 'en' } = await req.json();
    
    if (!sign) {
      return new Response(
        JSON.stringify({ error: "Sign parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Make request to the Aztro API
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching horoscope: ${response.statusText}`);
    }
    
    const data: HoroscopeResponse = await response.json();
    
    // If the language is not English, we might want to translate the response
    // For now, we'll just return the original data
    return new Response(
      JSON.stringify({ 
        success: true,
        data
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
