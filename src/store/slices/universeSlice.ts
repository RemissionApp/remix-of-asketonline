
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { UniverseQuestion } from '@/types';
import { generateUniverseAnswer } from '@/utils/universeMessages';
import { toast } from 'sonner';

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

    const { user } = get();
    
    if (!user) {
      toast.error("Вы должны быть авторизованы для сохранения вопросов");
      // Still allow asking without auth, but won't save to DB
    }

    try {
      // Get response from universe message function
      const answer = await generateUniverseAnswer(question);
      
      // Create question record
      const id = Date.now().toString();
      const newQuestion = {
        id,
        question,
        answer,
        date: new Date().toISOString()
      };

      // Add question to local store
      set((state) => ({
        activeQuestions: [newQuestion, ...state.activeQuestions].slice(0, 20) // Limit to 20 questions
      }));

      // Save to Supabase if user is authenticated
      if (user) {
        try {
          const { error } = await supabase
            .from('universe_questions')
            .insert({
              question: newQuestion.question,
              answer: newQuestion.answer,
              user_id: user.id
            });
          
          if (error) console.error('Error saving question to Supabase:', error);
        } catch (dbError) {
          console.error('Failed to save question to database:', dbError);
          // Don't throw here, we still want to return the answer even if DB save fails
        }
      }

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
      toast.error("Не удалось загрузить историю вопросов");
    }
  }
});
