
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { defaultAchievements } from '../data/constants';

export interface AuthSlice {
  user: any | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: Partial<import('@/types').UserProfile>) => Promise<void>;
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set, get, api) => ({
  user: null,
  
  signIn: async (email, password) => {
    if (!email || !password) {
      toast({
        title: "Ошибка входа",
        description: "Пожалуйста, введите email и пароль",
        variant: "destructive"
      });
      return false;
    }

    set({ loading: true });
    
    try {
      // Clean up auth state before signing in to prevent issues
      const { cleanupAuthState } = require('@/lib/supabase');
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      
      // Load user data
      await get().loadUserProfile();
      await get().loadPacts();
      
      // Load universe questions if available
      if (typeof get().loadUniverseQuestions === 'function') {
        await get().loadUniverseQuestions();
      }
      
      const { userProfile } = get();
      
      toast({
        title: "Вход выполнен",
        description: "Вы успешно вошли в систему"
      });
      
      return true; // Return true on success
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти в систему",
        variant: "destructive"
      });
      return false; // Return false on error
    } finally {
      set({ loading: false });
    }
  },
  
  signUp: async (email, password) => {
    if (!email || !password) {
      toast({
        title: "Ошибка регистрации",
        description: "Пожалуйста, введите email и пароль",
        variant: "destructive"
      });
      return;
    }

    set({ loading: true });
    
    try {
      // Clean up auth state before signing up
      const { cleanupAuthState } = require('@/lib/supabase');
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      
      toast({
        title: "Регистрация выполнена",
        description: "Ваш аккаунт был создан. Пожалуйста, проверьте вашу почту для подтверждения."
      });
      
      set({ activeScreen: 'onboarding' });
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось создать аккаунт",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    set({ loading: true });
    
    try {
      await supabase.auth.signOut();
      
      set({ 
        user: null,
        pacts: [],
        activeQuestions: [],
        activeScreen: 'welcome'
      });
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка выхода",
        description: error.message || "Не удалось выйти из системы",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // Update user profile
  updateUserProfile: async (profileData) => {
    const { user } = get();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему для обновления профиля",
        variant: "destructive"
      });
      return;
    }
    
    set({ loading: true });
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          birth_date: profileData.birthDate,
          goal: profileData.goal,
          total_days: profileData.totalDays,
          energy_points: profileData.energyPoints,
          rank: profileData.rank
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      set((state) => ({
        userProfile: { ...state.userProfile, ...profileData }
      }));
      
      toast({
        title: "Профиль обновлен",
        description: "Ваш профиль был успешно обновлен"
      });
      
      // After profile is updated and if birthdate was set, prefetch horoscope data
      if (profileData.birthDate) {
        try {
          const { language } = get();
          const sign = getZodiacSign(profileData.birthDate);
          if (sign) {
            await supabase.functions.invoke('fetch-horoscope', {
              body: { 
                sign,
                language,
                detailed: false
              }
            });
          }
        } catch (e) {
          console.error("Failed to prefetch horoscope:", e);
          // Don't show error to user for this prefetch attempt
        }
      }
      
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить профиль",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // Load user profile
  loadUserProfile: async () => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      // Get profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('is_pro, subscription_end')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const isPro = subscription?.is_pro && 
        new Date(subscription.subscription_end) > new Date();
      
      // Get achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (achievementsError) throw achievementsError;
      
      // Map achievements to our app's format
      const mappedAchievements = defaultAchievements.map(defaultAch => {
        const foundAch = achievements?.find(a => a.achievement_type === defaultAch.id);
        return foundAch ? {
          id: defaultAch.id,
          title: defaultAch.title,
          description: defaultAch.description,
          icon: defaultAch.icon,
          unlocked: !!foundAch.unlocked_at,
          unlockedAt: foundAch.unlocked_at
        } : defaultAch;
      });
      
      // Get active mission
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (missionsError) throw missionsError;
      
      const activeMission = missions && missions.length > 0 ? {
        id: missions[0].id,
        title: missions[0].title,
        description: missions[0].description,
        requirements: missions[0].requirements as any,
        reward: missions[0].reward as any,
        completed: false
      } : undefined;
      
      // Update local state
      set({
        userProfile: {
          name: data.name,
          birthDate: data.birth_date ? new Date(data.birth_date) : undefined,
          totalDays: data.total_days,
          energyPoints: data.energy_points,
          goal: data.goal || 'Познать свою истинную силу',
          isPro: isPro,
          rank: data.rank,
          achievements: mappedAchievements,
          activeMission
        }
      });
      
      // After profile is loaded, prefetch horoscope data if birthdate exists
      if (data.birth_date) {
        try {
          const { language } = get();
          // Helper function to get zodiac sign is used here
          const sign = getZodiacSign(new Date(data.birth_date));
          if (sign) {
            await supabase.functions.invoke('fetch-horoscope', {
              body: { 
                sign,
                language,
                detailed: false
              }
            });
          }
        } catch (e) {
          console.error("Failed to prefetch horoscope:", e);
          // Don't show error to user for this prefetch attempt
        }
      }
      
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  }
});

// Helper function to get zodiac sign (simplified version just for the prefetch)
function getZodiacSign(birthDate: Date): string | null {
  if (!birthDate) return null;
  
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-based
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'aries';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'taurus';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'gemini';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'cancer';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'leo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'virgo';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'libra';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'scorpio';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'sagittarius';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'capricorn';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'aquarius';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 'pisces';
  }
  
  return null;
}
