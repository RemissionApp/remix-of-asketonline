import { openAiModel, openAiTemperature, tokenLimits } from './config.ts';
import { getUserPrompt, getSystemPrompt } from './prompts.ts';

export async function generateNumerologyDescription(
  matrixData: any,
  language: string
): Promise<any> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  // Get appropriate prompts
  const systemPrompt = getSystemPrompt(language);
  const userPrompt = getUserPrompt(matrixData, language);

  console.log(`User prompt: ${userPrompt.substring(0, 200)}...`);
  console.log(`System prompt: ${systemPrompt.substring(0, 200)}...`);

  // Call OpenAI API to generate numerology description
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
      max_tokens: tokenLimits.numerology,
    }),
  });

  const data = await response.json();
  console.log('OpenAI API status:', response.status);
  console.log(
    'OpenAI response preview:',
    JSON.stringify(data).substring(0, 500) + '...'
  );

  if (data.error) {
    console.error('OpenAI API error:', data.error);
    throw new Error(data.error.message || 'Error from OpenAI API');
  }

  const rawContent = data.choices[0].message.content;
  console.log('Raw AI response length:', rawContent.length);

  // Try to parse as JSON
  let descriptionData;
  try {
    descriptionData = JSON.parse(rawContent);
    console.log('Successfully parsed JSON response');
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', parseError);
    console.log('Raw response:', rawContent);
    
    // Fallback: create basic structure with AI response
    descriptionData = {
      generalConclusion: {
        personalProfile: rawContent
      }
    };
  }

  return descriptionData;
}