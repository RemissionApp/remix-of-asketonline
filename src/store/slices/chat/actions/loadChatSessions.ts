import { AppState } from '../../../types';
import { toast } from 'sonner';
import { loadChatSessions as loadChatSessionsUtil } from '@/utils/universeChat';
import { UniverseChatState } from '../universeChatTypes';

/**
 * Action creator for loading chat sessions
 */
export const createLoadChatSessionsAction =
  <T extends AppState & UniverseChatState>(
    set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
    get: () => T
  ) =>
  async () => {
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
        isLoadingChat: false,
      } as unknown as Partial<T>);

      // Auto-select most recent session if none is selected
      if (!get().currentChatSession && sessions.length > 0) {
        set({ currentChatSession: sessions[0].id } as unknown as Partial<T>);
        await get().loadChatMessages(sessions[0].id);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toast.error('Не удалось загрузить беседы');
      set({ isLoadingChat: false } as unknown as Partial<T>);
    }
  };
