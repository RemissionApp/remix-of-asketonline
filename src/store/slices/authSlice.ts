
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
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set, get) => ({
  user: null,
  emailConfirmed: false,
  
  signIn: async (email, password) => {
    set({ loading: true });
    
    try {
      // Очищаем состояние аутентификации перед входом для предотвращения проблем
      cleanupAuthState();
      
      // Пытаемся глобально выйти перед новым входом
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Продолжаем даже при ошибке
        console.log("Ошибка при глобальном выходе перед входом:", error);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      
      // Загружаем данные пользователя
      await get().loadUserProfile();
      
      // Загружаем остальные данные с небольшой задержкой
      setTimeout(async () => {
        try {
          await get().loadPacts();
          await get().loadUniverseQuestions();
        } catch (err) {
          console.error("Ошибка при загрузке данных:", err);
        }
      }, 0);
      
      toast({
        title: "Вход выполнен",
        description: "Вы успешно вошли в систему"
      });
      
      return true; // Возвращаем true при успешном входе
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти в систему",
        variant: "destructive"
      });
      return false; // Возвращаем false при ошибке
    } finally {
      set({ loading: false });
    }
  },
  
  signUp: async (email, password) => {
    set({ loading: true });
    
    try {
      // Очищаем состояние аутентификации перед регистрацией
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      
      // Проверяем, требуется ли подтверждение email
      if (data.session) {
        // Подтверждение email не требуется, пользователь вошел в систему
        toast({
          title: "Регистрация выполнена",
          description: "Ваш аккаунт был создан успешно. Теперь вы можете заполнить свой профиль."
        });
        
        // Устанавливаем активный экран на настройку профиля
        set({ activeScreen: 'profile', emailConfirmed: true });
      } else {
        // Требуется подтверждение email
        set({ emailConfirmed: false });
        toast({
          title: "Регистрация выполнена",
          description: "Ваш аккаунт был создан. Пожалуйста, проверьте вашу почту для подтверждения."
        });
      }
    } catch (error: any) {
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
      // Очищаем состояние аутентификации
      cleanupAuthState();
      
      // Пытаемся глобально выйти
      await supabase.auth.signOut({ scope: 'global' });
      
      // Сбрасываем состояние приложения
      set({ 
        user: null,
        pacts: [],
        activeQuestions: [],
        activeScreen: 'welcome',
        emailConfirmed: false,
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
          activeMission: undefined
        },
        chatSessions: [],
        currentChatSession: null,
        chatMessages: [],
        isLoadingChatSessions: false,
        isLoadingChat: false,
        isSendingMessage: false,
        isUniverseTyping: false
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
  
  // Проверка подтверждения email пользователя
  checkEmailConfirmation: async () => {
    const { user } = get();
    
    if (!user) return false;
    
    try {
      // Получаем данные пользователя для проверки статуса подтверждения email
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      const isConfirmed = data.user?.email_confirmed_at != null;
      set({ emailConfirmed: isConfirmed });
      
      console.log("Статус подтверждения email:", isConfirmed, data.user);
      
      return isConfirmed;
    } catch (error) {
      console.error("Ошибка при проверке подтверждения email:", error);
      return false;
    }
  },
  
  // Обновление профиля пользователя
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
      // Подготавливаем объект обновления только с определенными полями
      const updateFields: any = {};
      if (profileData.name) updateFields.name = profileData.name;
      if (profileData.birthDate) updateFields.birth_date = profileData.birthDate;
      if (profileData.goal) updateFields.goal = profileData.goal;
      if (profileData.totalDays !== undefined) updateFields.total_days = profileData.totalDays;
      if (profileData.energyPoints !== undefined) updateFields.energy_points = profileData.energyPoints;
      if (profileData.rank) updateFields.rank = profileData.rank;
      if (profileData.avatar_url) updateFields.avatar_url = profileData.avatar_url;

      console.log("Обновление профиля со следующими полями:", updateFields);
      
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
      
      // После обновления профиля и если была установлена дата рождения, предварительно загружаем данные гороскопа
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
          console.error("Не удалось предварительно загрузить гороскоп:", e);
          // Не показываем пользователю ошибку для этой попытки предварительной загрузки
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
  
  // Загрузка профиля пользователя
  loadUserProfile: async () => {
    const { user } = get();
    
    if (!user) return;
    
    console.log("Загрузка профиля пользователя для:", user.id);
    try {
      // Получаем данные профиля
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Ошибка загрузки данных профиля:", error);
        throw error;
      }
      
      console.log("Получены данные профиля:", data);
      
      // Проверяем статус подписки
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('is_pro, subscription_end')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const isPro = subscription?.is_pro && 
        new Date(subscription.subscription_end) > new Date();
      
      // Получаем достижения
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (achievementsError) throw achievementsError;
      
      // Преобразуем достижения в формат нашего приложения
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
      
      // Получаем активную миссию
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
      
      // Обновляем локальное состояние полными данными профиля
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
      
      console.log("Профиль пользователя успешно загружен");
      
      // После загрузки профиля предварительно загружаем данные гороскопа, если есть дата рождения
      if (data.birth_date) {
        try {
          const { language } = get();
          // Вспомогательная функция для получения знака зодиака используется здесь
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
          console.error("Не удалось предварительно загрузить гороскоп:", e);
          // Не показываем пользователю ошибку для этой попытки предварительной загрузки
        }
      }
      
    } catch (error) {
      console.error("Ошибка загрузки профиля пользователя:", error);
    }
  }
});

// Вспомогательная функция для расчета возраста
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

// Вспомогательная функция для получения знака зодиака (упрощенная версия только для предварительной загрузки)
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
