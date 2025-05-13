
import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

export type SupportedLanguage = 'ru' | 'en' | 'es';
export type ActiveScreen = 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation';

interface UserProfile {
  name: string;
  birthDate?: Date;
}

interface AppState {
  language: SupportedLanguage;
  activeScreen: ActiveScreen;
  onboardingComplete: boolean;
  userProfile: UserProfile;
  session: Session | null;
  user: User | null;
  
  setLanguage: (language: SupportedLanguage) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  language: 'en',
  activeScreen: 'welcome',
  onboardingComplete: false,
  userProfile: {
    name: 'User',
  },
  session: null,
  user: null,
  
  setLanguage: (language) => set({ language }),
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
  setUserProfile: (profile) => set((state) => ({ 
    userProfile: { ...state.userProfile, ...profile } 
  })),
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
}));
