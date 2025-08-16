import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { PactsState } from './types';
import { createAddPactSlice, AddPactSlice } from './addPact';
import {
  createMarkDayCompleteSlice,
  MarkDayCompleteSlice,
} from './markDayComplete';
import { createBreakAscesisSlice, BreakAscesisSlice } from './breakAscesis';
import { createLoadPactsSlice, LoadPactsSlice } from './loadPacts';
import {
  createSyncPactsSlice,
  SyncPactsSlice,
} from './syncPactsWithCurrentDate';

// Combined types for PactsSlice
export interface PactsSlice
  extends PactsState,
    AddPactSlice,
    MarkDayCompleteSlice,
    BreakAscesisSlice,
    LoadPactsSlice,
    SyncPactsSlice {}

// Main creator function that combines all pact slice creators
export const createPactsSlice: StateCreator<AppState, [], [], PactsSlice> = (
  set,
  get,
  api
) => {
  return {
    // Initial state
    pacts: [],

    // Combine all the slice creators
    ...createAddPactSlice(set, get),
    ...createMarkDayCompleteSlice(set, get),
    ...createBreakAscesisSlice(set, get),
    ...createLoadPactsSlice(set, get),
    ...createSyncPactsSlice(set, get),
  };
};
