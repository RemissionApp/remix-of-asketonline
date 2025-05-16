
import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { toast } from 'sonner';
import { 
  UniverseChatMessage, 
  UniverseChatSession,
  createChatSession as createChatSessionUtil,
  loadChatSessions as loadChatSessionsUtil,
  loadSessionMessages,
  sendMessageToUniverse,
  subscribeToSessionMessages
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
  set: StateCreator<T>['setState'],
  get: () => T
): UniverseChatActions => ({
  loadChatSessions: async () => {
    const { user } = get();
    
    if (!user) {
      console.warn('Cannot load chat sessions: User is not authenticated');
      return;
    }
    
    try {
      set({ isLoadingChat: true });
      const sessions = await loadChatSessionsUtil(user.id);
      console.log('Loaded chat sessions:', sessions.length);
      
      set({ 
        chatSessions: sessions, 
        isLoadingChat: false 
      });
      
      // Auto-select most recent session if none is selected
      if (!get().currentChatSession && sessions.length > 0) {
        set({ currentChatSession: sessions[0].id });
        await get().loadChatMessages(sessions[0].id);
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      toast.error('Не удалось загрузить беседы');
      set({ isLoadingChat: false });
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
    set({ currentChatSession: sessionId });
    
    if (sessionId) {
      // Then load messages for the selected session
      await get().loadChatMessages(sessionId);
    } else {
      set({ chatMessages: [] });
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
      set({ isLoadingChat: true, chatMessages: [] }); 
      
      const messages = await loadSessionMessages(sessionId);
      console.log('Loaded messages count:', messages.length);
      
      // Update state with loaded messages
      set({ chatMessages: messages, isLoadingChat: false });
      
      // Set up subscription to real-time updates
      const subscription = subscribeToSessionMessages(
        sessionId,
        (newMessage) => {
          console.log('New message received in subscription:', newMessage);
          
          set((state) => {
            // Check if message already exists to avoid duplicates
            if (state.chatMessages.some(msg => msg.id === newMessage.id)) {
              console.log('Message already exists, not adding duplicate');
              return { isSendingMessage: false };
            }
            
            console.log('Adding new message to state');
            return {
              chatMessages: [...state.chatMessages, newMessage],
              isSendingMessage: false
            };
          });
        }
      );
      
      // Store subscription for cleanup (not implemented here but good practice)
      // set({ currentSubscription: subscription });
    } catch (error) {
      console.error("Error loading chat messages:", error);
      toast.error('Не удалось загрузить сообщения');
      set({ isLoadingChat: false });
    }
  },
  
  sendChatMessage: async (message: string) => {
    const { user } = get();
    const sessionId = get().currentChatSession;
    
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
      set({ isSendingMessage: true });
      
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
      }));
      
      console.log('Sending chat message:', message);
      
      // Send the message and get updated messages
      const updatedMessages = await sendMessageToUniverse(user.id, sessionId, message);
      console.log('Updated messages after sending:', updatedMessages.length);
      
      // Update all messages to ensure consistent state
      set({ 
        chatMessages: updatedMessages,
        isSendingMessage: false
      });
    } catch (error) {
      console.error("Error sending chat message:", error);
      toast.error('Не удалось отправить сообщение');
      set({ isSendingMessage: false });
    }
  }
});
