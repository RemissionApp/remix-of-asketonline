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
  const profileLoading = useAppStore(s => (s as any).__profileLoading ?? false);

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
    // Grace period: while profile is still loading for the first time after
    // bootstrap, don't bounce the user to /profile-setup. Treat as 'ready'
    // so they can land on /main; once data arrives the flow re-evaluates.
    if (profileLoading && !profileFilled) {
      return { status: 'ready', targetRoute: '/main', ready: true };
    }
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
    useAppStore.setState({ __profileLoading: true } as any);
    try {
      await Promise.allSettled([loadUserProfile(), loadOnboardingState()]);
    } catch (err) {
      logger.error('Failed to hydrate user data', err);
    } finally {
      useAppStore.setState({ __profileLoading: false } as any);
    }
  }, [loadUserProfile, loadOnboardingState]);

  useEffect(() => {
    let cancelled = false;
    let lastHydratedUserId: string | null = null;
    let hydratingFor: string | null = null;

    const safeHydrate = (uid: string) => {
      if (hydratingFor === uid) return;
      if (lastHydratedUserId === uid) return;
      hydratingFor = uid;
      hydrateForUser().finally(() => {
        lastHydratedUserId = uid;
        hydratingFor = null;
      });
    };

    // 1. Subscribe FIRST (recommended order from Supabase docs)
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      logger.debug('auth state change', { event, hasSession: !!session });
      setUser(session?.user ?? null);
      // Auto-mark email confirmed from the session itself.
      if (session?.user?.email_confirmed_at) {
        useAppStore.setState({ emailConfirmed: true } as any);
      }

      if (
        (event === 'SIGNED_IN' || event === 'USER_UPDATED') &&
        session?.user
      ) {
        // Defer heavy work to avoid deadlock with Supabase listener.
        // INITIAL_SESSION is handled by the getSession() block below to
        // prevent a duplicate concurrent hydrate.
        setTimeout(() => safeHydrate(session.user.id), 0);
      }
      if (event === 'SIGNED_OUT') {
        lastHydratedUserId = null;
        useAppStore.setState({
          profileStepCompleted: false,
          onboardingStepCompleted: false,
          preferencesStepCompleted: false,
        });
      }
    });

    // 2. Then check initial session.
    // CRITICAL: mark `__authFlowReady=true` IMMEDIATELY after getSession,
    // BEFORE waiting for the profile to load. That way:
    //   - PublicRoute on `/` sees `status !== 'unauthenticated'` and
    //     redirects authenticated users straight to /main.
    //   - Profile keeps loading in the background (with grace period in
    //     useAuthFlow that prevents bouncing them to /profile-setup).
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        const sessionUser = data.session?.user ?? null;
        if (sessionUser) {
          setUser(sessionUser);
          if (sessionUser.email_confirmed_at) {
            useAppStore.setState({ emailConfirmed: true } as any);
          }
        }
        // Flip ready BEFORE awaiting hydrate so the UI can route immediately.
        useAppStore.setState({ __authFlowReady: true } as any);
        setBootstrapped(true);

        if (sessionUser) {
          safeHydrate(sessionUser.id);
        }
      } catch (err) {
        logger.error('getSession failed', err);
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