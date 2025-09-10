import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { corsHeaders } from './config.ts';
import { generateFullHoroscope } from './horoscopeGenerator.ts';
import { supabase } from './supabaseClient.ts';

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, zodiacSign, birthDate, language = 'en' } = await req.json();

    if (!userId || !zodiacSign) {
      throw new Error('User ID and zodiac sign are required');
    }

    console.log(
      `Generating full horoscope for user: ${userId}, sign: ${zodiacSign}, language: ${language}`
    );

    // Extract birth year from birthDate for caching
    const birthYear = birthDate ? new Date(birthDate).getFullYear() : null;
    const currentYear = new Date().getFullYear();

    console.log(`Birth year: ${birthYear}, Target year: ${currentYear}`);

    // Check cache first if birth year is available
    let horoscopeData = null;
    if (birthYear) {
      console.log('Checking cache for existing horoscope...');
      const { data: cachedHoroscope, error: cacheError } = await supabase
        .from('cached_yearly_horoscopes')
        .select('content')
        .eq('zodiac_sign', zodiacSign)
        .eq('target_year', currentYear)
        .eq('birth_year', birthYear)
        .eq('language', language)
        .maybeSingle();

      if (cacheError) {
        console.error('Error checking cache:', cacheError);
      } else if (cachedHoroscope) {
        console.log('Found cached horoscope, using cached version');
        horoscopeData = cachedHoroscope.content;
      }
    }

    // Generate new horoscope only if not found in cache
    if (!horoscopeData) {
      console.log('No cached horoscope found, generating new one...');
      
      // Fetch additional user data from the database if needed
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      // Generate comprehensive horoscope with language support
      horoscopeData = await generateFullHoroscope(
        zodiacSign,
        birthDate,
        profileData,
        language
      );

      // Save to global cache if birth year is available
      if (birthYear && horoscopeData) {
        try {
          console.log('Saving to global cache...');
          const { error: cacheInsertError } = await supabase
            .from('cached_yearly_horoscopes')
            .insert({
              zodiac_sign: zodiacSign,
              target_year: currentYear,
              birth_year: birthYear,
              language: language,
              content: horoscopeData,
            });

          if (cacheInsertError) {
            console.error('Error saving to cache:', cacheInsertError);
          } else {
            console.log('Successfully saved horoscope to cache');
          }
        } catch (cacheError) {
          console.error('Exception when saving to cache:', cacheError);
        }
      }
    }

    // Store the horoscope in user's personal history
    try {
      const { error } = await supabase.from('full_horoscopes').insert({
        user_id: userId,
        zodiac_sign: zodiacSign,
        content: horoscopeData,
      });

      if (error) {
        console.error('Error saving to user history:', error);
      } else {
        console.log('Successfully saved horoscope to user history');
      }
    } catch (saveError) {
      console.error('Exception when saving to user history:', saveError);
    }

    return new Response(JSON.stringify(horoscopeData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in generate-full-horoscope:', error);
    return new Response(
      JSON.stringify({
        error: `Error generating horoscope: ${error.message}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
