import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';

export interface AuthRouteResult {
  route: string;
  reason: string;
}

/**
 * Centralized auth routing logic - determines where user should be redirected
 * Based on authentication status, profile completion, and onboarding progress
 */
export const determineAuthRoute = (): AuthRouteResult => {
  const storeState = useAppStore.getState();
  const { user } = storeState;
  
  logger.debug('AuthRouter: Determining route', {
    hasUser: !!user,
    userId: user?.id,
  });
  
  // Step 1: Check authentication
  if (!user) {
    logger.debug('AuthRouter: No user found, redirecting to login');
    return {
      route: '/login',
      reason: 'User not authenticated'
    };
  }
  
  // Step 2: Check profile completion using both profile data and database flag
  const isProfileComplete = storeState.isProfileComplete();
  const profileStepCompleted = storeState.profileStepCompleted;
  
  logger.debug('AuthRouter: Profile completion check', { 
    isProfileComplete, 
    profileStepCompleted,
    hasName: !!storeState.userProfile?.name,
    hasBirthDate: !!storeState.userProfile?.birthDate
  });
  
  // Profile is complete if both conditions are met:
  // 1. Has profile data (name and birth date)
  // 2. Database flag is set to true
  const profileComplete = isProfileComplete && profileStepCompleted;
  
  if (!profileComplete) {
    logger.debug('AuthRouter: Profile incomplete, redirecting to profile setup', {
      reason: !isProfileComplete ? 'Missing profile data' : 'Profile step not marked complete'
    });
    return {
      route: '/profile-setup',
      reason: !isProfileComplete ? 'Profile data incomplete' : 'Profile step not completed'
    };
  }
  
  // Step 3: Check onboarding completion (using only Supabase state)
  const isOnboardingComplete = storeState.checkOnboardingStatus();
  logger.debug('AuthRouter: Onboarding completion check', { isOnboardingComplete });
  
  if (!isOnboardingComplete) {
    logger.debug('AuthRouter: Onboarding incomplete, redirecting to onboarding');
    return {
      route: '/onboarding',
      reason: 'Onboarding not complete'
    };
  }
  
  // Step 4: All checks passed - user can access main app
  logger.debug('AuthRouter: All checks passed, redirecting to main');
  return {
    route: '/main',
    reason: 'All requirements met'
  };
};

/**
 * Navigate to the appropriate route based on auth state
 */
export const navigateToAuthRoute = (navigate: (path: string) => void): void => {
  const { route, reason } = determineAuthRoute();
  logger.info(`AuthRouter: Navigating to ${route}`, { reason });
  navigate(route);
};

/**
 * Check if user should be redirected from current route
 */
export const shouldRedirectFrom = (currentRoute: string): boolean => {
  const { route } = determineAuthRoute();
  
  // If determined route is different from current route, redirect is needed
  const shouldRedirect = route !== currentRoute;
  
  if (shouldRedirect) {
    logger.debug('AuthRouter: Redirect needed', {
      from: currentRoute,
      to: route
    });
  }
  
  return shouldRedirect;
};

/**
 * Check if user can access specific route
 */
export const canAccessRoute = (targetRoute: string): { canAccess: boolean; redirectTo?: string; reason?: string } => {
  const { route, reason } = determineAuthRoute();
  
  // User can access if determined route matches target
  if (route === targetRoute) {
    logger.debug('AuthRouter: Access granted', { route: targetRoute });
    return { canAccess: true };
  }
  
  // User should be redirected
  logger.debug('AuthRouter: Access denied', {
    targetRoute,
    shouldBe: route,
    reason,
  });
  
  return {
    canAccess: false,
    redirectTo: route,
    reason,
  };
};