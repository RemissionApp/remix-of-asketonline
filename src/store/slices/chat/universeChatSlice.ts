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
  createHandleNewChatMessageAction,
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
  loadChatSessions: createLoadChatSessionsAction(
    set,
    get as () => AppState & UniverseChatState
  ),
  loadChatMessages: createLoadChatMessagesAction(
    set,
    get as () => AppState & UniverseChatState
  ),
  createChatSession: createChatSessionAction(
    set,
    get as () => AppState & UniverseChatState
  ),
  setCurrentChatSession: createSetCurrentChatSessionAction(
    set,
    get as () => AppState & UniverseChatState
  ),
  sendChatMessage: createSendChatMessageAction(
    set,
    get as () => AppState & UniverseChatState
  ),
  subscribeToChatMessages: createSubscribeToChatMessagesAction(
    set,
    get as () => AppState & UniverseChatState
  ),
  handleNewChatMessage: createHandleNewChatMessageAction(
    set,
    get as () => AppState & UniverseChatState
  ),
});
