import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { createLogger } from '@/utils/logger';

const logger = createLogger('AuthDebug');

/**
 * Хук для отладки состояния авторизации
 * Выводит в консоль текущее состояние пользователя и профиля
 */
export const useAuthDebug = () => {
  const {
    user,
    userProfile,
    loading,
    emailConfirmed,
    onboardingComplete,
    isProfileComplete,
    checkOnboardingStatus,
  } = useAppStore();

  useEffect(() => {
    const profileComplete = isProfileComplete();
    const onboardingCompleteStatus = checkOnboardingStatus();

    logger.debug('Auth state updated:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      emailConfirmed,
      loading,
      profileData: {
        name: userProfile.name,
        hasName: !!userProfile.name && userProfile.name !== 'Искатель',
        hasBirthDate: !!userProfile.birthDate,
        birthDate: userProfile.birthDate,
      },
      checks: {
        profileComplete,
        onboardingComplete,
        onboardingCompleteStatus,
      },
      localStorage: {
        onboarded: localStorage.getItem('onboarded'),
      },
    });
  }, [
    user,
    userProfile,
    loading,
    emailConfirmed,
    onboardingComplete,
    isProfileComplete,
    checkOnboardingStatus,
  ]);
};