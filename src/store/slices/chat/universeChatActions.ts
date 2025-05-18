
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
  sendChatMessage: (message: string, isWelcomeMessage?: boolean) => Promise<void>;
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
  
  sendChatMessage: async (message: string, isWelcomeMessage: boolean = false) => {
    const { user } = get();
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
      
      // If this is a welcome message, save it directly as a universe message
      if (isWelcomeMessage) {
        // Save the welcome message directly as coming from the universe
        const universeMessageId = await saveMessage(user.id, sessionId, message, 'universe');
        
        if (!universeMessageId) {
          throw new Error('Failed to save welcome message');
        }
        
        console.log('Welcome message saved with ID:', universeMessageId);
        
        // Load updated messages after saving the welcome message
        const updatedMessages = await loadSessionMessages(sessionId);
        set({ 
          chatMessages: updatedMessages,
          isSendingMessage: false
        } as unknown as Partial<T>);
        
        return;
      }
      
      // Собираем последние 10 сообщений пользователя для контекста
      const recentUserMessages = currentMessages
        .filter(msg => msg.sender === 'user')
        .slice(-10)
        .map(msg => msg.content);
      
      console.log('Recent user messages for context:', recentUserMessages.length);
      
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
      
      // Send the message and get updated messages, включаем историю сообщений
      const updatedMessages = await sendMessageToUniverse(user.id, sessionId, message, recentUserMessages);
      console.log('Updated messages after sending:', updatedMessages.length);
      
      // Update all messages to ensure consistent state
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
