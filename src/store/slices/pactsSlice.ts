
// This file is now a lightweight wrapper around the modular pacts structure
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { createPactsSlice as originalCreatePactsSlice, PactsSlice } from './pacts';

// Re-export the PactsSlice type
export type { PactsSlice } from './pacts';

// Export the slice creator function
export const createPactsSlice: StateCreator<AppState, [], [], PactsSlice> = (set, get, api) => {
  return originalCreatePactsSlice(set, get, api);
};
