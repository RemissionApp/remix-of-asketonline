import { openAiModel, openAiTemperature, tokenLimits } from './config.ts';
import { getUserPrompt, getSystemPrompt } from './prompts.ts';

export async function generateHoroscope(
  sign: string,
  language: string,
  detailed: boolean,
  birthDate: string | null
): Promise<string> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  // Get appropriate prompts
  const systemPrompt = getSystemPrompt(language, detailed);
  const userPrompt = getUserPrompt(sign, language, detailed, birthDate);

  console.log(`User prompt: ${userPrompt}`);
  console.log(`System prompt: ${systemPrompt}`);

  // Call OpenAI API to generate horoscope
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openAiModel,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: openAiTemperature,
      max_tokens: detailed ? tokenLimits.detailed : tokenLimits.brief,
    }),
  });

  const data = await response.json();
  console.log('OpenAI API status:', response.status);
  console.log(
    'OpenAI response:',
    JSON.stringify(data).substring(0, 500) + '...'
  );

  if (data.error) {
    console.error('OpenAI API error:', data.error);
    throw new Error(data.error.message || 'Error from OpenAI API');
  }

  return data.choices[0].message.content;
}
