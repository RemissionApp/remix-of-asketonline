import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { createLogger } from '@/utils/logger';

const logger = createLogger('useAuthFlow');

export type AuthFlowStatus =
  | 'initializing'
  | 'unauthenticated'
  | 'needs_profile'
  | 'needs_onboarding'
  | 'ready';

export interface AuthFlowState {
  status: AuthFlowStatus;
  targetRoute: string;
  ready: boolean;
}

/**
 * Single source of truth for auth navigation.
 *
 * - Reads `user`, `userProfile`, `profileStepCompleted` (from profiles table),
 *   and `onboardingStepCompleted` (from user_onboarding_state) directly from Zustand.
 * - Computes a single `targetRoute` based on state.
 * - Public pages render their content if status === 'unauthenticated'
 *   and otherwise <Navigate to={targetRoute} />.
 * - Protected pages render their content if `currentRoute === targetRoute`,
 *   otherwise <Navigate to={targetRoute} />.
 *
 * No component should hand-roll auth navigation anymore.
 */
export const useAuthFlow = (): AuthFlowState => {
  const user = useAppStore(s => s.user);
  const userProfile = useAppStore(s => s.userProfile);
  const profileStepCompleted = useAppStore(s => s.profileStepCompleted);
  const onboardingStepCompleted = useAppStore(s => s.onboardingStepCompleted);
  const ready = useAppStore(s => (s as any).__authFlowReady ?? false);

  if (!user) {
    return {
      status: ready ? 'unauthenticated' : 'initializing',
      targetRoute: '/login',
      ready,
    };
  }

  const profileFilled =
    !!userProfile?.name?.trim() && !!userProfile?.birthDate;
  const profileDone = profileFilled && profileStepCompleted;

  if (!profileDone) {
    return { status: 'needs_profile', targetRoute: '/profile-setup', ready: true };
  }

  if (!onboardingStepCompleted) {
    return { status: 'needs_onboarding', targetRoute: '/onboarding', ready: true };
  }

  return { status: 'ready', targetRoute: '/main', ready: true };
};

/**
 * Bootstraps the auth flow ONCE for the whole app.
 * - Subscribes to Supabase auth state changes
 * - Calls getSession() once on mount
 * - Loads profile + onboarding state when user signs in / on initial session
 * - Sets a `__authFlowReady` flag in the store so `useAuthFlow` knows when to stop
 *   showing 'initializing'.
 *
 * Safe to mount once (in <AuthBootstrap>).
 */
export const useAuthFlowBootstrap = () => {
  const [bootstrapped, setBootstrapped] = useState(false);
  const setUser = useAppStore(s => s.setUser);
  const loadUserProfile = useAppStore(s => s.loadUserProfile);
  const loadOnboardingState = useAppStore(s => s.loadOnboardingState);

  const hydrateForUser = useCallback(async () => {
    try {
      await Promise.all([loadUserProfile(), loadOnboardingState()]);
    } catch (err) {
      logger.error('Failed to hydrate user data', err);
    }
  }, [loadUserProfile, loadOnboardingState]);

  useEffect(() => {
    let cancelled = false;

    // 1. Subscribe FIRST (recommended order from Supabase docs)
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      logger.debug('auth state change', { event, hasSession: !!session });
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          // Defer heavy work to avoid deadlock with Supabase listener
          setTimeout(() => hydrateForUser(), 0);
        }
      }
      if (event === 'SIGNED_OUT') {
        useAppStore.setState({
          profileStepCompleted: false,
          onboardingStepCompleted: false,
          preferencesStepCompleted: false,
        });
      }
    });

    // 2. Then check initial session
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session?.user) {
          setUser(data.session.user);
          await hydrateForUser();
        }
      } catch (err) {
        logger.error('getSession failed', err);
      } finally {
        if (!cancelled) {
          useAppStore.setState({ __authFlowReady: true } as any);
          setBootstrapped(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return bootstrapped;
};