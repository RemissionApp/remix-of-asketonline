
import { StateCreator } from 'zustand';
import { UniverseSlice, AppState } from '../types';
import { UniverseQuestion } from '@/types';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const createUniverseSlice: StateCreator<
  AppState,
  [],
  [],
  UniverseSlice
> = (set, get) => ({
  activeQuestions: [],
  
  setUniverseQuestions: (questions: UniverseQuestion[]) => set({ activeQuestions: questions }),
  
  loadUniverseQuestions: async () => {
    try {
      const { user } = get();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('universe_questions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const questions: UniverseQuestion[] = data.map(item => ({
          id: item.id,
          user_id: item.user_id,
          question: item.question,
          answer: item.answer,
          created_at: item.created_at,
          date: item.created_at
        }));
        
        set({ activeQuestions: questions });
      }
    } catch (error) {
      console.error('Error loading universe questions:', error);
    }
  },
  
  askUniverse: async (question: string) => {
    try {
      const { user } = get();
      if (!user) return;
      
      const questionData: UniverseQuestion = {
        id: uuidv4(),
        user_id: user.id,
        question,
        answer: "Thinking...",
        created_at: new Date().toISOString(),
        date: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('universe_questions')
        .insert(questionData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add to local state
      const currentQuestions = get().activeQuestions;
      set({ activeQuestions: [questionData, ...currentQuestions] });
      
      // Here you would typically call a function to get the actual answer
      // For now, we'll just update with a placeholder
      
    } catch (error) {
      console.error('Error asking universe:', error);
    }
  }
});
