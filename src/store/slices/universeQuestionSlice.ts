import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { UniverseQuestion } from '@/types';
import { generateUniverseAnswer } from '@/utils/universeMessages';

export interface UniverseQuestionSlice {
  activeQuestions: UniverseQuestion[];
  askUniverse: (question: string) => Promise<UniverseQuestion>;
  loadUniverseQuestions: () => Promise<void>;
  saveUniverseQuestion: (question: UniverseQuestion) => Promise<void>;
}

// Update the questionTransform function to correctly map to UniverseQuestion type
export const questionTransform = (data: any): UniverseQuestion[] => {
  if (!data || !Array.isArray(data)) return [];

  return data.map(item => ({
    id: item.id,
    user_id: item.user_id || '',
    question: item.question,
    answer: item.answer,
    created_at: item.created_at,
  }));
};

export const createUniverseQuestionSlice: StateCreator<AppState, [], [], UniverseQuestionSlice> = (set, get) => ({
  activeQuestions: [],
  
  // Ask a question to the universe
  askUniverse: async (question: string) => {
    if (!question || question.trim().length < 3) {
      throw new Error('Question too short');
    }

    try {
      // Get user data for context
      const { userProfile } = get();
      const zodiacSign = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
      
      // Get answer from our universe message function
      const answer = await generateUniverseAnswer(question);
      
      // Create question record
      const id = Date.now().toString();
      const newQuestion: UniverseQuestion = {
        id,
        question,
        answer,
        created_at: new Date().toISOString(),
        date: new Date().toISOString()
      };

      // Add question to store
      set((state) => ({
        activeQuestions: [newQuestion, ...state.activeQuestions].slice(0, 20) // Limit to 20 questions
      }));

      // Save to database if user is logged in
      const { user } = get();
      if (user) {
        await get().saveUniverseQuestion(newQuestion);
      }

      return newQuestion;
    } catch (error) {
      console.error('Error in askUniverse:', error);
      throw error;
    }
  },
  
  saveUniverseQuestion: async (question: UniverseQuestion) => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      // Convert from app format to database format
      const { error } = await supabase
        .from('universe_questions')
        .insert({
          id: question.id,
          user_id: user.id,
          question: question.question,
          answer: question.answer,
          created_at: question.created_at
        });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error saving universe question:", error);
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
        created_at: q.created_at,
        date: q.created_at // Add date field same as created_at
      }));
      
      // Update local state
      set({ activeQuestions: questions });
    } catch (error) {
      console.error("Error loading universe questions:", error);
    }
  }
});
