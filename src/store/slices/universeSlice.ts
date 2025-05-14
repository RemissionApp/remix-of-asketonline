
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { UniverseQuestion } from '@/types';
import { generateUniverseAnswer } from '@/utils/universeMessages';

export interface UniverseSlice {
  activeQuestions: UniverseQuestion[];
  askUniverse: (question: string) => Promise<UniverseQuestion>;
  loadUniverseQuestions: () => Promise<void>;
}

export const createUniverseSlice: StateCreator<AppState, [], [], UniverseSlice> = (set, get) => ({
  activeQuestions: [],
  
  // Ask a question to the universe
  askUniverse: async (question: string) => {
    if (!question || question.trim().length < 3) {
      throw new Error('Question too short');
    }

    try {
      // Получаем ответ от нашей функции universe message
      const answer = await generateUniverseAnswer(question);
      
      // Создаем запись вопроса
      const id = Date.now().toString();
      const newQuestion = {
        id,
        question,
        answer,
        date: new Date().toISOString()
      };

      // Добавляем вопрос в хранилище
      set((state) => ({
        activeQuestions: [newQuestion, ...state.activeQuestions].slice(0, 20) // Ограничение до 20 вопросов
      }));

      return newQuestion;
    } catch (error) {
      console.error('Error in askUniverse:', error);
      throw error;
    }
  },
  
  loadUniverseQuestions: async () => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      // Get all universe questions
      const { data, error } = await supabase
        .from('universe_questions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        set({ activeQuestions: [] });
        return;
      }
      
      // Transform to our app's format
      const questions: UniverseQuestion[] = data.map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        date: q.created_at
      }));
      
      // Update local state
      set({ activeQuestions: questions });
    } catch (error) {
      console.error("Error loading universe questions:", error);
    }
  }
});
