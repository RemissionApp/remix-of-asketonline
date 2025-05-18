
import { AppState } from '../../../types';
import { loadSessionMessages } from '@/utils/universeChat';
import { UniverseChatState } from '../universeChatTypes';
import { toast } from 'sonner';

/**
 * Action creator for loading chat messages for a session
 */
export const createLoadChatMessagesAction = <T extends AppState & UniverseChatState>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => async (sessionId: string) => {
  try {
    set({ isLoadingChat: true } as unknown as Partial<T>);
    
    console.log('Loading chat messages for session:', sessionId);
    
    const messages = await loadSessionMessages(sessionId);
    
    console.log(`Loaded ${messages.length} messages for session ${sessionId}`);
    
    set({ 
      chatMessages: messages,
      isLoadingChat: false 
    } as unknown as Partial<T>);
    
  } catch (error) {
    console.error('Error loading chat messages:', error);
    toast.error('Failed to load chat messages');
    set({ 
      chatMessages: [],
      isLoadingChat: false 
    } as unknown as Partial<T>);
  }
};
