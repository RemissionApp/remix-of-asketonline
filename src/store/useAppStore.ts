import { create } from 'zustand';
import { Pact, UniverseQuestion, UserProfile, SpiritualRank, Achievement, Mission } from '@/types';
import { generateUniverseAnswer } from '@/utils/universeMessages';

type AppLanguage = 'ru' | 'en' | 'es';

// Update the type definition to include 'comparison' and 'meditation'
type ActiveScreen = 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation';

interface AppState {
  pacts: Pact[];
  activeQuestions: UniverseQuestion[];
  dailyQuote: string;
  userProfile: UserProfile;
  
  addPact: (pact: Omit<Pact, 'id' | 'createdAt' | 'days'>) => void;
  markDayComplete: (pactId: string) => void;
  askUniverse: (question: string) => UniverseQuestion;
  setActiveScreen: (screen: ActiveScreen) => void;
  activeScreen: ActiveScreen;
  onboardingComplete: boolean;
  setOnboardingComplete: (completed: boolean) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  syncPactsWithCurrentDate: () => void;
  
  // Existing functions for gamification
  addEnergyPoints: (points: number) => void;
  checkRankProgress: () => SpiritualRank;
  unlockAchievement: (achievementId: string) => void;
  assignMission: () => void;
  completeMission: () => void;
  
  // New functions for PRO features
  upgradeToPro: () => void;
  cancelProSubscription: () => void;
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

// Достижения
const defaultAchievements: Achievement[] = [
  {
    id: 'first-pact',
    title: 'Первый договор',
    description: 'Заключите свой первый договор с Вселенной',
    icon: 'scroll',
    unlocked: false
  },
  {
    id: '7-days-streak',
    title: '7 дней подряд',
    description: 'Соблюдайте аскезу 7 дней подряд',
    icon: 'calendar',
    unlocked: false
  },
  {
    id: '30-days-streak',
    title: '30 дней подряд',
    description: 'Соблюдайте аскезу 30 дней подряд',
    icon: 'award',
    unlocked: false
  },
  {
    id: 'first-question',
    title: 'Первый разговор',
    description: 'Задайте первый вопрос Вселенной',
    icon: 'message-square',
    unlocked: false
  }
];

// Доступные миссии
const availableMissions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Первые шаги аскета',
    description: 'Соблюдайте свою первую аскезу три дня подряд и получите энергетические очки',
    requirements: ['Соблюдать аскезу 3 дня подряд'],
    reward: {
      energyPoints: 30
    },
    completed: false
  },
  {
    id: 'mission-2',
    title: 'Разговор с Вселенной',
    description: 'Задайте три вопроса Вселенной и получите дополнительную мудрость',
    requirements: ['Задать 3 вопроса Вселенной'],
    reward: {
      energyPoints: 50,
      achievement: 'universe-seeker'
    },
    completed: false
  }
];

// Требования для рангов
const rankRequirements = {
  seeker: 0,
  pilgrim: 10,
  warrior: 30,
  master: 90,
  enlightened: 365
};

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
    isPro: false, // Add isPro property to userProfile
    rank: 'seeker',
    achievements: [...defaultAchievements]
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
    
    set((state) => {
      // Проверка на первую аскезу для достижения
      const isFirstPact = state.pacts.length === 0;
      if (isFirstPact) {
        const updatedAchievements = state.userProfile.achievements.map(a => 
          a.id === 'first-pact' ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
        );
        
        return {
          pacts: [...state.pacts, newPact],
          userProfile: {
            ...state.userProfile,
            achievements: updatedAchievements,
            energyPoints: state.userProfile.energyPoints + 20 // Бонус за первую аскезу
          }
        };
      }
      
      return {
        pacts: [...state.pacts, newPact]
      };
    });
    
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
          const updatedProfile = {
            ...state.userProfile,
            totalDays,
            energyPoints
          };
          
          // Проверка на достижения по накопленным дням
          let updatedAchievements = [...updatedProfile.achievements];
          
          // Проверяем 7-дневную серию
          const consecutiveDays = pact.days.filter(d => d.completed).length;
          if (consecutiveDays >= 7) {
            updatedAchievements = updatedAchievements.map(a => 
              a.id === '7-days-streak' && !a.unlocked ? 
                { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
            );
          }
          
          // Проверяем 30-дневную серию
          if (consecutiveDays >= 30) {
            updatedAchievements = updatedAchievements.map(a => 
              a.id === '30-days-streak' && !a.unlocked ? 
                { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
            );
          }
          
          updatedProfile.achievements = updatedAchievements;
          
          // Проверяем, нужно ли повысить ранг
          const newRank = get().checkRankProgress();
          if (newRank !== updatedProfile.rank) {
            updatedProfile.rank = newRank;
            updatedProfile.energyPoints += 50; // Бонус за повышение ранга
          }
          
          return {
            pacts,
            userProfile: updatedProfile
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
    
    set((state) => {
      // Проверка на первый вопрос для достижения
      const isFirstQuestion = state.activeQuestions.length === 0;
      const updatedProfile = { ...state.userProfile };
      
      if (isFirstQuestion) {
        updatedProfile.achievements = updatedProfile.achievements.map(a => 
          a.id === 'first-question' ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
        );
        updatedProfile.energyPoints += 15; // Бонус за первый вопрос
      } else {
        updatedProfile.energyPoints += 5; // Обычные очки за вопрос
      }
      
      return {
        activeQuestions: [newQuestion, ...state.activeQuestions],
        userProfile: updatedProfile
      };
    });
    
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
        const updatedProfile = {
          ...state.userProfile,
          totalDays: state.userProfile.totalDays + totalNewCompletedDays,
          energyPoints: state.userProfile.energyPoints + (totalNewCompletedDays * 10)
        };
        
        // Проверяем, нужно ли повысить ранг после обновления дней
        const newRank = get().checkRankProgress();
        if (newRank !== updatedProfile.rank) {
          updatedProfile.rank = newRank;
          updatedProfile.energyPoints += 50; // Бонус за повышение ранга
        }
        
        return {
          pacts: updatedPacts,
          userProfile: updatedProfile
        };
      }
      
      return { pacts: updatedPacts };
    });
  },
  
  // Existing functions for gamification
  addEnergyPoints: (points) => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        energyPoints: state.userProfile.energyPoints + points
      }
    }));
  },
  
  checkRankProgress: () => {
    const { userProfile } = get();
    const { totalDays } = userProfile;
    
    if (totalDays >= rankRequirements.enlightened) return 'enlightened';
    if (totalDays >= rankRequirements.master) return 'master';
    if (totalDays >= rankRequirements.warrior) return 'warrior';
    if (totalDays >= rankRequirements.pilgrim) return 'pilgrim';
    return 'seeker';
  },
  
  unlockAchievement: (achievementId) => {
    set((state) => {
      const updatedAchievements = state.userProfile.achievements.map(a => 
        a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
      );
      
      return {
        userProfile: {
          ...state.userProfile,
          achievements: updatedAchievements,
          energyPoints: state.userProfile.energyPoints + 20 // Бонус за достижение
        }
      };
    });
  },
  
  assignMission: () => {
    set((state) => {
      // Если уже есть активная миссия, не назначаем новую
      if (state.userProfile.activeMission) return state;
      
      // Выбираем случайную миссию из доступных
      const availableMissionsCopy = [...availableMissions].filter(m => !m.completed);
      if (availableMissionsCopy.length === 0) return state;
      
      const randomIndex = Math.floor(Math.random() * availableMissionsCopy.length);
      const selectedMission = { ...availableMissionsCopy[randomIndex] };
      
      return {
        userProfile: {
          ...state.userProfile,
          activeMission: selectedMission
        }
      };
    });
  },
  
  completeMission: () => {
    set((state) => {
      if (!state.userProfile.activeMission) return state;
      
      const { reward } = state.userProfile.activeMission;
      let updatedProfile = {
        ...state.userProfile,
        energyPoints: state.userProfile.energyPoints + reward.energyPoints,
        activeMission: undefined
      };
      
      // Если миссия дает достижение, разблокируем его
      if (reward.achievement) {
        updatedProfile.achievements = updatedProfile.achievements.map(a => 
          a.id === reward.achievement ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
        );
      }
      
      return {
        userProfile: updatedProfile
      };
    });
  },
  
  // New functions for PRO subscription
  upgradeToPro: () => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        isPro: true,
        energyPoints: state.userProfile.energyPoints + 100 // Bonus points for upgrading
      }
    }));
  },
  
  cancelProSubscription: () => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        isPro: false
      }
    }));
  }
}));
