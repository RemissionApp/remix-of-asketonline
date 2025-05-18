
import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { UniverseChatState } from './universeChatTypes';
import { 
  createLoadChatSessionsAction,
  createLoadChatMessagesAction,
  createChatSessionAction,
  createSetCurrentChatSessionAction,
  createSendChatMessageAction,
  createSubscribeToChatMessagesAction,
  createHandleNewChatMessageAction
} from './actions';

/**
 * Create the universe chat slice
 */
export const createUniverseChatSlice: StateCreator<
  AppState,
  [],
  [],
  UniverseChatState
> = (set, get, api) => ({
  // State
  chatSessions: [],
  isLoadingChatSessions: false,
  currentChatSession: null,
  chatMessages: [],
  isLoadingChat: false,
  isSendingMessage: false,
  isUniverseTyping: false,
  
  // Actions
  loadChatSessions: createLoadChatSessionsAction(set, get),
  loadChatMessages: createLoadChatMessagesAction(set, get),
  createChatSession: createChatSessionAction(set, get),
  setCurrentChatSession: createSetCurrentChatSessionAction(set, get),
  sendChatMessage: createSendChatMessageAction(set, get),
  subscribeToChatMessages: createSubscribeToChatMessagesAction(set, get),
  handleNewChatMessage: createHandleNewChatMessageAction(set, get)
});
