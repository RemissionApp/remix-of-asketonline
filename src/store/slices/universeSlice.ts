
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { UniverseQuestion } from '@/types';
import { generateUniverseAnswer } from '@/utils/universeMessages';
import { 
  UniverseChatMessage, 
  UniverseChatSession,
  createChatSession,
  loadChatSessions,
  loadSessionMessages,
  sendMessageToUniverse,
  subscribeToSessionMessages
} from '@/utils/universeChat';

export interface UniverseSlice {
  activeQuestions: UniverseQuestion[];
  askUniverse: (question: string) => Promise<UniverseQuestion>;
  loadUniverseQuestions: () => Promise<void>;
  saveUniverseQuestion: (question: UniverseQuestion) => Promise<void>;
  
  // Chat related state and methods
  chatSessions: UniverseChatSession[];
  currentChatSession: string | null;
  chatMessages: UniverseChatMessage[];
  loadChatSessions: () => Promise<void>;
  createChatSession: (title: string) => Promise<string | null>;
  setCurrentChatSession: (sessionId: string | null) => void;
  loadChatMessages: (sessionId: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  isLoadingChat: boolean;
  isSendingMessage: boolean;
}

export const createUniverseSlice: StateCreator<AppState, [], [], UniverseSlice> = (set, get) => ({
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
  },
  
  // Chat related state and methods
  chatSessions: [],
  currentChatSession: null,
  chatMessages: [],
  isLoadingChat: false,
  isSendingMessage: false,
  
  loadChatSessions: async () => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      set({ isLoadingChat: true });
      const sessions = await loadChatSessions(user.id);
      set({ chatSessions: sessions, isLoadingChat: false });
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      set({ isLoadingChat: false });
    }
  },
  
  createChatSession: async (title: string) => {
    const { user } = get();
    
    if (!user) return null;
    
    try {
      const sessionId = await createChatSession(user.id, title);
      
      if (sessionId) {
        // Reload sessions after creating a new one
        await get().loadChatSessions();
        // Set the new session as current
        set({ currentChatSession: sessionId });
      }
      
      return sessionId;
    } catch (error) {
      console.error("Error creating chat session:", error);
      return null;
    }
  },
  
  setCurrentChatSession: (sessionId: string | null) => {
    set({ currentChatSession: sessionId });
    
    if (sessionId) {
      // Load messages for the selected session
      get().loadChatMessages(sessionId);
    } else {
      set({ chatMessages: [] });
    }
  },
  
  loadChatMessages: async (sessionId: string) => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      set({ isLoadingChat: true });
      const messages = await loadSessionMessages(sessionId);
      set({ chatMessages: messages, isLoadingChat: false });
      
      // Set up subscription to real-time updates
      const subscription = subscribeToSessionMessages(
        sessionId,
        (newMessage) => {
          set((state) => ({
            chatMessages: [...state.chatMessages, newMessage]
          }));
        }
      );
      
      // Store subscription for cleanup (not implemented here but good practice)
      // set({ currentSubscription: subscription });
    } catch (error) {
      console.error("Error loading chat messages:", error);
      set({ isLoadingChat: false });
    }
  },
  
  sendChatMessage: async (message: string) => {
    const { user } = get();
    const sessionId = get().currentChatSession;
    
    if (!user || !sessionId) return;
    
    try {
      set({ isSendingMessage: true });
      await sendMessageToUniverse(user.id, sessionId, message);
      // Messages will be updated via real-time subscription
      set({ isSendingMessage: false });
    } catch (error) {
      console.error("Error sending chat message:", error);
      set({ isSendingMessage: false });
    }
  }
});
