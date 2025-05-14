
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
      const { language } = get();
      const errorMessage = language === 'ru' 
        ? "Вопрос слишком короткий" 
        : language === 'es'
          ? "La pregunta es demasiado corta"
          : "Question too short";
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    const { user, language } = get();
    
    if (!user) {
      const notAuthMessage = {
        ru: "Вы должны быть авторизованы для сохранения вопросов",
        en: "You must be logged in to save questions",
        es: "Debe iniciar sesión para guardar preguntas"
      }[language] || "You must be logged in to save questions";
      
      toast.error(notAuthMessage);
      // Still allow asking without auth, but won't save to DB
    }

    try {
      console.log("Asking universe:", question);
      // Get response from universe message function
      const answer = await generateUniverseAnswer(question);
      console.log("Got universe answer:", answer);
      
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
          console.log("Saving question to Supabase...");
          const { error } = await supabase
            .from('universe_questions')
            .insert({
              question: newQuestion.question,
              answer: newQuestion.answer,
              user_id: user.id
            });
          
          if (error) {
            console.error('Error saving question to Supabase:', error);
            const saveErrorMessage = {
              ru: "Не удалось сохранить вопрос в базе данных",
              en: "Failed to save question to database",
              es: "No se pudo guardar la pregunta en la base de datos"
            }[language] || "Failed to save question to database";
            
            toast.error(saveErrorMessage);
          } else {
            console.log("Question saved to Supabase successfully");
          }
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
      console.log("Loading universe questions for user:", user.id);
      // Get all universe questions
      const { data, error } = await supabase
        .from('universe_questions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching universe questions:", error);
        throw error;
      }
      
      console.log("Loaded universe questions:", data?.length || 0);
      
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
      const { language } = get();
      const errorMessage = {
        ru: "Не удалось загрузить историю вопросов",
        en: "Failed to load question history",
        es: "No se pudo cargar el historial de preguntas"
      }[language] || "Failed to load question history";
      
      toast.error(errorMessage);
    }
  }
});
