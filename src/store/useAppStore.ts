
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UISlice, createUISlice } from './slices/uiSlice';

export type AppState = UISlice;

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        ...createUISlice(...a),
      }),
      {
        name: 'cosmic-storage',
        partialize: (state) => ({
          activeScreen: state.activeScreen,
          onboardingComplete: state.onboardingComplete,
          language: state.language,
          soundEnabled: state.soundEnabled,
          soundVolume: state.soundVolume
        }),
      }
    )
  )
);

// Load stored settings on app initialization
const initializeStore = () => {
  const store = useAppStore.getState();
  store.checkOnboardingStatus();
  store.loadSoundSettings();
};

// Call this function when your app starts
initializeStore();

export { useAppStore };
