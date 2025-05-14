
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupportedLanguage } from '@/hooks/useTranslations';
import { Pact, PactStatus, Mission, PactDay, UniverseQuestion } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Define types
export interface UserProfile {
  name: string;
  birthDate: Date | null;
  rank: 'seeker' | 'pilgrim' | 'warrior' | 'master' | 'enlightened';
  level: number;
  experience: number;
  isPro: boolean;
  energyPoints: number; // Added missing property
}

// Quote type
export interface Quote {
  text: string;
  author: string;
}

interface AppState {
  // Navigation
  activeScreen: 'welcome' | 'language' | 'signin' | 'signup' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation';
  setActiveScreen: (screen: AppState['activeScreen']) => void;
  
  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  
  // Language
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  upgradeToPro: () => void;
  cancelProSubscription: () => void;

  // Pacts
  pacts: Pact[];
  addPact: (pactData: { title: string; duration: number; reward: string; status: PactStatus }) => void;
  markDayComplete: (pactId: string) => void;
  syncPactsWithCurrentDate: () => void;
  
  // Daily Quote
  dailyQuote: Quote;
  
  // Missions
  completeMission: (missionId: string) => void;
  
  // Universe Questions
  universeQuestions: UniverseQuestion[];
  addUniverseQuestion: (question: string, answer: string) => void;
}

// Create store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      activeScreen: 'welcome',
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      
      // Onboarding
      onboardingComplete: false,
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      
      // Language
      language: 'ru', // Default language
      setLanguage: (language) => set({ language }),
      
      // User Profile
      userProfile: {
        name: 'Искатель',
        birthDate: null,
        rank: 'seeker',
        level: 1,
        experience: 0,
        isPro: false,
        energyPoints: 100, // Default energy points
      },
      updateUserProfile: (updates) => set((state) => ({
        userProfile: { ...state.userProfile, ...updates }
      })),
      upgradeToPro: () => set((state) => ({
        userProfile: { ...state.userProfile, isPro: true }
      })),
      cancelProSubscription: () => set((state) => ({
        userProfile: { ...state.userProfile, isPro: false }
      })),
      
      // Pacts
      pacts: [],
      addPact: (pactData) => set((state) => {
        const today = new Date();
        const days: PactDay[] = [];
        
        // Create day entries for the duration
        for (let i = 0; i < pactData.duration; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          days.push({
            date: date.toISOString().split('T')[0],
            completed: false
          });
        }
        
        const newPact: Pact = {
          id: uuidv4(),
          title: pactData.title,
          duration: pactData.duration,
          days,
          reward: pactData.reward,
          status: pactData.status,
          createdAt: today.toISOString()
        };
        
        return { pacts: [...state.pacts, newPact] };
      }),
      markDayComplete: (pactId) => set((state) => {
        const updatedPacts = state.pacts.map(pact => {
          if (pact.id === pactId) {
            const today = new Date().toISOString().split('T')[0];
            const updatedDays = pact.days.map(day => {
              if (day.date === today) {
                return { ...day, completed: true };
              }
              return day;
            });
            
            return { ...pact, days: updatedDays };
          }
          return pact;
        });
        
        // Update user energy points
        return { 
          pacts: updatedPacts,
          userProfile: {
            ...state.userProfile,
            energyPoints: state.userProfile.energyPoints + 10, // Add 10 points per completed day
            experience: state.userProfile.experience + 5 // Add 5 XP per completed day
          }
        };
      }),
      syncPactsWithCurrentDate: () => set((state) => {
        // Logic to sync pacts with the current date
        // For now, we'll just return the current state
        return state;
      }),
      
      // Daily Quote
      dailyQuote: {
        text: "Твоя сила растёт с каждым днем отказа от слабости.",
        author: "Древняя мудрость"
      },
      
      // Missions
      completeMission: (missionId) => set((state) => {
        // Implement the mission completion logic here
        // For now, we'll just add experience points
        return {
          userProfile: {
            ...state.userProfile,
            experience: state.userProfile.experience + 20,
            energyPoints: state.userProfile.energyPoints + 30
          }
        };
      }),
      
      // Universe Questions
      universeQuestions: [],
      addUniverseQuestion: (question, answer) => set((state) => {
        const newQuestion: UniverseQuestion = {
          id: uuidv4(),
          question,
          answer,
          date: new Date().toISOString()
        };
        
        return { universeQuestions: [...state.universeQuestions, newQuestion] };
      })
    }),
    {
      name: 'asket-storage', // Name for localStorage
    }
  )
);
