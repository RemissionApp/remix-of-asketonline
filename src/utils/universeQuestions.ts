
import { UniverseQuestion } from '@/types';
import { supabase } from '@/lib/supabase';

// Load universe questions for a user
export const loadUniverseQuestionsFromSupabase = async (userId: string): Promise<UniverseQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('universe_questions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error loading universe questions:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      question: item.question,
      answer: item.answer,
      created_at: item.created_at,
      date: item.created_at
    }));
  } catch (error) {
    console.error('Exception loading universe questions:', error);
    return [];
  }
};

// Save a universe question to Supabase
export const saveUniverseQuestionToSupabase = async (question: UniverseQuestion): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('universe_questions')
      .insert({
        id: question.id,
        user_id: question.user_id,
        question: question.question,
        answer: question.answer,
        created_at: question.created_at
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving universe question:', error);
    return false;
  }
};
