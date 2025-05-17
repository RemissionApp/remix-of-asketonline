
// This file is now a lightweight wrapper around the modular pacts structure
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { createPactsSlice, PactsSlice } from './pacts';

// Re-export the createPactsSlice function
export { PactsSlice } from './pacts';

// Export the slice creator directly
export const createPactsSlice: StateCreator<AppState, [], [], PactsSlice> = (set, get, api) => {
  return createPactsSlice(set, get, api);
};
