
import { UniverseChatMessage, UniverseChatSession } from '@/utils/universeChat';

/**
 * State interface for universe chat functionality
 */
export interface UniverseChatState {
  chatSessions: UniverseChatSession[];
  currentChatSession: string | null;
  chatMessages: UniverseChatMessage[];
  isLoadingChat: boolean;
  isSendingMessage: boolean;
  isUniverseTyping: boolean; // New state to track when universe is typing
}

/**
 * Initial state for universe chat
 */
export const initialUniverseChatState: UniverseChatState = {
  chatSessions: [],
  currentChatSession: null,
  chatMessages: [],
  isLoadingChat: false,
  isSendingMessage: false,
  isUniverseTyping: false // Initialize as not typing
};
