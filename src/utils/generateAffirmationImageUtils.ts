
import { supabase } from "@/lib/supabase";
import { Affirmation } from "@/hooks/useAffirmations";

export const generateAffirmationImage = async (
  affirmation: Affirmation, 
  language: string
): Promise<string | null> => {
  try {
    // Формируем имя файла на основе текста аффирмации
    const filename = affirmation.text.toLowerCase()
      .replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 30);
    
    console.log(`Генерация изображения для аффирмации ${affirmation.id}: ${filename}`);
    
    const { data, error } = await supabase.functions.invoke('generate-affirmation-image', {
      body: {
        affirmationId: affirmation.id,
        text: affirmation.text,
        language,
        filename
      }
    });
    
    if (error) {
      console.error(`Ошибка при генерации изображения для аффирмации ${affirmation.id}:`, error);
      return null;
    }
    
    if (data.imageUrl) {
      console.log(`Успешно сгенерировано изображение для аффирмации ${affirmation.id}: ${data.imageUrl}`);
      return data.imageUrl;
    }
    
    return null;
  } catch (err) {
    console.error(`Исключение при генерации изображения для аффирмации ${affirmation.id}:`, err);
    return null;
  }
};

export const generateAllAffirmationImages = async (affirmations: Affirmation[], language: string): Promise<Record<number, string>> => {
  const results: Record<number, string> = {};
  
  for (const affirmation of affirmations) {
    try {
      const imageUrl = await generateAffirmationImage(affirmation, language);
      
      if (imageUrl) {
        results[affirmation.id] = imageUrl;
      }
    } catch (err) {
      console.error(`Ошибка при генерации изображения для аффирмации ${affirmation.id}:`, err);
    }
  }
  
  return results;
};
