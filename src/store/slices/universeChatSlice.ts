
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
  setCurrentChatSession: (sessionId: string | null) => void;
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
      console.log('Loaded chat sessions:', sessions);
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
    console.log('Setting current chat session:', sessionId);
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
      console.log('Loading chat messages for session:', sessionId);
      set({ isLoadingChat: true, chatMessages: [] }); // Clear messages while loading
      const messages = await loadSessionMessages(sessionId);
      console.log('Loaded messages in slice:', messages);
      
      set({ chatMessages: messages, isLoadingChat: false });
      
      // Set up subscription to real-time updates
      const subscription = subscribeToSessionMessages(
        sessionId,
        (newMessage) => {
          console.log('New message received in subscription handler:', newMessage);
          set((state) => {
            // Check if this message already exists in the state
            if (state.chatMessages.some(msg => msg.id === newMessage.id)) {
              console.log('Message already exists in state, not adding duplicate');
              return state;
            }
            
            console.log('Adding new message to state');
            return {
              chatMessages: [...state.chatMessages, newMessage],
              isSendingMessage: false // Make sure to reset sending state when new message arrives
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
      
      // Add message to state immediately for better UX
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
      const updatedMessages = await sendMessageToUniverse(user.id, sessionId, message);
      console.log('Updated messages after sending:', updatedMessages);
      
      // Update all messages to ensure consistent state
      set({ chatMessages: updatedMessages, isSendingMessage: false });
    } catch (error) {
      console.error("Error sending chat message:", error);
      set({ isSendingMessage: false });
    }
  }
});
