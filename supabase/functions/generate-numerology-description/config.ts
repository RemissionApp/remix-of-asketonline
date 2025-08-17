// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Available languages for numerology generation
export const supportedLanguages = ['ru', 'en', 'es'];

// OpenAI model to use for numerology generation
export const openAiModel = 'gpt-4o-mini';

// Temperature setting for OpenAI API
export const openAiTemperature = 0.7;

// Token limits for numerology descriptions
export const tokenLimits = {
  numerology: 4000,
};