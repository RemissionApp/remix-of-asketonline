import { create } from 'zustand';
import { quotes } from './data/constants';
import { AppState } from './types';
import { createOptimizedUISlice } from './slices/optimizedUISlice';
import { createPactsSlice } from './slices/pactsSlice';
import { createUniverseSlice } from './slices/universeSlice';
import { createGamificationSlice } from './slices/gamificationSlice';
import { createProFeaturesSlice } from './slices/proFeaturesSlice';
import { createAuthSlice } from './slices/authSlice';
import { defaultAchievements } from './data/constants';

// Создание хранилища со всеми срезами
export const useAppStore = create<AppState>()((set, get, api) => ({
  // Начальное состояние
  pacts: [],
  activeQuestions: [],
  dailyQuote: quotes[Math.floor(Math.random() * quotes.length)],
  userProfile: {
    name: 'Искатель',
    email: '',
    age: null,
    energyPoints: 0,
    goal: 'Познать свою истинную силу',
    isPro: false,
    rank: 'seeker',
    zodiacSign: '',
    totalDays: 0,
    achievements: [...defaultAchievements],
    birthDate: null,
    avatar_url: null,
    activeMission: undefined,
  },
  user: null,
  loading: false,
  emailConfirmed: false,

  // Добавляем новый метод для установки пользователя
  setUser: user => set({ user }),

  // Состояние чата
  chatSessions: [],
  isLoadingChatSessions: false,
  currentChatSession: null,
  chatMessages: [],
  isLoadingChat: false,
  isSendingMessage: false,
  isUniverseTyping: false,

  // Комбинируем все срезы
  ...createOptimizedUISlice(set, get, api),
  ...createPactsSlice(set, get, api),
  ...createUniverseSlice(set, get, api),
  ...createGamificationSlice(set, get, api),
  ...createProFeaturesSlice(set, get, api),
  ...createAuthSlice(set, get, api),

  // Audio settings
  soundEnabled: true,
  soundVolume: 0.8,

  setSoundEnabled: enabled => {
    set({ soundEnabled: enabled });
    localStorage.setItem('soundEnabled', String(enabled));
  },

  setSoundVolume: volume => {
    set({ soundVolume: volume });
    localStorage.setItem('soundVolume', String(volume));
  },

  loadSoundSettings: () => {
    const storedEnabled = localStorage.getItem('soundEnabled');
    const storedVolume = localStorage.getItem('soundVolume');

    if (storedEnabled !== null) {
      set({ soundEnabled: storedEnabled === 'true' });
    }

    if (storedVolume !== null) {
      const volume = parseFloat(storedVolume);
      if (!isNaN(volume) && volume >= 0 && volume <= 1) {
        set({ soundVolume: volume });
      }
    }
  },

  // Initialize settings from localStorage
  initializeSettings: () => {
    // Load language
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && ['ru', 'en', 'es'].includes(storedLanguage)) {
      set({ language: storedLanguage as any });
    }

    // Load sound settings
    const storedEnabled = localStorage.getItem('soundEnabled');
    const storedVolume = localStorage.getItem('soundVolume');

    if (storedEnabled !== null) {
      set({ soundEnabled: storedEnabled === 'true' });
    }

    if (storedVolume !== null) {
      const volume = parseFloat(storedVolume);
      if (!isNaN(volume) && volume >= 0 && volume <= 1) {
        set({ soundVolume: volume });
      }
    }
  },

  updateProStatus: (isPro: boolean) => {
    set(state => ({
      userProfile: {
        ...state.userProfile,
        isPro
      }
    }));
  },

  deleteAccount: async (password: string) => {
    const { user } = get();
    if (!user) throw new Error('No user found');

    try {
      // Import supabase client
      const { supabase } = await import('@/integrations/supabase/client');
      
      // First verify password by trying to sign in
      const { error: passwordError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: password,
      });

      if (passwordError) {
        throw new Error('Invalid password');
      }

      // Delete all user data from tables
      const userId = user.id;
      
      // Delete in order to respect foreign key constraints
      // First get pact IDs, then delete pact_days
      const { data: pactIds } = await supabase
        .from('pacts')
        .select('id')
        .eq('user_id', userId);
      
      if (pactIds && pactIds.length > 0) {
        const pactIdList = pactIds.map(p => p.id);
        await supabase.from('pact_days').delete().in('pact_id', pactIdList);
      }
      await supabase.from('achievements').delete().eq('user_id', userId);
      await supabase.from('pacts').delete().eq('user_id', userId);
      await supabase.from('universe_questions').delete().eq('user_id', userId);
      await supabase.from('universe_chat_messages').delete().eq('user_id', userId);
      await supabase.from('universe_chat_sessions').delete().eq('user_id', userId);
      await supabase.from('missions').delete().eq('user_id', userId);
      await supabase.from('mission_progress').delete().eq('user_id', userId);
      await supabase.from('detailed_horoscopes').delete().eq('user_id', userId);
      await supabase.from('full_horoscopes').delete().eq('user_id', userId);
      await supabase.from('astro_profiles').delete().eq('user_id', userId);
      await supabase.from('numerology_readings').delete().eq('user_id', userId);
      await supabase.from('numerology_descriptions').delete().eq('user_id', userId);
      await supabase.from('push_subscriptions').delete().eq('user_id', userId);
      await supabase.from('subscriptions').delete().eq('user_id', userId);
      await supabase.from('profiles').delete().eq('id', userId);

      // Delete auth user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteError) {
        console.error('Error deleting auth user:', deleteError);
      }

      // Clean up auth state
      const cleanupAuthState = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
        Object.keys(sessionStorage || {}).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            sessionStorage.removeItem(key);
          }
        });
      };

      cleanupAuthState();

      // Sign out globally
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      // Clear local state
      set({
        user: null,
        userProfile: {
          name: 'Искатель',
          email: '',
          age: null,
          energyPoints: 0,
          goal: 'Познать свою истинную силу',
          isPro: false,
          rank: 'seeker',
          zodiacSign: '',
          totalDays: 0,
          achievements: [...defaultAchievements],
          birthDate: null,
          avatar_url: null,
          activeMission: undefined,
        },
        pacts: [],
        chatSessions: [],
        chatMessages: [],
        currentChatSession: null,
      });

      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);

    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
}));
