
import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { 
  UniverseChatMessage, 
  UniverseChatSession,
  createChatSession as createChatSessionUtil,
  loadChatSessions as loadChatSessionsUtil,
  loadSessionMessages,
  sendMessageToUniverse,
  subscribeToSessionMessages,
  saveMessage
} from '@/utils/universeChat';
import { UniverseChatState } from './universeChatTypes';

/**
 * Actions for universe chat functionality
 */
export interface UniverseChatActions {
  loadChatSessions: () => Promise<void>;
  createChatSession: (title: string) => Promise<string | null>;
  setCurrentChatSession: (sessionId: string | null) => Promise<void>;
  loadChatMessages: (sessionId: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
}

/**
 * Creates universe chat actions
 */
export const createUniverseChatActions = <T extends AppState & UniverseChatState>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
): UniverseChatActions => ({
  loadChatSessions: async () => {
    const { user } = get();
    
    if (!user) {
      console.warn('Cannot load chat sessions: User is not authenticated');
      return;
    }
    
    try {
      set({ isLoadingChat: true } as unknown as Partial<T>);
      const sessions = await loadChatSessionsUtil(user.id);
      console.log('Loaded chat sessions:', sessions.length);
      
      set({ 
        chatSessions: sessions, 
        isLoadingChat: false 
      } as unknown as Partial<T>);
      
      // Auto-select most recent session if none is selected
      if (!get().currentChatSession && sessions.length > 0) {
        set({ currentChatSession: sessions[0].id } as unknown as Partial<T>);
        await get().loadChatMessages(sessions[0].id);
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      toast.error('Не удалось загрузить беседы');
      set({ isLoadingChat: false } as unknown as Partial<T>);
    }
  },
  
  createChatSession: async (title: string) => {
    const { user } = get();
    
    if (!user) {
      console.warn('Cannot create chat session: User is not authenticated');
      toast.error('Требуется авторизация');
      return null;
    }
    
    if (!title || title.trim() === '') {
      console.warn('Cannot create chat session: Title is required');
      return null;
    }
    
    try {
      console.log('Creating chat session with title:', title);
      const sessionId = await createChatSessionUtil(user.id, title);
      
      if (sessionId) {
        console.log('Created session ID:', sessionId);
        
        // Reload sessions after creating a new one
        await get().loadChatSessions();
        
        // Return the new session ID
        return sessionId;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating chat session:", error);
      toast.error('Не удалось создать беседу');
      return null;
    }
  },
  
  setCurrentChatSession: async (sessionId: string | null) => {
    console.log('Setting current chat session:', sessionId);
    
    // Important: Set the session ID first before loading messages
    set({ currentChatSession: sessionId } as unknown as Partial<T>);
    
    if (sessionId) {
      // Then load messages for the selected session
      await get().loadChatMessages(sessionId);
    } else {
      set({ chatMessages: [] } as unknown as Partial<T>);
    }
  },
  
  loadChatMessages: async (sessionId: string) => {
    const { user } = get();
    
    if (!user) {
      console.warn('Cannot load chat messages: User is not authenticated');
      return;
    }
    
    if (!sessionId) {
      console.warn('Cannot load chat messages: Session ID is required');
      return;
    }
    
    try {
      console.log('Loading chat messages for session:', sessionId);
      
      // Clear messages and set loading state
      set({ isLoadingChat: true, chatMessages: [] } as unknown as Partial<T>); 
      
      const messages = await loadSessionMessages(sessionId);
      console.log('Loaded messages count:', messages.length);
      
      // Update state with loaded messages
      set({ chatMessages: messages, isLoadingChat: false } as unknown as Partial<T>);
      
      // Set up subscription to real-time updates
      const subscription = subscribeToSessionMessages(
        sessionId,
        (newMessage) => {
          console.log('New message received in subscription:', newMessage);
          
          set((state) => {
            // Check if message already exists to avoid duplicates
            if (state.chatMessages.some(msg => msg.id === newMessage.id)) {
              console.log('Message already exists, not adding duplicate');
              return { isSendingMessage: false } as unknown as Partial<T>;
            }
            
            console.log('Adding new message to state');
            return {
              chatMessages: [...state.chatMessages, newMessage],
              isSendingMessage: false
            } as unknown as Partial<T>;
          });
        }
      );
      
      // Store subscription for cleanup (not implemented here but good practice)
      // set({ currentSubscription: subscription });
    } catch (error) {
      console.error("Error loading chat messages:", error);
      toast.error('Не удалось загрузить сообщения');
      set({ isLoadingChat: false } as unknown as Partial<T>);
    }
  },
  
  sendChatMessage: async (message: string) => {
    const { user, userProfile, pacts } = get();
    const sessionId = get().currentChatSession;
    const currentMessages = get().chatMessages;
    
    if (!user) {
      toast.error('Требуется авторизация');
      return;
    }
    
    if (!sessionId) {
      // Create a new session instead of showing an error
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      const newSessionId = await get().createChatSession(title);
      if (!newSessionId) {
        toast.error('Не удалось создать новую беседу');
        return;
      }
      
      // Set current session and try again
      await get().setCurrentChatSession(newSessionId);
      await get().sendChatMessage(message);
      return;
    }
    
    if (!message || message.trim() === '') {
      console.warn('Cannot send empty message');
      return;
    }
    
    try {
      set({ isSendingMessage: true } as unknown as Partial<T>);
      
      // Add temporary message to state immediately
      const tempUserMsg: UniverseChatMessage = {
        id: `temp-${Date.now()}-${Math.random()}`,
        content: message,
        sender: 'user',
        created_at: new Date().toISOString(),
        session_id: sessionId
      };
      
      set(state => ({
        chatMessages: [...state.chatMessages, tempUserMsg]
      } as unknown as Partial<T>));
      
      console.log('Sending chat message:', message);
      
      // Prepare user data for context
      const userData: any = {};
      
      // Add user profile information
      if (userProfile) {
        if (userProfile.name) {
          userData.userName = userProfile.name;
        }
        
        if (userProfile.goal) {
          userData.userGoal = userProfile.goal;
        }
        
        if (userProfile.birthDate) {
          userData.birthDate = userProfile.birthDate;
        }
      }
      
      // Find current active pact
      const currentVow = pacts?.find(p => p.status === 'active');
      
      // Add pact information if available
      if (currentVow) {
        userData.currentVow = currentVow.title || 'вредных привычек';
        
        // Get current day of the pact
        const completedDays = (currentVow.days || []).filter((day: any) => day.completed).length;
        userData.vowDay = completedDays + 1;
        userData.vowDuration = currentVow.duration || 21;
      }
      
      // Get recent messages for context (last 5 user messages)
      const recentUserMessages = currentMessages
        .filter(msg => msg.sender === 'user')
        .slice(-5)
        .map(msg => msg.content);
      
      // Save user message to database
      const userMessageId = await saveMessage(user.id, sessionId, message, 'user');
      
      if (!userMessageId) {
        throw new Error('Failed to save user message');
      }
      
      // Call the universe-dialogue function using the imported supabase client
      const { data: dialogueResponse, error: dialogueError } = await supabase.functions.invoke('universe-dialogue', {
        body: {
          question: message,
          language: get().language,
          userData,
          recentMessages: recentUserMessages
        }
      });
      
      if (dialogueError) {
        throw new Error(`Error from universe-dialogue function: ${dialogueError.message}`);
      }
      
      if (!dialogueResponse?.answer) {
        throw new Error('No response received from universe-dialogue function');
      }
      
      // Save universe response to database
      const universeMessageId = await saveMessage(user.id, sessionId, dialogueResponse.answer, 'universe');
      
      if (!universeMessageId) {
        throw new Error('Failed to save universe response');
      }
      
      // Load updated messages
      const updatedMessages = await loadSessionMessages(sessionId);
      
      // Update state with all messages
      set({ 
        chatMessages: updatedMessages,
        isSendingMessage: false
      } as unknown as Partial<T>);
    } catch (error) {
      console.error("Error sending chat message:", error);
      toast.error('Не удалось отправить сообщение');
      set({ isSendingMessage: false } as unknown as Partial<T>);
    }
  }
});
