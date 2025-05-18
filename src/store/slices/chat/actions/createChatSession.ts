
import { AppState } from '../../../types';
import { toast } from 'sonner';
import { createChatSession as createChatSessionUtil } from '@/utils/universeChat';
import { UniverseChatState } from '../universeChatTypes';

/**
 * Action creator for creating a new chat session
 */
export const createCreateChatSessionAction = <T extends AppState & UniverseChatState>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => async (title: string) => {
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
};
