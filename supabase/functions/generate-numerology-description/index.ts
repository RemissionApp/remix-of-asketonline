import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { matrixData, userId, readingId, language = 'ru' } = await req.json();
    
    console.log('Generating numerology description for user:', userId);

    // Check if description already exists
    const { data: existingDescription } = await supabaseClient
      .from('numerology_descriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('reading_id', readingId)
      .eq('language', language)
      .single();

    if (existingDescription) {
      console.log('Found existing description, returning it');
      return new Response(JSON.stringify({ description: existingDescription.description_data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate AI description using OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `Ты опытный нумеролог с глубокими знаниями в области матрицы судьбы. 
Создай подробное, персонализированное описание на основе предоставленных данных матрицы судьбы.

Структура ответа должна быть в формате JSON со следующими разделами:
{
  "centralEnergy": {
    "title": "Энергия в центре: Название",
    "number": число,
    "description": "Подробное описание центральной энергии",
    "keyTask": "Ключевая задача личности",
    "influence": "Влияние на жизнь"
  },
  "ancestralLines": {
    "masculine": {
      "title": "Линия мужского рода",
      "energies": [описания энергий],
      "tasks": "Задачи от мужского рода"
    },
    "feminine": {
      "title": "Линия женского рода", 
      "energies": [описания энергий],
      "tasks": "Задачи от женского рода"
    }
  },
  "moneyChannel": {
    "title": "Денежный канал",
    "energies": [числа канала],
    "description": "Как работать с деньгами",
    "recommendations": "Рекомендации для финансового успеха"
  },
  "relationshipChannel": {
    "title": "Канал отношений",
    "energies": [числа канала],
    "description": "Особенности в отношениях",
    "idealPartner": "Описание идеального партнера",
    "challenges": "Вызовы в отношениях"
  },
  "chakras": [
    {
      "name": "Название чакры",
      "number": число,
      "description": "Описание энергии чакры",
      "recommendations": "Рекомендации по развитию"
    }
  ],
  "ageLines": [
    {
      "period": "Возрастной период",
      "description": "Описание периода",
      "recommendations": "Рекомендации для периода"
    }
  ],
  "generalConclusion": {
    "personalProfile": "Общий личностный профиль",
    "lifeTasks": "Основные жизненные задачи", 
    "potentialRealization": "Пути реализации потенциала",
    "finalRecommendations": "Итоговые рекомендации"
  }
}

Пиши тепло, мудро и вдохновляюще. Используй "Вы" при обращении. Будь конкретным и практичным в рекомендациях.`;

    const userPrompt = `Проанализируй следующую матрицу судьбы и создай персонализированное описание:

Данные матрицы:
${JSON.stringify(matrixData, null, 2)}

Создай глубокий анализ, учитывая все числа, их позиции и взаимодействия между собой.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    const aiData = await response.json();
    
    if (!aiData.choices || !aiData.choices[0]) {
      throw new Error('Invalid response from OpenAI API');
    }

    let descriptionData;
    try {
      descriptionData = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: treat as plain text
      descriptionData = {
        generalConclusion: {
          personalProfile: aiData.choices[0].message.content
        }
      };
    }

    // Save description to database
    const { error: insertError } = await supabaseClient
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

    console.log('Successfully generated and saved numerology description');

    return new Response(JSON.stringify({ description: descriptionData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-numerology-description function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});