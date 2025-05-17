
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase, cleanupAuthState } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { defaultAchievements } from '../data/constants';

export interface AuthSlice {
  user: any | null;
  emailConfirmed: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: Partial<import('@/types').UserProfile>) => Promise<void>;
  checkEmailConfirmation: () => Promise<boolean>;
  handleAuthCallback: (hash: string) => Promise<boolean>;
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set, get) => ({
  user: null,
  emailConfirmed: false,
  
  signIn: async (email, password) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      
      // Check email confirmation status
      const isConfirmed = !!data.user?.email_confirmed_at;
      set({ emailConfirmed: isConfirmed });
      
      if (!isConfirmed) {
        toast({
          title: "Email не подтвержден",
          description: "Пожалуйста, проверьте почту и подтвердите свой email адрес.",
          variant: "warning"
        });
        return false;
      }
      
      // Load user data
      await get().loadUserProfile();
      await get().loadPacts();
      await get().loadUniverseQuestions();
      
      toast({
        title: "Вход выполнен",
        description: "Вы успешно вошли в систему"
      });
      
      return true; // Return true on success
    } catch (error: any) {
      let errorMessage = error.message || "Не удалось войти в систему";
      
      // Check for common Supabase auth errors and provide more user-friendly messages
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Email не подтвержден. Пожалуйста, проверьте почту и подтвердите свой email адрес.";
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Неверный email или пароль. Пожалуйста, проверьте введенные данные.";
      }
      
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive"
      });
      return false; // Return false on error
    } finally {
      set({ loading: false });
    }
  },
  
  signUp: async (email, password) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?email_confirmed=true`
        }
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      
      // Check if email confirmation is required
      if (data.session) {
        // Email confirmation is not required, user is signed in
        set({ emailConfirmed: true });
        toast({
          title: "Регистрация выполнена",
          description: "Ваш аккаунт был создан успешно. Теперь вы можете заполнить свой профиль."
        });
        
        // Set active screen to profile setup
        set({ activeScreen: 'profile', emailConfirmed: true });
      } else {
        // Email confirmation is required
        set({ emailConfirmed: false });
        toast({
          title: "Регистрация выполнена",
          description: "Ваш аккаунт был создан. Пожалуйста, проверьте вашу почту для подтверждения."
        });
      }
    } catch (error: any) {
      let errorMessage = error.message || "Не удалось создать аккаунт";
      
      // Check for common signup errors
      if (error.message?.includes('User already registered')) {
        errorMessage = "Пользователь с таким email уже зарегистрирован. Попробуйте войти.";
      }
      
      toast({
        title: "Ошибка регистрации",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    set({ loading: true });
    
    try {
      // Clean up auth state before signing out
      cleanupAuthState();
      
      await supabase.auth.signOut();
      
      set({ 
        user: null,
        pacts: [],
        activeQuestions: [],
        activeScreen: 'welcome',
        emailConfirmed: false
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
  
  // Handle redirect from email auth links
  handleAuthCallback: async (hash: string) => {
    try {
      if (hash && hash.includes('access_token')) {
        // Parse hash string to get auth data
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          set({ user: data.session.user, emailConfirmed: true });
          
          toast({
            title: "Авторизация успешна",
            description: "Вы успешно авторизовались!"
          });
          
          // Load user profile and other data
          await get().loadUserProfile();
          await get().loadPacts();
          await get().loadUniverseQuestions();
          
          return true;
        }
      }
      return false;
    } catch (error: any) {
      console.error("Auth callback error:", error);
      toast({
        title: "Ошибка авторизации",
        description: error.message || "Произошла ошибка при авторизации",
        variant: "destructive"
      });
      return false;
    }
  },
  
  // Check if user's email is confirmed
  checkEmailConfirmation: async () => {
    const { user } = get();
    
    if (!user) return false;
    
    try {
      // Get user data to check email confirmed status
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      const isConfirmed = data.user?.email_confirmed_at != null;
      set({ emailConfirmed: isConfirmed });
      
      console.log("Email confirmation status:", isConfirmed, data.user);
      
      return isConfirmed;
    } catch (error) {
      console.error("Error checking email confirmation:", error);
      return false;
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
      // Prepare update object with only defined fields
      const updateFields: any = {};
      if (profileData.name) updateFields.name = profileData.name;
      if (profileData.birthDate) updateFields.birth_date = profileData.birthDate;
      if (profileData.goal) updateFields.goal = profileData.goal;
      if (profileData.totalDays !== undefined) updateFields.total_days = profileData.totalDays;
      if (profileData.energyPoints !== undefined) updateFields.energy_points = profileData.energyPoints;
      if (profileData.rank) updateFields.rank = profileData.rank;
      if (profileData.avatar_url) updateFields.avatar_url = profileData.avatar_url;

      console.log("Updating profile with fields:", updateFields);
      
      const { error } = await supabase
        .from('profiles')
        .update(updateFields)
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
    
    console.log("Loading user profile for:", user.id);
    try {
      // Get profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error loading profile data:", error);
        throw error;
      }
      
      console.log("Retrieved profile data:", data);
      
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
      
      // Update local state with complete profile data
      set({
        userProfile: {
          name: data.name || 'Искатель',
          email: user.email || '',
          age: data.birth_date ? calculateAge(new Date(data.birth_date)) : null,
          birthDate: data.birth_date ? new Date(data.birth_date) : null,
          totalDays: data.total_days || 0,
          energyPoints: data.energy_points || 0,
          goal: data.goal || 'Познать свою истинную силу',
          isPro: isPro || false,
          rank: data.rank || 'seeker',
          avatar_url: data.avatar_url,
          zodiacSign: data.birth_date ? getZodiacSign(new Date(data.birth_date)) || '' : '',
          achievements: mappedAchievements,
          activeMission
        }
      });
      
      console.log("User profile loaded successfully");
      
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

// Helper function to calculate age
function calculateAge(birthDate: Date): number | null {
  if (!birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

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
