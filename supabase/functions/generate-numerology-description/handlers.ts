import { corsHeaders } from './config.ts';
import { NumerologyRequest, NumerologyResponse } from './types.ts';
import { generateNumerologyDescription } from './generator.ts';
import { supabase } from './supabaseClient.ts';

export async function handleRequest(req: Request): Promise<Response> {
  // Log request for debugging
  console.log('Received numerology request:', req.url);

  const requestBody = (await req.json()) as NumerologyRequest;
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  const { matrixData, userId, readingId, language = 'ru' } = requestBody;

  if (!matrixData || !userId || !readingId) {
    throw new Error('Matrix data, user ID and reading ID are required');
  }

  console.log(`Generating numerology description for user: ${userId}, reading: ${readingId}`);

  // Check if description already exists
  try {
    const { data: existingDescription, error: fetchError } = await supabase
      .from('numerology_descriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('reading_id', readingId)
      .eq('language', language)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing description:', fetchError);
    }

    if (existingDescription) {
      console.log('Found existing description, returning it');
      return new Response(JSON.stringify({ 
        success: true, 
        description: existingDescription.description_data 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error checking for existing description:', error);
  }

  // Generate new description using AI
  console.log('Generating new numerology description');
  const descriptionData = await generateNumerologyDescription(matrixData, language);
  
  console.log('Generated description data structure:', Object.keys(descriptionData));

  // Save description to database
  try {
    const { error: insertError } = await supabase
      .from('numerology_descriptions')
      .insert({
        user_id: userId,
        reading_id: readingId,
        description_data: descriptionData,
        language: language
      });

    if (insertError) {
      console.error('Error saving description:', insertError);
      throw insertError;
    }

    console.log('Successfully saved numerology description to database');
  } catch (saveError) {
    console.error('Exception when saving description:', saveError);
    // Continue with response even if save fails
  }

  console.log('Returning numerology description response');
  const response: NumerologyResponse = {
    success: true,
    description: descriptionData
  };

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}