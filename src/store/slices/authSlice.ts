import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { defaultAchievements } from '../data/constants';
import { AuthUser } from '@/types/api';
import { createLogger } from '@/utils/logger';
import { UserProfile } from '@/types';
import { useRevenueCatStore } from './revenueCatSlice';

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
        checkEmailAndEnterCode:
          'Проверьте свою почту и введите код подтверждения',
        failedToSendCode: 'Не удалось отправить код подтверждения',
        failedToVerifyCode: 'Не удалось проверить код',
        invalidCode: 'Неверный код',
        checkCodeCorrectness: 'Проверьте правильность введенного кода',
        emailVerifiedSuccess: 'Ваш email успешно подтвержден',
        welcomeToAsket: 'Добро пожаловать в Аскет!',
        emailVerifiedSignIn:
          'Ваш email успешно подтвержден. Теперь войдите в систему с вашими данными.',
        verificationError: 'Произошла ошибка при проверке кода',
      };
    case 'es':
      return {
        error: 'Error',
        codeSent: 'Código enviado',
        codeValidated: 'Email verificado',
        loginSuccess: 'Inicio de sesión exitoso',
        checkEmailAndEnterCode:
          'Revisa tu email e ingresa el código de verificación',
        failedToSendCode: 'No se pudo enviar el código de verificación',
        failedToVerifyCode: 'No se pudo verificar el código',
        invalidCode: 'Código inválido',
        checkCodeCorrectness: 'Verifica la correcta introducción del código',
        emailVerifiedSuccess: 'Tu email ha sido verificado exitosamente',
        welcomeToAsket: '¡Bienvenido a Asket!',
        emailVerifiedSignIn:
          'Tu email ha sido verificado exitosamente. Ahora inicia sesión con tus credenciales.',
        verificationError: 'Ocurrió un error al verificar el código',
      };
    default:
      return {
        error: 'Error',
        codeSent: 'Code sent',
        codeValidated: 'Email verified',
        loginSuccess: 'Login successful',
        checkEmailAndEnterCode:
          'Check your email and enter the verification code',
        failedToSendCode: 'Failed to send verification code',
        failedToVerifyCode: 'Failed to verify code',
        invalidCode: 'Invalid code',
        checkCodeCorrectness: 'Check the correctness of the entered code',
        emailVerifiedSuccess: 'Your email has been successfully verified',
        welcomeToAsket: 'Welcome to Asket!',
        emailVerifiedSignIn:
          'Your email has been successfully verified. Now sign in with your credentials.',
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
  verifyOtpCode: (
    email: string,
    code: string,
    password?: string
  ) => Promise<boolean>;
  isProfileComplete: () => boolean;
  checkOnboardingStatus: () => boolean;
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (
  set,
  get
) => ({
  user: null,
  loading: false,
  emailConfirmed: false,

  setUser: (user: AuthUser | null) => set({ user }),

  // Унифицированная функция проверки завершенности профиля
  isProfileComplete: () => {
    const { userProfile, user } = get();
    if (!user || !userProfile) return false;
    return !!(
      userProfile.name &&
      userProfile.name.trim() !== '' &&
      userProfile.birthDate
    );
  },

  // Унифицированная функция проверки завершенности onboarding
  // CRITICAL: Only use Supabase state, not localStorage
  checkOnboardingStatus: () => {
    const { onboardingStepCompleted } = get();
    logger.debug('checkOnboardingStatus:', {
      onboardingStepCompleted,
    });
    return onboardingStepCompleted;
  },

  signIn: async (email, password) => {
    set({ loading: true });

    try {
      cleanupAuthState();

      // Clear RevenueCat store before signing in new user
      const { reset: resetRevenueCat } = useRevenueCatStore.getState();
      resetRevenueCat();

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

      await Promise.all([
        get().loadUserProfile(),
        get().loadOnboardingState(),
      ]);

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
      logger.info('Starting OTP signup process for email:', email);
      cleanupAuthState();

      // Clear RevenueCat store before signing up new user
      const { reset: resetRevenueCat } = useRevenueCatStore.getState();
      resetRevenueCat();

      // ✨ BACK TO ORIGINAL: Send OTP first, create user after verification
      console.log('📧 Sending OTP code first (before user creation)...');

      // Send OTP code instead of direct signup
      const otpSent = await get().sendOtpCode(email);

      if (otpSent) {
        logger.info('OTP sent successfully for signup');

        toast({
          title: 'Код отправлен',
          description: 'Проверьте свою почту и введите код подтверждения',
        });
      } else {
        throw new Error('Не удалось отправить код подтверждения');
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

      // Clear RevenueCat store
      const { reset: resetRevenueCat } = useRevenueCatStore.getState();
      resetRevenueCat();

      set({
        user: null,
        pacts: [],
        activeQuestions: [],
        activeScreen: 'welcome',
        emailConfirmed: false,
        userProfile: {
          name: '',
          email: '',
          age: null,
          energyPoints: 0,
          goal: '',
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

      const { data, error } = await supabase.functions.invoke(
        'send-otp-email',
        {
          body: {
            email,
            language: currentLanguage,
          },
        }
      );

      if (error) {
        console.error('Error sending OTP:', error);
        const lang = get().language || 'en';
        const t = getTranslations(lang);

        toast({
          title: t.error,
          description: t.failedToSendCode,
          variant: 'destructive',
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
          variant: 'destructive',
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
        variant: 'destructive',
      });
      return false;
    }
  },

  verifyOtpCode: async (
    email: string,
    code: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.log('🔍 === OTP VERIFICATION WITH USER CREATION START ===');
      console.log('📧 Email:', email);
      console.log('🔢 Code:', code);

      logger.info('Verifying OTP for email:', email);
      set({ loading: true });

      // ✨ Step 1: Verify OTP code first
      const { data, error } = await supabase.functions.invoke(
        'verify-otp-simple',
        {
          body: { email, code },
        }
      );

      console.log('📝 OTP verification response:', data);
      console.log('📝 OTP verification error:', error);

      if (error) {
        logger.error('Error verifying OTP:', error);
        const lang = get().language || 'en';
        const t = getTranslations(lang);

        toast({
          title: t.error,
          description: t.failedToVerifyCode,
          variant: 'destructive',
        });
        return false;
      }

      if (!data.success) {
        logger.error('OTP verification failed:', data.error);
        const lang = get().language || 'en';
        const t = getTranslations(lang);

        toast({
          title: t.invalidCode,
          description: data.error || t.checkCodeCorrectness,
          variant: 'destructive',
        });
        return false;
      }

      console.log('✅ OTP verified successfully, now creating user...');

      // ✨ Step 2: Create user AFTER OTP verification
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            emailRedirectTo: undefined,
            data: {
              email_verified_via_otp: true,
              registration_method: 'otp_verification',
            },
          },
        });

      console.log(
        '👤 User creation result:',
        signUpData?.user?.id ? 'Success' : 'Failed'
      );
      console.log('👤 User creation error:', signUpError);

      if (signUpError) {
        logger.error('Error creating user after OTP:', signUpError);

        if (signUpError.message?.includes('already registered')) {
          // User exists, try to sign in instead
          console.log('🔄 User exists, trying to sign in...');
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email: email,
              password: password,
            });

          if (signInError) {
            toast({
              title: 'Ошибка',
              description: 'Пользователь уже существует, но не удалось войти',
              variant: 'destructive',
            });
            return false;
          }

          if (signInData.user) {
            set({ user: signInData.user, emailConfirmed: true });
            await get().loadUserProfile();

            toast({
              title: 'Вход выполнен',
              description: 'Добро пожаловать обратно!',
            });
            return true;
          }
        }

        toast({
          title: 'Ошибка создания пользователя',
          description: signUpError.message || 'Не удалось создать аккаунт',
          variant: 'destructive',
        });
        return false;
      }

      if (signUpData.user) {
        // Clear RevenueCat store before setting new user
        const { reset: resetRevenueCat } = useRevenueCatStore.getState();
        resetRevenueCat();

        set({
          user: signUpData.user,
          emailConfirmed: true,
        });

        // Load user profile
        await get().loadUserProfile();

        const lang = get().language || 'en';
        const t = getTranslations(lang);

        toast({
          title: t.emailVerifiedSuccess,
          description: t.welcomeToAsket,
        });

        console.log('🔍 === OTP VERIFICATION WITH USER CREATION END ===');
        return true;
      }

      return false;
    } catch (error: unknown) {
      logger.error('Error in verifyOtpCode:', error);
      const lang = get().language || 'en';
      const t = getTranslations(lang);

      toast({
        title: t.error,
        description: t.verificationError,
        variant: 'destructive',
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateUserProfile: async (profileData: Partial<UserProfile>) => {
    // This function is deprecated. Use useOptimizedProfileCache instead.
    // Keeping for backward compatibility only.
    logger.warn(
      'updateUserProfile is deprecated. Use useOptimizedProfileCache instead.'
    );

    // Fallback implementation for compatibility
    const { user } = get();
    if (!user) return;

    try {
      const updateData: Record<string, string | number | null> = {};

      if (profileData.name !== undefined) updateData.name = profileData.name;
      if (profileData.birthDate !== undefined) {
        updateData.birth_date =
          profileData.birthDate?.toISOString().split('T')[0] || null;
      }
      if (profileData.goal !== undefined) updateData.goal = profileData.goal;
      if (profileData.avatar_url !== undefined)
        updateData.avatar_url = profileData.avatar_url;

      const { error } = await supabase
        .from('profiles')
        .update(updateData as any)
        .eq('id', user.id);

      if (error) throw error;

      set(state => ({
        userProfile: { ...state.userProfile, ...profileData },
      }));

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
    }
  },

  // Функция для обновления только Pro статуса без показа toast
  updateProStatus: (isPro: boolean) => {
    set(state => ({
      userProfile: { ...state.userProfile, isPro },
    }));
  },

  loadUserProfile: async () => {
    const { user } = get();

    if (!user) {
      logger.warn('No user found when loading profile');
      return;
    }

    logger.debug('Loading user profile', { userId: user.id });

    try {
      // Force fresh data from database with cache bypass, including profile_step_completed
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      console.log('loadUserProfile - Raw data from DB:', data);

      if (error && error.code !== 'PGRST116') {
        logger.error('Error loading profile data', error);
        throw error;
      }

      // Если профиля нет, создаем минимальный профиль без имени по умолчанию
      if (!data) {
        logger.info('Profile not found, creating new empty profile');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: '', // Empty name instead of "Искатель"
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

        // Set empty profile data
        set({
          userProfile: {
            name: '',
            email: user.email || '',
            age: null,
            birthDate: null,
            totalDays: 0,
            energyPoints: 0,
            goal: '',
            isPro: false,
            rank: 'seeker',
            avatar_url: null,
            zodiacSign: '',
            achievements: [...defaultAchievements],
            activeMission: undefined,
          },
        });

        return;
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
              difficulty: 'novice' as const,
              category: 'ritual' as const,
              duration: 1,
            }
          : undefined;

      // Debug logging for date parsing
      // Optimized logging for production
      logger.debug('Profile data loaded from DB', {
        userId: user.id,
        hasName: !!data?.name,
        hasBirthDate: !!data?.birth_date,
      });

      // Optimized date parsing with caching
      let parsedBirthDate = null;
      if (data?.birth_date) {
        try {
          parsedBirthDate = new Date(data.birth_date);
          if (isNaN(parsedBirthDate.getTime())) {
            parsedBirthDate = null;
            logger.warn('Invalid birth_date format from DB', {
              birth_date: data.birth_date,
            });
          }
        } catch (error) {
          logger.error('Failed to parse birth_date:', error);
        }
      }

      // Update local state with full profile data
      const updatedProfile = {
        name: data?.name || '', // Use exact value from DB
        email: user.email || '',
        age: parsedBirthDate ? calculateAge(parsedBirthDate) : null,
        birthDate: parsedBirthDate,
        totalDays: data?.total_days || 0,
        energyPoints: data?.energy_points || 0,
        goal: data?.goal || '',
        isPro: isPro || false,
        rank: data?.rank || 'seeker',
        avatar_url: data?.avatar_url,
        zodiacSign: parsedBirthDate ? getZodiacSign(parsedBirthDate) || '' : '',
        achievements: mappedAchievements,
        activeMission,
      };

      logger.debug('Profile loaded from database', {
        name: updatedProfile.name,
        avatar_url: updatedProfile.avatar_url,
        birth_date: data?.birth_date,
      });

      // Set profile state AND sync profileStepCompleted from the same row
      // (single source of truth for the profile flag).
      set({
        userProfile: updatedProfile,
        profileStepCompleted: !!data?.profile_step_completed,
      });

      // Load onboarding-only flags (preferences/onboarding) from the other table
      setTimeout(() => get().loadOnboardingState(), 0);

      logger.debug('User profile state updated successfully', {
        name: updatedProfile.name,
        birthDate: updatedProfile.birthDate,
        avatar_url: updatedProfile.avatar_url,
      });

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
