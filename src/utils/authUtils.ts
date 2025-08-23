import { useAppStore } from '@/store/useAppStore';

/**
 * Утилиты для работы с авторизацией и навигацией
 */

export const getNavigationRoute = () => {
  const storeState = useAppStore.getState();
  const { user } = storeState;
  
  // Если пользователь не авторизован
  if (!user) {
    return '/login';
  }
  
  // Если профиль не заполнен
  if (!storeState.isProfileComplete()) {
    return '/profile-setup';
  }
  
  // Если onboarding не завершен
  if (!storeState.checkOnboardingStatus()) {
    return '/onboarding';
  }
  
  // Все проверки пройдены
  return '/main';
};

export const shouldRedirectToProfile = () => {
  const storeState = useAppStore.getState();
  return storeState.user && !storeState.isProfileComplete();
};

export const shouldRedirectToOnboarding = () => {
  const storeState = useAppStore.getState();
  return storeState.user && storeState.isProfileComplete() && !storeState.checkOnboardingStatus();
};

export const shouldRedirectToMain = () => {
  const storeState = useAppStore.getState();
  return storeState.user && storeState.isProfileComplete() && storeState.checkOnboardingStatus();
};