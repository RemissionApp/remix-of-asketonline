// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Available languages for horoscope generation
export const supportedLanguages = ['ru', 'en', 'es'];

// Model to use via Lovable AI Gateway
export const openAiModel = 'google/gemini-2.5-flash';

// Temperature setting for OpenAI API
export const openAiTemperature = 0.7;

// Token limits for different horoscope types
export const tokenLimits = {
  detailed: 800,
  brief: 200,
};
