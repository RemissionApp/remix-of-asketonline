
import { create } from 'zustand';
import { Pact, UniverseQuestion, UserProfile } from '@/types';
import { generateUniverseAnswer } from '@/utils/universeMessages';

type AppLanguage = 'ru' | 'en' | 'es';

interface AppState {
  pacts: Pact[];
  activeQuestions: UniverseQuestion[];
  dailyQuote: string;
  userProfile: UserProfile;
  
  addPact: (pact: Omit<Pact, 'id' | 'createdAt' | 'days'>) => void;
  markDayComplete: (pactId: string) => void;
  askUniverse: (question: string) => UniverseQuestion;
  setActiveScreen: (screen: 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile') => void;
  activeScreen: 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile';
  onboardingComplete: boolean;
  setOnboardingComplete: (completed: boolean) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  syncPactsWithCurrentDate: () => void;
}

// Example quotes
const quotes = [
  "Ты отказываешься от малого, чтобы вместить великое.",
  "В искушении ты проверяешь намерение. Иди до конца.",
  "Каждый день твоей аскезы — нить, соединяющая тебя с высшим.",
  "Истинная сила не в овладении, а в осознанном отказе.",
  "Отбрось то, что тянет тебя вниз, и воспари над обыденностью.",
  "Твоя воля — это мост между намерением и реальностью.",
  "Ограничивая себя внешне, ты расширяешься внутренне."
];

// Helper function to get date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to compare two dates (ignoring time)
const isSameDay = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] === date2.split('T')[0];
};

// Helper function to check if date1 is before or equal to date2
const isDateBeforeOrEqual = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] <= date2.split('T')[0];
};

export const useAppStore = create<AppState>()((set, get) => ({
  pacts: [],
  activeQuestions: [],
  dailyQuote: quotes[Math.floor(Math.random() * quotes.length)],
  userProfile: {
    name: 'Искатель',
    totalDays: 0,
    energyPoints: 0,
    goal: 'Познать свою истинную силу',
    isPro: false
  },
  activeScreen: 'welcome',
  onboardingComplete: false,
  language: 'ru',
  
  setLanguage: (language) => set({ language }),
  setOnboardingComplete: (completed) => set({ onboardingComplete: completed }),
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  updateUserProfile: (profileData) => set((state) => ({
    userProfile: { ...state.userProfile, ...profileData }
  })),
  
  addPact: (pact) => {
    const createdAt = new Date().toISOString();
    const days = Array.from({ length: pact.duration }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    }));
    
    const newPact: Pact = {
      ...pact,
      id: Date.now().toString(),
      createdAt,
      days,
      status: 'active'
    };
    
    set((state) => ({
      pacts: [...state.pacts, newPact]
    }));
    
    // Sync with current date after adding a new pact
    setTimeout(() => {
      get().syncPactsWithCurrentDate();
    }, 0);
  },
  
  markDayComplete: (pactId) => {
    set((state) => {
      const pacts = [...state.pacts];
      const pactIndex = pacts.findIndex(p => p.id === pactId);
      
      if (pactIndex >= 0) {
        const pact = {...pacts[pactIndex]};
        const today = new Date().toISOString().split('T')[0];
        
        // Find first incomplete day
        const dayIndex = pact.days.findIndex(d => !d.completed);
        
        if (dayIndex >= 0) {
          pact.days[dayIndex].completed = true;
          pacts[pactIndex] = pact;
          
          // Check if all days are complete
          const allComplete = pact.days.every(d => d.completed);
          if (allComplete) {
            pact.status = 'completed';
          }
          
          // Update total days in profile
          const totalDays = state.userProfile.totalDays + 1;
          const energyPoints = state.userProfile.energyPoints + 10;
          
          return {
            pacts,
            userProfile: {
              ...state.userProfile,
              totalDays,
              energyPoints
            }
          };
        }
      }
      
      return state;
    });
  },
  
  askUniverse: (question) => {
    const answer = generateUniverseAnswer();
    const newQuestion: UniverseQuestion = {
      id: Date.now().toString(),
      question,
      answer,
      date: new Date().toISOString()
    };
    
    set((state) => ({
      activeQuestions: [newQuestion, ...state.activeQuestions]
    }));
    
    return newQuestion;
  },
  
  syncPactsWithCurrentDate: () => {
    set((state) => {
      const today = new Date();
      const todayString = getDateString(today);
      let totalNewCompletedDays = 0;
      
      const updatedPacts = state.pacts.map(pact => {
        // Skip if pact is already completed
        if (pact.status === 'completed') {
          return pact;
        }
        
        // Create a copy of the pact to update
        const updatedPact = { ...pact };
        let daysChanged = false;
        
        // Loop through each day and check if it should be automatically marked as completed
        updatedPact.days = pact.days.map((day, index) => {
          // Only process if the day is not already completed
          if (!day.completed && isDateBeforeOrEqual(day.date, todayString)) {
            totalNewCompletedDays++;
            daysChanged = true;
            return { ...day, completed: true };
          }
          return day;
        });
        
        // Check if all days are now completed
        if (daysChanged && updatedPact.days.every(day => day.completed)) {
          updatedPact.status = 'completed';
        }
        
        return updatedPact;
      });
      
      // Only update state if there were changes
      if (totalNewCompletedDays > 0) {
        return {
          pacts: updatedPacts,
          userProfile: {
            ...state.userProfile,
            totalDays: state.userProfile.totalDays + totalNewCompletedDays,
            energyPoints: state.userProfile.energyPoints + (totalNewCompletedDays * 10)
          }
        };
      }
      
      return { pacts: updatedPacts };
    });
  }
}));
