
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from "./config.ts";
import { generateFullHoroscope } from "./horoscopeGenerator.ts";
import { supabase } from "./supabaseClient.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, zodiacSign, birthDate, language = 'en' } = await req.json();

    if (!userId || !zodiacSign) {
      throw new Error('User ID and zodiac sign are required');
    }

    console.log(`Generating full horoscope for user: ${userId}, sign: ${zodiacSign}, language: ${language}`);
    
    // Fetch additional user data from the database if needed
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }
    
    // Generate comprehensive horoscope with language support
    const horoscopeData = await generateFullHoroscope(zodiacSign, birthDate, profileData, language);
    
    // Store the generated horoscope in the database (without language field)
    try {
      const { error } = await supabase
        .from('full_horoscopes')
        .insert({
          user_id: userId,
          zodiac_sign: zodiacSign,
          content: horoscopeData
        });
      
      if (error) {
        console.error("Error saving full horoscope:", error);
      } else {
        console.log("Successfully saved horoscope to database");
      }
    } catch (saveError) {
      console.error("Exception when saving horoscope:", saveError);
    }

    return new Response(JSON.stringify(horoscopeData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
    
  } catch (error) {
    console.error('Error in generate-full-horoscope:', error);
    return new Response(JSON.stringify({ 
      error: `Error generating horoscope: ${error.message}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
