
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { createUniverseQuestionSlice, UniverseQuestionSlice } from './universeQuestionSlice';
import { createUniverseChatSlice, UniverseChatSlice } from './universeChatSlice';

// Combined interface that includes both question and chat functionality
export interface UniverseSlice extends UniverseQuestionSlice, UniverseChatSlice {}

// Create the combined universe slice
export const createUniverseSlice: StateCreator<AppState, [], [], UniverseSlice> = (set, get, api) => ({
  // Merge the question and chat slices
  ...createUniverseQuestionSlice(set, get, api),
  ...createUniverseChatSlice(set, get, api)
});
