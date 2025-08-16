import { AppState } from '../../../types';
import { UniverseChatState } from '../universeChatTypes';

/**
 * Action creator for handling new chat messages from realtime subscription
 */
export const createHandleNewChatMessageAction =
  <T extends AppState & UniverseChatState>(
    set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
    get: () => T
  ) =>
  (payload: any) => {
    try {
      const { new: newMessage } = payload;
      const { chatMessages, currentChatSession } = get();

      // Only update messages if they match the current session
      if (newMessage && newMessage.session_id === currentChatSession) {
        console.log('Adding new message to state:', newMessage);

        // Update messages state
        set(
          state =>
            ({
              chatMessages: [...state.chatMessages, newMessage],
              isUniverseTyping: false, // Reset typing indicator when message arrives
            }) as unknown as Partial<T>
        );
      }
    } catch (error) {
      console.error('Error handling new chat message:', error);
    }
  };
