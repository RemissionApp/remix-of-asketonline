import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserProfileSlice, createUserProfileSlice } from './slices/userProfileSlice';
import { UISlice, createUISlice } from './slices/uiSlice';
import { MeditationSlice, createMeditationSlice } from './slices/meditationSlice';

export type AppState = UserProfileSlice & UISlice & MeditationSlice;

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        ...createUserProfileSlice(...a),
        ...createUISlice(...a),
        ...createMeditationSlice(...a),
      }),
      {
        name: 'cosmic-storage',
        partialize: (state) => ({
          userProfile: state.userProfile,
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
  store.loadSoundSettings(); // Добавляем загрузку настроек звука
};

// Call this function when your app starts
initializeStore();

export { useAppStore };
