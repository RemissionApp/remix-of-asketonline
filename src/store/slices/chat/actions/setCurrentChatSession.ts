import { AppState } from '../../../types';
import { UniverseChatState } from '../universeChatTypes';

/**
 * Action creator for setting the current chat session
 */
export const createSetCurrentChatSessionAction =
  <T extends AppState & UniverseChatState>(
    set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
    get: () => T
  ) =>
  async (sessionId: string | null) => {
    try {
      // Clear typing indicator when switching sessions
      set({
        currentChatSession: sessionId,
        isUniverseTyping: false, // Reset typing state when changing sessions
      } as unknown as Partial<T>);

      if (sessionId) {
        await get().loadChatMessages(sessionId);
      } else {
        set({ chatMessages: [] } as unknown as Partial<T>);
      }
    } catch (error) {
      console.error('Error setting current chat session:', error);
      set({
        currentChatSession: null,
        chatMessages: [],
        isUniverseTyping: false,
      } as unknown as Partial<T>);
    }
  };
