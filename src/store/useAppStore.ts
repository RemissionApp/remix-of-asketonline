import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { SupportedLanguage } from '@/i18n/translations';
import type { Session, User } from '@supabase/supabase-js';
import { Pact, PactStatus, UniverseQuestion, UserProfile, SpiritualRank } from '@/types';

interface AppState {
  activeScreen: string;
  language: SupportedLanguage;
  userProfile: UserProfile;
  onboardingComplete: boolean;
  pacts: Pact[];
  dailyQuote: string;
  activeQuestions: UniverseQuestion[];
  session: Session | null;
  user: User | null;
  
  setActiveScreen: (screen: string) => void;
  setLanguage: (language: SupportedLanguage) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  markOnboardingComplete: () => void;
  
  // Authentication
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  
  // Pacts
  addPact: (title: string, duration: number, reward: string) => void;
  markDayComplete: (pactId: string) => void;
  syncPactsWithCurrentDate: () => void;
  
  // Universe
  askUniverse: (question: string) => string;
  
  // Pro features
  upgradeToPro: () => void;
  cancelProSubscription: () => void;
  
  // Missions
  completeMission: (missionId: string) => void;
}

// Generate random cosmos wisdom quotes
const cosmicQuotes = [
  "Тьма — это всего лишь отсутствие света. Найди свет внутри себя.",
  "Вселенная не наказывает и не награждает. Она просто откликается на твои вибрации.",
  "Каждое испытание — это приглашение к росту и трансформации.",
  "Самая великая свобода — это свобода от своего эго.",
  "То, что ты ищешь, тоже ищет тебя.",
  "Путь к мастерству начинается с того, что ты действуешь так, будто уже достиг его.",
  "Вознесение — это не уход от реальности. Это полное принятие всего, что есть.",
  "The darkness is just an absence of light. Find the light within you.",
  "The universe doesn't punish or reward. It simply responds to your vibrations.",
  "Every challenge is an invitation for growth and transformation.",
  "The greatest freedom is freedom from your ego.",
  "What you seek is also seeking you.",
  "The path to mastery begins by acting as if you've already achieved it.",
  "Ascension isn't an escape from reality. It's a complete acceptance of all that is.",
];

// Universe wisdom messages
const universeMessages = [
  {
    question: "Как мне найти свой путь?",
    answer: "Твой путь уже найден, просто ты его пока не осознал. Смотри внутрь, а не наружу."
  },
  {
    question: "How can I find my path?",
    answer: "Your path is already found, you just haven't realized it yet. Look inward, not outward."
  },
];

const defaultUserProfile: UserProfile = {
  name: 'Искатель',
  totalDays: 0,
  energyPoints: 0,
  goal: '',
  isPro: false,
  rank: 'seeker',
  achievements: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeScreen: 'welcome',
      language: 'ru',
      userProfile: defaultUserProfile,
      onboardingComplete: false,
      pacts: [],
      dailyQuote: cosmicQuotes[Math.floor(Math.random() * cosmicQuotes.length)],
      activeQuestions: [],
      session: null,
      user: null,
      
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      setLanguage: (language) => set({ language }),
      updateUserProfile: (data) => set((state) => ({ 
        userProfile: { ...state.userProfile, ...data } 
      })),
      markOnboardingComplete: () => set({ onboardingComplete: true }),
      
      // Authentication
      setSession: (session) => set({ session }),
      setUser: (user) => set({ user }),
      
      // Pacts
      addPact: (title, duration, reward) => {
        const days = Array(duration).fill(null).map((_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false
        }));
        
        const newPact: Pact = {
          id: uuidv4(),
          title,
          duration,
          days,
          reward,
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({ pacts: [...state.pacts, newPact] }));
      },
      
      markDayComplete: (pactId) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          
          const updatedPacts = state.pacts.map(pact => {
            if (pact.id !== pactId) return pact;
            
            // Find today's day entry
            const todayIndex = pact.days.findIndex(day => day.date === today);
            if (todayIndex === -1) return pact;
            
            // Create a new days array with today marked as complete
            const updatedDays = [...pact.days];
            updatedDays[todayIndex] = { ...updatedDays[todayIndex], completed: true };
            
            // Check if pact is completed
            const completedCount = updatedDays.filter(day => day.completed).length;
            const status: PactStatus = completedCount === pact.duration ? 'completed' : 'active';
            
            return { ...pact, days: updatedDays, status };
          });
          
          // Update user profile with energy points and total days
          const updatedProfile = { ...state.userProfile };
          updatedProfile.totalDays += 1;
          updatedProfile.energyPoints += 10;
          
          // Check for rank upgrades
          if (updatedProfile.totalDays >= 100) {
            updatedProfile.rank = 'enlightened';
          } else if (updatedProfile.totalDays >= 50) {
            updatedProfile.rank = 'master';
          } else if (updatedProfile.totalDays >= 25) {
            updatedProfile.rank = 'warrior';
          } else if (updatedProfile.totalDays >= 10) {
            updatedProfile.rank = 'pilgrim';
          }
          
          return { 
            pacts: updatedPacts,
            userProfile: updatedProfile,
            dailyQuote: cosmicQuotes[Math.floor(Math.random() * cosmicQuotes.length)]
          };
        });
      },
      
      syncPactsWithCurrentDate: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          
          const updatedPacts = state.pacts.map(pact => {
            // Skip completed or broken pacts
            if (pact.status !== 'active') return pact;
            
            // Check if the pact has today's entry
            const hasToday = pact.days.some(day => day.date === today);
            
            // If today is already in the pact days, return as is
            if (hasToday) return pact;
            
            // Get the latest day in the pact
            const latestDay = pact.days.reduce((latest, current) => {
              return new Date(current.date) > new Date(latest.date) ? current : latest;
            }, pact.days[0]);
            
            // Calculate days passed since latest day
            const latestDate = new Date(latestDay.date);
            const todayDate = new Date(today);
            const daysPassed = Math.floor((todayDate.getTime() - latestDate.getTime()) / (24 * 60 * 60 * 1000));
            
            // If more than 1 day passed and previous day was not completed, mark pact as broken
            if (daysPassed > 1 && !latestDay.completed) {
              return { ...pact, status: 'broken' as PactStatus };
            }
            
            // Add today to the pact days
            const updatedDays = [...pact.days, { date: today, completed: false }];
            
            return { ...pact, days: updatedDays };
          });
          
          return { pacts: updatedPacts };
        });
      },
      
      // Universe
      askUniverse: (question) => {
        // Find a matching question or generate a new answer
        const existingMessage = universeMessages.find(
          m => m.question.toLowerCase() === question.toLowerCase()
        );
        
        const answer = existingMessage?.answer || 
          "Вселенная слышит твой вопрос. Ответ придет, когда ты будешь готов его услышать.";
        
        set((state) => {
          const newQuestion: UniverseQuestion = {
            id: uuidv4(),
            question,
            answer,
            date: new Date().toISOString()
          };
          
          return { 
            activeQuestions: [...state.activeQuestions, newQuestion],
            userProfile: {
              ...state.userProfile,
              energyPoints: state.userProfile.energyPoints + 5
            }
          };
        });
        
        return answer;
      },
      
      // Pro features
      upgradeToPro: () => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            isPro: true
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
      },
      
      // Missions
      completeMission: (missionId) => {
        set((state) => {
          const { userProfile } = state;
          
          if (!userProfile.activeMission) return { userProfile };
          
          if (userProfile.activeMission.id !== missionId) return { userProfile };
          
          // Mark mission as completed and add rewards
          const completedMission = {
            ...userProfile.activeMission,
            completed: true
          };
          
          const updatedProfile = {
            ...userProfile,
            activeMission: undefined,
            energyPoints: userProfile.energyPoints + completedMission.reward.energyPoints
          };
          
          return { userProfile: updatedProfile };
        });
      }
    }),
    {
      name: 'ascesis-app-storage'
    }
  )
);
