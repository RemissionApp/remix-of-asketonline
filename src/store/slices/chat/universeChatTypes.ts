
import { UniverseChatMessage, UniverseChatSession } from '@/utils/universeChat/types';

/**
 * State interface for the universe chat feature
 */
export interface UniverseChatState {
  // Chat sessions
  chatSessions: UniverseChatSession[];
  isLoadingChatSessions: boolean;
  
  // Current chat
  currentChatSession: string | null;
  chatMessages: UniverseChatMessage[];
  isLoadingChat: boolean;
  isSendingMessage: boolean;
  isUniverseTyping: boolean;
  
  // Actions
  loadChatSessions: () => Promise<void>;
  loadChatMessages: (sessionId: string) => Promise<void>;
  createChatSession: (title: string) => Promise<string | null>;
  setCurrentChatSession: (sessionId: string | null) => Promise<void>;
  sendChatMessage: (message: string, messageType?: 'user' | 'system') => Promise<void>;
  subscribeToChatMessages: (sessionId: string) => Promise<() => void>;
  handleNewChatMessage: (payload: any) => void;
}

// Экспортируем типы из utils/universeChat/types для удобного использования
export type { UniverseChatMessage, UniverseChatSession };
