
import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { UniverseChatState, initialUniverseChatState } from './universeChatTypes';
import { UniverseChatActions, createUniverseChatActions } from './universeChatActions';

/**
 * Combined type for universe chat slice
 */
export interface UniverseChatSlice extends UniverseChatState, UniverseChatActions {}

/**
 * Creates the universe chat slice for the Zustand store
 */
export const createUniverseChatSlice: StateCreator<AppState, [], [], UniverseChatSlice> = 
  (set, get, api) => ({
    ...initialUniverseChatState,
    ...createUniverseChatActions(set, get)
  });
