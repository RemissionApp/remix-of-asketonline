
import { UniverseQuestion } from '@/types';
import { supabase } from '@/lib/supabase';

// Функция для загрузки вопросов пользователя Вселенной
export const loadUniverseQuestions = async (userId: string): Promise<UniverseQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('universe_questions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!data) return [];
    
    // Преобразуем из формата БД в формат приложения
    return data.map(q => ({
      id: q.id,
      user_id: q.user_id,
      question: q.question,
      answer: q.answer,
      created_at: q.created_at
    }));
  } catch (error) {
    console.error('Error loading universe questions:', error);
    return [];
  }
};

// Функция для сохранения нового вопроса к Вселенной
export const saveUniverseQuestion = async (
  userId: string,
  question: string,
  answer: string
): Promise<UniverseQuestion | null> => {
  try {
    const { data, error } = await supabase
      .from('universe_questions')
      .insert({
        user_id: userId,
        question,
        answer
      })
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      user_id: data.user_id,
      question: data.question,
      answer: data.answer,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error saving universe question:', error);
    return null;
  }
};
