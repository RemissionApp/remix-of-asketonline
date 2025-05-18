
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BUCKET_NAME = "practice-images";

serve(async (req) => {
  // Обработка CORS preflight запросов
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Получаем ключи из переменных окружения
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAiKey = Deno.env.get('OPENAI_API_KEY')!;

    if (!openAiKey) {
      throw new Error('API ключ OpenAI не настроен в секретах функции');
    }

    // Создаем клиент Supabase с сервисной ролью для доступа к хранилищу
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Получаем данные из запроса
    const { affirmationId, text, language, filename } = await req.json();

    if (!text || !filename || !affirmationId || !language) {
      return new Response(
        JSON.stringify({ error: 'Необходимо указать text, filename, affirmationId и language' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Формируем промпт на основе языка
    let basePrompt = "";
    if (language === 'ru') {
      basePrompt = `Создайте вдохновляющее и медитативное изображение, которое визуально представляет аффирмацию: "${text}". Используйте нежные цвета, космические элементы, вселенную, звезды, свечение. Изображение должно быть красивым, спокойным, и духовным.`;
    } else if (language === 'es') {
      basePrompt = `Crea una imagen inspiradora y meditativa que represente visualmente esta afirmación: "${text}". Utiliza colores suaves, elementos cósmicos, universo, estrellas, resplandor. La imagen debe ser hermosa, tranquila y espiritual.`;
    } else {
      basePrompt = `Create an inspiring and meditative image that visually represents this affirmation: "${text}". Use soft colors, cosmic elements, universe, stars, glow. The image should be beautiful, calm, and spiritual.`;
    }

    // Генерируем изображение с помощью OpenAI
    console.log(`Генерация изображения для аффирмации ${affirmationId}: ${text}`);
    
    const dalle3Response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: basePrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json"
      }),
    });

    if (!dalle3Response.ok) {
      const errorData = await dalle3Response.json();
      console.error('Ошибка OpenAI API:', errorData);
      throw new Error(`OpenAI API вернул ошибку: ${errorData.error?.message || 'Неизвестная ошибка'}`);
    }

    // Получаем результат
    const data = await dalle3Response.json();
    const imageBase64 = data.data[0].b64_json;

    // Декодируем base64 в бинарные данные
    const binary = atob(imageBase64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    // Формируем имя файла для сохранения
    const fileExt = "png";
    const fullFilename = `affirmation_${affirmationId}_${language}_${filename}.${fileExt}`;
    
    // Сохраняем файл в хранилище
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullFilename, array, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error('Ошибка при загрузке файла:', uploadError);
      throw new Error(`Не удалось загрузить изображение: ${uploadError.message}`);
    }

    // Получаем публичный URL изображения
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fullFilename);

    const imageUrl = publicUrlData.publicUrl;

    // Возвращаем URL сохраненного изображения
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        filename: fullFilename
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Ошибка в функции generate-affirmation-image:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Произошла неизвестная ошибка',
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
