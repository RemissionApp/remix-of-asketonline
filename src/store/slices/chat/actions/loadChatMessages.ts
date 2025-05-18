
import { AppState } from '../../../types';
import { toast } from 'sonner';
import { loadSessionMessages, subscribeToSessionMessages } from '@/utils/universeChat';
import { UniverseChatState } from '../universeChatTypes';

/**
 * Action creator for loading chat messages
 */
export const createLoadChatMessagesAction = <T extends AppState & UniverseChatState>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => async (sessionId: string) => {
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
};
