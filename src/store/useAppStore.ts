
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Achievement, AppNotification, AppSettings, DailyReflection, MeditationSession, Pact, PactItem, SpiritualRank, UniverseQuestion, UserProfile, Mission } from '@/types';
import { persist, createJSONStorage } from 'zustand/middleware';

// Default user profile
const defaultUserProfile: UserProfile = {
  id: '', 
  name: 'Искатель',
  email: '',
  avatar_url: null,
  rank: 'seeker',
  level: 1,
  experience: 0,
  isPro: false, 
  birthDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  totalDays: 0,
  energyPoints: 0,
  goal: '',
  achievements: [],
  activeMission: undefined
};

// Sample daily quote
const defaultDailyQuote = {
  text: "Чем больше вы отказываетесь от мирских удовольствий, тем ближе вы к истинной гармонии.",
  author: "Древняя мудрость"
};

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Первый медитация',
    description: 'Завершите свою первую медитацию',
    icon: '🧘‍♂️',
    achievementType: 'meditation',
    unlockedAt: null,
    unlocked: false
  },
  {
    id: '2',
    title: 'Первый пакт',
    description: 'Создайте свой первый пакт',
    icon: '🤝',
    achievementType: 'pact',
    unlockedAt: null,
    unlocked: false
  },
  {
    id: '3',
    title: 'Первый вопрос вселенной',
    description: 'Задайте свой первый вопрос вселенной',
    icon: '❓',
    achievementType: 'universeQuestion',
    unlockedAt: null,
    unlocked: false
  },
  {
    id: '4',
    title: 'Первый дневник',
    description: 'Заполните свой первый дневник',
    icon: '✍️',
    achievementType: 'dailyReflection',
    unlockedAt: null,
    unlocked: false
  }
];

// Default pact items
const defaultPactItems: PactItem[] = [
  {
    id: '1',
    title: 'Медитация 10 минут',
    description: 'Медитируйте 10 минут каждый день',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Задайте вопрос вселенной',
    description: 'Задайте вопрос вселенной каждый день',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Заполните дневник',
    description: 'Заполните дневник каждый день',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Default app settings
const defaultAppSettings: AppSettings = {
  darkMode: false,
  notifications: true,
  language: 'ru',
  soundEnabled: true
};

// Function to map database achievement to Achievement type
const mapDbAchievementToAchievement = (dbAchievement: any): Achievement => {
  return {
    id: dbAchievement.id,
    title: dbAchievement.title,
    description: dbAchievement.description,
    icon: dbAchievement.icon,
    achievementType: dbAchievement.achievement_type,
    unlockedAt: dbAchievement.unlocked_at,
    unlocked: !!dbAchievement.unlocked_at
  };
};

// Function to map database question to UniverseQuestion type
const mapDbQuestionToQuestion = (dbQuestion: any): UniverseQuestion => {
  return {
    id: dbQuestion.id,
    question: dbQuestion.question,
    answer: dbQuestion.answer,
    createdAt: dbQuestion.created_at,
    date: new Date(dbQuestion.created_at).toLocaleDateString()
  };
};

// Define the AppStore interface
interface AppStore {
  user: any;
  userProfile: UserProfile;
  achievements: Achievement[];
  universeQuestions: UniverseQuestion[];
  activeQuestions: UniverseQuestion[];
  pacts: Pact[];
  pactItems: PactItem[];
  meditationSessions: MeditationSession[];
  dailyReflections: DailyReflection[];
  notifications: AppNotification[];
  settings: AppSettings;
  activeScreen: string;
  language: string;
  loading: boolean;
  error: any;
  dailyQuote: { text: string, author: string };
  onboardingComplete: boolean;

  setUser: (user: any) => void;
  setLanguage: (language: string) => void;
  setActiveScreen: (screen: string) => void;
  setOnboardingComplete: (complete: boolean) => void;
  
  // User Profile Actions
  fetchUserProfile: (userId: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  // Achievement Actions
  fetchUserAchievements: (userId: string) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  
  // Universe Question Actions
  fetchUniverseQuestions: (userId: string) => Promise<void>;
  addUniverseQuestion: (question: string, answer: string) => Promise<void>;
  askUniverse: (question: string) => Promise<string>;
  
  // Pact Actions
  fetchUserPacts: (userId: string) => Promise<void>;
  createPact: (pact: Omit<Pact, 'id' | 'createdAt' | 'days'>) => Promise<void>;
  updatePact: (pactId: string, updates: Partial<Pact>) => Promise<void>;
  deletePact: (pactId: string) => Promise<void>;
  addPact: (pact: { title: string, duration: number, reward: string, status: string }) => void;
  markDayComplete: (pactId: string) => void;
  syncPactsWithCurrentDate: () => void;
  
  // Pact Item Actions
  addPactItem: (item: Omit<PactItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePactItem: (itemId: string, updates: Partial<PactItem>) => Promise<void>;
  deletePactItem: (itemId: string) => Promise<void>;
  
  // Meditation Session Actions
  addMeditationSession: (session: Omit<MeditationSession, 'id' | 'completedAt' >) => Promise<void>;
  fetchMeditationSessions: (userId: string) => Promise<void>;
  
  // Daily Reflection Actions
  addDailyReflection: (reflection: Omit<DailyReflection, 'id' | 'date'>) => Promise<void>;
  fetchDailyReflections: (userId: string) => Promise<void>;
  
  // Notification Actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  fetchNotifications: (userId: string) => Promise<void>;
  
  // Settings Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Pro Subscription Actions
  upgradeToPro: () => void;
  cancelProSubscription: () => void;
  
  // Mission actions
  completeMission: () => void;
}

// Create the store
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      userProfile: defaultUserProfile,
      achievements: defaultAchievements,
      universeQuestions: [],
      activeQuestions: [],
      pacts: [],
      pactItems: defaultPactItems,
      meditationSessions: [],
      dailyReflections: [],
      notifications: [],
      settings: defaultAppSettings,
      activeScreen: 'main',
      language: defaultAppSettings.language,
      loading: false,
      error: null,
      dailyQuote: defaultDailyQuote,
      onboardingComplete: false,

      setUser: (user) => set({ user }),
      setLanguage: (language) => set({ language }),
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

      // --- User Profile Actions ---
      fetchUserProfile: async (userId: string) => {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (profileError) throw profileError;
          
          if (profileData) {
            // Map the database fields to UserProfile structure
            const updatedProfile: UserProfile = {
              id: profileData.id,
              name: profileData.name,
              email: get().user?.email || '', // Will be filled from auth user
              avatar_url: profileData.avatar_url,
              rank: profileData.rank as SpiritualRank,
              level: 1, // Default
              experience: 0, // Default
              isPro: false, // Will check subscription table
              birthDate: profileData.birth_date ? new Date(profileData.birth_date) : null,
              createdAt: profileData.created_at,
              updatedAt: profileData.updated_at,
              totalDays: profileData.total_days,
              energyPoints: profileData.energy_points,
              goal: profileData.goal || '',
              achievements: [],
              activeMission: undefined
            };
            
            set({ userProfile: updatedProfile });
            
            // Also check subscription status
            const { data: subscriptionData } = await supabase
              .from('subscriptions')
              .select('is_pro')
              .eq('user_id', userId)
              .single();
              
            if (subscriptionData) {
              set(state => ({
                userProfile: {
                  ...state.userProfile,
                  isPro: subscriptionData.is_pro
                }
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      },
      updateUserProfile: async (updates: Partial<UserProfile>) => {
        try {
          set({ loading: true, error: null });
          
          const { error } = await supabase
            .from('profiles')
            .update({
              name: updates.name,
              birth_date: updates.birthDate,
              goal: updates.goal,
              total_days: updates.totalDays,
              energy_points: updates.energyPoints,
              avatar_url: updates.avatar_url,
            })
            .eq('id', get().userProfile.id);
            
          if (error) throw error;
          
          set(state => ({
            userProfile: {
              ...state.userProfile,
              ...updates
            }
          }));
        } catch (error: any) {
          console.error("Error updating user profile:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // --- Achievement Actions ---
      fetchUserAchievements: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', userId);
            
          if (error) throw error;
          
          const achievements = data ? data.map(mapDbAchievementToAchievement) : [];
          set({ achievements });
        } catch (error: any) {
          console.error("Error fetching user achievements:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      unlockAchievement: async (achievementId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { error } = await supabase
            .from('achievements')
            .update({ unlocked_at: new Date().toISOString() })
            .eq('id', achievementId)
            .eq('user_id', get().userProfile.id);
            
          if (error) throw error;
          
          set(state => ({
            achievements: state.achievements.map(achievement =>
              achievement.id === achievementId
                ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
                : achievement
            )
          }));
        } catch (error: any) {
          console.error("Error unlocking achievement:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // --- Universe Question Actions ---
      fetchUniverseQuestions: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('universe_questions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          const universeQuestions = data ? data.map(mapDbQuestionToQuestion) : [];
          set({ universeQuestions });
        } catch (error: any) {
          console.error("Error fetching universe questions:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      addUniverseQuestion: async (question: string, answer: string) => {
        try {
          set({ loading: true, error: null });
          
          const { error } = await supabase
            .from('universe_questions')
            .insert([{
              user_id: get().userProfile.id,
              question,
              answer
            }]);
            
          if (error) throw error;
          
          await get().fetchUniverseQuestions(get().userProfile.id);
        } catch (error: any) {
          console.error("Error adding universe question:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      askUniverse: async (question: string) => {
        // Simulate asking the universe
        set({ loading: true });
        
        try {
          // In a real app, might send this to a backend API
          // For now, just returning a simulated response
          const responses = [
            "The universe hears your question. Be patient for your answer.",
            "Look within yourself for the answer you seek.",
            "The stars align in your favor. Your question will be answered soon.",
            "The path is unclear, but time will bring clarity.",
            "The answer you seek is already within you.",
          ];
          
          // Generate a random response
          const randomIndex = Math.floor(Math.random() * responses.length);
          const answer = responses[randomIndex];
          
          // Store the question and answer
          const newQuestion: UniverseQuestion = {
            id: Math.random().toString(),
            question,
            answer,
            createdAt: new Date().toISOString(),
            date: new Date().toLocaleDateString()
          };
          
          set(state => ({
            activeQuestions: [newQuestion, ...state.activeQuestions],
            universeQuestions: [newQuestion, ...state.universeQuestions]
          }));
          
          return answer;
        } finally {
          set({ loading: false });
        }
      },

      // --- Pact Actions ---
      fetchUserPacts: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('pacts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          set({ pacts: data || [] });
        } catch (error: any) {
          console.error("Error fetching user pacts:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      createPact: async (pact: Omit<Pact, 'id' | 'createdAt' | 'days'>) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('pacts')
            .insert([{
              user_id: get().userProfile.id,
              ...pact
            }])
            .select()
            .single();
            
          if (error) throw error;
          
          set(state => ({
            pacts: [...state.pacts, data]
          }));
        } catch (error: any) {
          console.error("Error creating pact:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      updatePact: async (pactId: string, updates: Partial<Pact>) => {
        try {
          set({ loading: true, error: null });
          
          const { error } = await supabase
            .from('pacts')
            .update(updates)
            .eq('id', pactId);
            
          if (error) throw error;
          
          set(state => ({
            pacts: state.pacts.map(pact =>
              pact.id === pactId ? { ...pact, ...updates } : pact
            )
          }));
        } catch (error: any) {
          console.error("Error updating pact:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      deletePact: async (pactId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { error } = await supabase
            .from('pacts')
            .delete()
            .eq('id', pactId);
            
          if (error) throw error;
          
          set(state => ({
            pacts: state.pacts.filter(pact => pact.id !== pactId)
          }));
        } catch (error: any) {
          console.error("Error deleting pact:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // Additional pact actions
      addPact: (pact) => {
        const newPact: Pact = {
          id: Math.random().toString(),
          title: pact.title,
          duration: pact.duration,
          reward: pact.reward,
          status: pact.status as 'active' | 'completed' | 'broken',
          createdAt: new Date().toISOString(),
          days: Array.from({ length: pact.duration }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return {
              date: date.toISOString().split('T')[0],
              completed: false
            };
          })
        };
        
        set(state => ({
          pacts: [...state.pacts, newPact]
        }));
        
        // Increase user's energyPoints for creating a pact
        set(state => ({
          userProfile: {
            ...state.userProfile,
            energyPoints: (state.userProfile.energyPoints || 0) + 5
          }
        }));
      },
      
      markDayComplete: (pactId) => {
        set(state => {
          // Find the pact
          const pactIndex = state.pacts.findIndex(p => p.id === pactId);
          if (pactIndex === -1) return state;
          
          const pact = state.pacts[pactIndex];
          
          // Find today's date
          const today = new Date().toISOString().split('T')[0];
          
          // Find the day index that matches today
          const dayIndex = pact.days.findIndex(d => d.date === today);
          if (dayIndex === -1) return state;
          
          // If day is already completed, do nothing
          if (pact.days[dayIndex].completed) return state;
          
          // Clone the pact and update the day
          const updatedPact = { ...pact };
          updatedPact.days = [...pact.days];
          updatedPact.days[dayIndex] = { ...updatedPact.days[dayIndex], completed: true };
          
          // Update the pacts array
          const updatedPacts = [...state.pacts];
          updatedPacts[pactIndex] = updatedPact;
          
          // Increase user's energy points
          return {
            pacts: updatedPacts,
            userProfile: {
              ...state.userProfile,
              energyPoints: (state.userProfile.energyPoints || 0) + 10,
              totalDays: (state.userProfile.totalDays || 0) + 1
            }
          };
        });
      },
      
      syncPactsWithCurrentDate: () => {
        set(state => {
          // Get today's date
          const today = new Date().toISOString().split('T')[0];
          
          // Update all active pacts
          const updatedPacts = state.pacts.map(pact => {
            if (pact.status !== 'active') return pact;
            
            // Check if today already exists in days
            const todayExists = pact.days.some(day => day.date === today);
            if (todayExists) return pact;
            
            // Add today to the days array
            const updatedDays = [...pact.days, { date: today, completed: false }];
            return { ...pact, days: updatedDays };
          });
          
          return { pacts: updatedPacts };
        });
      },

      // --- Pact Item Actions ---
      addPactItem: async (item: Omit<PactItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
          set({ loading: true, error: null });
          // Simulate adding a pact item
          const newItem: PactItem = {
            id: Math.random().toString(), // Temporary ID
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          set(state => ({
            pactItems: [...state.pactItems, newItem]
          }));
        } catch (error: any) {
          console.error("Error adding pact item:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      updatePactItem: async (itemId: string, updates: Partial<PactItem>) => {
        try {
          set({ loading: true, error: null });
          // Simulate updating a pact item
          set(state => ({
            pactItems: state.pactItems.map(item =>
              item.id === itemId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
            )
          }));
        } catch (error: any) {
          console.error("Error updating pact item:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      deletePactItem: async (itemId: string) => {
        try {
          set({ loading: true, error: null });
          // Simulate deleting a pact item
          set(state => ({
            pactItems: state.pactItems.filter(item => item.id !== itemId)
          }));
        } catch (error: any) {
          console.error("Error deleting pact item:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // --- Meditation Session Actions ---
      addMeditationSession: async (session: Omit<MeditationSession, 'id' | 'completedAt'>) => {
        try {
          set({ loading: true, error: null });
          // Simulate adding a meditation session
          const newSession: MeditationSession = {
            id: Math.random().toString(), // Temporary ID
            ...session,
            completedAt: new Date().toISOString()
          };
          set(state => ({
            meditationSessions: [...state.meditationSessions, newSession]
          }));
        } catch (error: any) {
          console.error("Error adding meditation session:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      fetchMeditationSessions: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          // Simulate fetching meditation sessions
          set({ meditationSessions: [] }); // Replace with actual data fetching
        } catch (error: any) {
          console.error("Error fetching meditation sessions:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // --- Daily Reflection Actions ---
      addDailyReflection: async (reflection: Omit<DailyReflection, 'id' | 'date'>) => {
        try {
          set({ loading: true, error: null });
          // Simulate adding a daily reflection
          const newReflection: DailyReflection = {
            id: Math.random().toString(), // Temporary ID
            ...reflection,
            date: new Date().toISOString().split('T')[0]
          };
          set(state => ({
            dailyReflections: [...state.dailyReflections, newReflection]
          }));
        } catch (error: any) {
          console.error("Error adding daily reflection:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      fetchDailyReflections: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          // Simulate fetching daily reflections
          set({ dailyReflections: [] }); // Replace with actual data fetching
        } catch (error: any) {
          console.error("Error fetching daily reflections:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // --- Notification Actions ---
      addNotification: async (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
        try {
          set({ loading: true, error: null });
          // Simulate adding a notification
          const newNotification: AppNotification = {
            id: Math.random().toString(), // Temporary ID
            ...notification,
            createdAt: new Date().toISOString(),
            read: false
          };
          set(state => ({
            notifications: [...state.notifications, newNotification]
          }));
        } catch (error: any) {
          console.error("Error adding notification:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      markNotificationAsRead: async (notificationId: string) => {
        try {
          set({ loading: true, error: null });
          // Simulate marking a notification as read
          set(state => ({
            notifications: state.notifications.map(notification =>
              notification.id === notificationId ? { ...notification, read: true } : notification
            )
          }));
        } catch (error: any) {
          console.error("Error marking notification as read:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      fetchNotifications: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          // Simulate fetching notifications
          set({ notifications: [] }); // Replace with actual data fetching
        } catch (error: any) {
          console.error("Error fetching notifications:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // --- Settings Actions ---
      updateSettings: (updates: Partial<AppSettings>) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...updates
          }
        }));
      },

      // --- Pro Subscription Actions ---
      upgradeToPro: () => {
        // Simulate upgrading to pro
        set(state => ({
          userProfile: {
            ...state.userProfile,
            isPro: true
          }
        }));
      },
      cancelProSubscription: () => {
        // Simulate canceling pro subscription
        set(state => ({
          userProfile: {
            ...state.userProfile,
            isPro: false
          }
        }));
      },
      
      // --- Mission Actions ---
      completeMission: () => {
        set(state => {
          if (!state.userProfile.activeMission) return state;
          
          // Add energy points from the mission reward
          const energyPoints = state.userProfile.energyPoints || 0;
          const missionPoints = state.userProfile.activeMission.reward.energyPoints || 0;
          
          // Clear the active mission and award the points
          return {
            userProfile: {
              ...state.userProfile,
              energyPoints: energyPoints + missionPoints,
              activeMission: undefined
            }
          };
        });
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
