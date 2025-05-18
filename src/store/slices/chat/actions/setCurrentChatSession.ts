
import { AppState } from '../../../types';
import { UniverseChatState } from '../universeChatTypes';

/**
 * Action creator for setting the current chat session
 */
export const createSetCurrentChatSessionAction = <T extends AppState & UniverseChatState>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => async (sessionId: string | null) => {
  console.log('Setting current chat session:', sessionId);
  
  // Important: Set the session ID first before loading messages
  set({ currentChatSession: sessionId } as unknown as Partial<T>);
  
  if (sessionId) {
    // Then load messages for the selected session
    await get().loadChatMessages(sessionId);
  } else {
    set({ chatMessages: [] } as unknown as Partial<T>);
  }
};
