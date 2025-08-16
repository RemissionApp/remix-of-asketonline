import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { UniverseChatState } from './universeChatTypes';
import {
  createLoadChatSessionsAction,
  createChatSessionAction,
  createSetCurrentChatSessionAction,
  createLoadChatMessagesAction,
  createSendChatMessageAction,
} from './actions';

/**
 * Actions for universe chat functionality
 */
export interface UniverseChatActions {
  loadChatSessions: () => Promise<void>;
  createChatSession: (title: string) => Promise<string | null>;
  setCurrentChatSession: (sessionId: string | null) => Promise<void>;
  loadChatMessages: (sessionId: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
}

/**
 * Creates universe chat actions
 */
export const createUniverseChatActions = <
  T extends AppState & UniverseChatState,
>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
): UniverseChatActions => ({
  loadChatSessions: createLoadChatSessionsAction(set, get),
  createChatSession: createChatSessionAction(set, get),
  setCurrentChatSession: createSetCurrentChatSessionAction(set, get),
  loadChatMessages: createLoadChatMessagesAction(set, get),
  sendChatMessage: createSendChatMessageAction(set, get),
});
