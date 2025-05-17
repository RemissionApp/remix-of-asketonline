
// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OpenAI model to use for horoscope generation
export const openAiModel = "gpt-4o-mini";

// Temperature setting for OpenAI API
export const openAiTemperature = 0.7;
