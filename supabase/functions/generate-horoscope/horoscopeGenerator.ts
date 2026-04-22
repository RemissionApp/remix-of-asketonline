import { openAiModel, openAiTemperature, tokenLimits } from './config.ts';
import { getUserPrompt, getSystemPrompt } from './prompts.ts';

export async function generateHoroscope(
  sign: string,
  language: string,
  detailed: boolean,
  birthDate: string | null
): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY is not set');
  }

  // Get appropriate prompts
  const systemPrompt = getSystemPrompt(language, detailed);
  const userPrompt = getUserPrompt(sign, language, detailed, birthDate);

  console.log(`User prompt: ${userPrompt}`);
  console.log(`System prompt: ${systemPrompt}`);

  // Call Lovable AI Gateway to generate horoscope
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
    }),
  });

  const data = await response.json();
  console.log('AI Gateway status:', response.status);
  console.log(
    'AI Gateway response:',
    JSON.stringify(data).substring(0, 500) + '...'
  );

  if (data.error) {
    console.error('AI Gateway error:', data.error);
    throw new Error(data.error.message || 'Error from AI Gateway');
  }

  return data.choices[0].message.content;
}
