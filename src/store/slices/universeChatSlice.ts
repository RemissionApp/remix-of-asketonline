
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { 
  UniverseChatMessage, 
  UniverseChatSession,
  createChatSession as createChatSessionUtil,
  loadChatSessions as loadChatSessionsUtil,
  loadSessionMessages,
  sendMessageToUniverse,
  subscribeToSessionMessages
} from '@/utils/universeChat';

export interface UniverseChatSlice {
  chatSessions: UniverseChatSession[];
  currentChatSession: string | null;
  chatMessages: UniverseChatMessage[];
  loadChatSessions: () => Promise<void>;
  createChatSession: (title: string) => Promise<string | null>;
  setCurrentChatSession: (sessionId: string | null) => Promise<void>;
  loadChatMessages: (sessionId: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  isLoadingChat: boolean;
  isSendingMessage: boolean;
}

export const createUniverseChatSlice: StateCreator<AppState, [], [], UniverseChatSlice> = (set, get) => ({
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
      const sessions = await loadChatSessionsUtil(user.id);
      console.log('Loaded chat sessions:', sessions.length);
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
    
    if (!user) return;
    
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
      set({ isLoadingChat: false });
    }
  },
  
  sendChatMessage: async (message: string) => {
    const { user } = get();
    const sessionId = get().currentChatSession;
    
    if (!user || !sessionId) return;
    
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
      set({ isSendingMessage: false });
    }
  }
});
