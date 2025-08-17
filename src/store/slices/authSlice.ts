import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase, cleanupAuthState } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { defaultAchievements } from '../data/constants';
import { AuthUser } from '@/types/api';
import { createLogger } from '@/utils/logger';

const logger = createLogger('AuthSlice');

// Language helper function
const getTranslations = (language: string) => {
  switch (language) {
    case 'ru':
      return {
        error: 'Ошибка',
        codeSent: 'Код отправлен',
        codeValidated: 'Email подтвержден',
        loginSuccess: 'Вход выполнен',
        checkEmailAndEnterCode: 'Проверьте свою почту и введите код подтверждения',
        failedToSendCode: 'Не удалось отправить код подтверждения',
        failedToVerifyCode: 'Не удалось проверить код',
        invalidCode: 'Неверный код',
        checkCodeCorrectness: 'Проверьте правильность введенного кода',
        emailVerifiedSuccess: 'Ваш email успешно подтвержден',
        welcomeToAsket: 'Добро пожаловать в Аскет!',
        emailVerifiedSignIn: 'Ваш email успешно подтвержден. Теперь войдите в систему с вашими данными.',
        verificationError: 'Произошла ошибка при проверке кода',
      };
    case 'es':
      return {
        error: 'Error',
        codeSent: 'Código enviado',
        codeValidated: 'Email verificado',
        loginSuccess: 'Inicio de sesión exitoso',
        checkEmailAndEnterCode: 'Revisa tu email e ingresa el código de verificación',
        failedToSendCode: 'No se pudo enviar el código de verificación',
        failedToVerifyCode: 'No se pudo verificar el código',
        invalidCode: 'Código inválido',
        checkCodeCorrectness: 'Verifica la correcta introducción del código',
        emailVerifiedSuccess: 'Tu email ha sido verificado exitosamente',
        welcomeToAsket: '¡Bienvenido a Asket!',
        emailVerifiedSignIn: 'Tu email ha sido verificado exitosamente. Ahora inicia sesión con tus credenciales.',
        verificationError: 'Ocurrió un error al verificar el código',
      };
    default:
      return {
        error: 'Error',
        codeSent: 'Code sent',
        codeValidated: 'Email verified',
        loginSuccess: 'Login successful',
        checkEmailAndEnterCode: 'Check your email and enter the verification code',
        failedToSendCode: 'Failed to send verification code',
        failedToVerifyCode: 'Failed to verify code',
        invalidCode: 'Invalid code',
        checkCodeCorrectness: 'Check the correctness of the entered code',
        emailVerifiedSuccess: 'Your email has been successfully verified',
        welcomeToAsket: 'Welcome to Asket!',
        emailVerifiedSignIn: 'Your email has been successfully verified. Now sign in with your credentials.',
        verificationError: 'An error occurred while verifying the code',
      };
  }
};

export interface AuthSlice {
  user: AuthUser | null;
  loading: boolean;
  emailConfirmed: boolean;
  setUser: (user: AuthUser | null) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (
    profileData: Partial<import('@/types').UserProfile>
  ) => Promise<void>;
  checkEmailConfirmation: () => Promise<boolean>;
  sendOtpCode: (email: string) => Promise<boolean>;
  verifyOtpCode: (email: string, code: string) => Promise<boolean>;
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (
  set,
  get
) => ({
  user: null,
  loading: false,
  emailConfirmed: false,

  setUser: (user: AuthUser | null) => set({ user }),

  signIn: async (email, password) => {
    set({ loading: true });

    try {
      cleanupAuthState();

      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        logger.warn('Error during global signout before signin', error);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user });

      await get().loadUserProfile();

      setTimeout(async () => {
        try {
          await get().loadPacts();
          await get().loadUniverseQuestions();
        } catch (err) {
          logger.error('Error loading user data after signin', err);
        }
      }, 0);

      toast({
        title: 'Вход выполнен',
        description: 'Вы успешно вошли в систему',
      });

      return true;
    } catch (error) {
      logger.error('Sign in failed', error);
      toast({
        title: 'Ошибка входа',
        description:
          error instanceof Error ? error.message : 'Не удалось войти в систему',
        variant: 'destructive',
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password) => {
    set({ loading: true });

    try {
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user });

      if (data.session) {
        toast({
          title: 'Регистрация выполнена',
          description:
            'Ваш аккаунт был создан успешно. Теперь вы можете заполнить свой профиль.',
        });

        set({ activeScreen: 'profile', emailConfirmed: true });
      } else {
        set({ emailConfirmed: false });
        toast({
          title: 'Регистрация выполнена',
          description:
            'Ваш аккаунт был создан. Пожалуйста, проверьте вашу почту для подтверждения.',
        });
      }
    } catch (error) {
      logger.error('Sign up failed', error);
      toast({
        title: 'Ошибка регистрации',
        description:
          error instanceof Error ? error.message : 'Не удалось создать аккаунт',
        variant: 'destructive',
      });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });

    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });

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
          activeMission: undefined,
        },
        chatSessions: [],
        currentChatSession: null,
        chatMessages: [],
        isLoadingChatSessions: false,
        isLoadingChat: false,
        isSendingMessage: false,
        isUniverseTyping: false,
      });

      toast({
        title: 'Выход выполнен',
        description: 'Вы успешно вышли из системы',
      });
    } catch (error) {
      logger.error('Sign out failed', error);
      toast({
        title: 'Ошибка выхода',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось выйти из системы',
        variant: 'destructive',
      });
    } finally {
      set({ loading: false });
    }
  },

  checkEmailConfirmation: async () => {
    const { user, emailConfirmed } = get();

    if (!user) return false;

    // Return cached result if already confirmed
    if (emailConfirmed) return true;

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;

      const isConfirmed = data.user?.email_confirmed_at != null;
      set({ emailConfirmed: isConfirmed });

      logger.debug('Email confirmation status', {
        isConfirmed,
        user: data.user,
      });

      return isConfirmed;
    } catch (error) {
      logger.error('Error checking email confirmation', error);
      return false;
    }
  },

  sendOtpCode: async (email: string): Promise<boolean> => {
    try {
      const currentLanguage = get().language || 'en';
      
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: { 
          email,
          language: currentLanguage
        }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        const lang = get().language || 'en';
        const t = getTranslations(lang);
        
        toast({
          title: t.error,
          description: t.failedToSendCode,
          variant: "destructive",
        });
        return false;
      }

      if (!data.success) {
        console.error('OTP send failed:', data.error);
        const lang = get().language || 'en';
        const t = getTranslations(lang);
        
        toast({
          title: t.error,
          description: data.error || t.failedToSendCode,
          variant: "destructive",
        });
        return false;
      }

      const lang = get().language || 'en';
      const t = getTranslations(lang);

      toast({
        title: t.codeSent,
        description: t.checkEmailAndEnterCode,
      });
      return true;
    } catch (error) {
      console.error('Error in sendOtpCode:', error);
      const lang = get().language || 'en';
      const t = getTranslations(lang);
      
      toast({
        title: t.error,
        description: t.failedToSendCode,
        variant: "destructive",
      });
      return false;
    }
  },

  verifyOtpCode: async (email: string, code: string): Promise<boolean> => {
    try {
      set({ loading: true });
      
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, code }
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        const lang = get().language || 'en';
        const t = getTranslations(lang);
        
        toast({
          title: t.error,
          description: t.failedToVerifyCode,
          variant: "destructive",
        });
        return false;
      }

      if (!data.success) {
        console.error('OTP verification failed:', data.error);
        const lang = get().language || 'en';
        const t = getTranslations(lang);
        
        toast({
          title: t.invalidCode,
          description: data.error || t.checkCodeCorrectness,
          variant: "destructive",
        });
        return false;
      }

      // If we have access tokens, automatically sign in the user
      if (data.accessToken && data.refreshToken) {
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: data.accessToken,
            refresh_token: data.refreshToken
          });

          if (sessionError) {
            console.error('Error setting session:', sessionError);
          } else if (sessionData.user) {
            set({ 
              user: sessionData.user,
              emailConfirmed: true 
            });
            
            // Load user profile
            await get().loadUserProfile();
            
            const lang = get().language || 'en';
            const t = getTranslations(lang);
            
            toast({
              title: t.loginSuccess,
              description: t.welcomeToAsket,
            });
            
            return true;
          }
        } catch (sessionError) {
          console.error('Error during auto sign-in:', sessionError);
        }
      }

      // Fallback: just mark email as confirmed
      const lang = get().language || 'en';
      const t = getTranslations(lang);
      
      toast({
        title: t.codeValidated,
        description: t.emailVerifiedSignIn,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error in verifyOtpCode:', error);
      const lang = get().language || 'en';
      const t = getTranslations(lang);
      
      toast({
        title: t.error,
        description: t.verificationError,
        variant: "destructive",
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateUserProfile: async profileData => {
    const { user } = get();

    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Вы должны войти в систему для обновления профиля',
        variant: 'destructive',
      });
      return;
    }

    set({ loading: true });

    try {
      const updateFields: Record<string, any> = {};
      if (profileData.name) updateFields.name = profileData.name;
      if (profileData.birthDate)
        updateFields.birth_date = profileData.birthDate;
      if (profileData.goal) updateFields.goal = profileData.goal;
      if (profileData.totalDays !== undefined)
        updateFields.total_days = profileData.totalDays;
      if (profileData.energyPoints !== undefined)
        updateFields.energy_points = profileData.energyPoints;
      if (profileData.rank) updateFields.rank = profileData.rank;
      if (profileData.avatar_url)
        updateFields.avatar_url = profileData.avatar_url;

      logger.debug('Updating profile with fields', updateFields);

      const { error } = await supabase
        .from('profiles')
        .update(updateFields)
        .eq('id', user.id);

      if (error) throw error;

      set(state => ({
        userProfile: { ...state.userProfile, ...profileData },
      }));

      toast({
        title: 'Профиль обновлен',
        description: 'Ваш профиль был успешно обновлен',
      });

      // Предварительная загрузка гороскопа если установлена дата рождения
      if (profileData.birthDate) {
        try {
          const { language } = get();
          const sign = getZodiacSign(profileData.birthDate);
          if (sign) {
            await supabase.functions.invoke('fetch-horoscope', {
              body: {
                sign,
                language,
                detailed: false,
              },
            });
          }
        } catch (e) {
          logger.warn('Failed to preload horoscope', e);
        }
      }
    } catch (error) {
      logger.error('Profile update failed', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось обновить профиль',
        variant: 'destructive',
      });
    } finally {
      set({ loading: false });
    }
  },

  loadUserProfile: async () => {
    const { user } = get();

    if (!user) return;

    logger.debug('Loading user profile', { userId: user.id });

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error loading profile data', error);
        throw error;
      }

      // Если профиля нет, создаем его
      if (!data) {
        logger.info('Profile not found, creating new profile');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: 'Искатель',
            rank: 'seeker',
            total_days: 0,
            energy_points: 0,
          })
          .select('*')
          .maybeSingle();

        if (createError) {
          logger.error('Error creating profile', createError);
          throw createError;
        }

        logger.info('Profile created successfully', {
          profileId: newProfile?.id,
        });
        return newProfile;
      }

      logger.debug('Profile data loaded', {
        profileData: data ? 'Found' : 'Not found',
      });

      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('is_pro, subscription_end')
        .eq('user_id', user.id)
        .maybeSingle();

      const isPro =
        subscription?.is_pro &&
        new Date(subscription.subscription_end) > new Date();

      // Get achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      if (achievementsError) throw achievementsError;

      // Map achievements to app format
      const mappedAchievements = defaultAchievements.map(defaultAch => {
        const foundAch = achievements?.find(
          a => a.achievement_type === defaultAch.id
        );
        return foundAch
          ? {
              id: defaultAch.id,
              title: defaultAch.title,
              description: defaultAch.description,
              icon: defaultAch.icon,
              unlocked: !!foundAch.unlocked_at,
              unlockedAt: foundAch.unlocked_at,
            }
          : defaultAch;
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

      const activeMission =
        missions && missions.length > 0
          ? {
              id: missions[0].id,
              title: missions[0].title,
              description: missions[0].description,
              requirements: missions[0].requirements as string[],
              reward: missions[0].reward as {
                energyPoints?: number;
                achievement?: string;
              },
              completed: false,
            }
          : undefined;

      // Update local state with full profile data
      set({
        userProfile: {
          name: data?.name || 'Искатель',
          email: user.email || '',
          age: data?.birth_date
            ? calculateAge(new Date(data.birth_date))
            : null,
          birthDate: data?.birth_date ? new Date(data.birth_date) : null,
          totalDays: data?.total_days || 0,
          energyPoints: data?.energy_points || 0,
          goal: data?.goal || 'Познать свою истинную силу',
          isPro: isPro || false,
          rank: data?.rank || 'seeker',
          avatar_url: data?.avatar_url,
          zodiacSign: data?.birth_date
            ? getZodiacSign(new Date(data.birth_date)) || ''
            : '',
          achievements: mappedAchievements,
          activeMission,
        },
      });

      logger.debug('User profile loaded successfully');

      // Preload horoscope data if birth date exists
      if (data.birth_date) {
        try {
          const { language } = get();
          const sign = getZodiacSign(new Date(data.birth_date));
          if (sign) {
            await supabase.functions.invoke('fetch-horoscope', {
              body: {
                sign,
                language,
                detailed: false,
              },
            });
          }
        } catch (e) {
          logger.warn('Failed to preload horoscope data', e);
        }
      }
    } catch (error) {
      logger.error('Error loading user profile', error);
    }
  },
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

// Helper function to get zodiac sign (simplified version for preloading only)
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
