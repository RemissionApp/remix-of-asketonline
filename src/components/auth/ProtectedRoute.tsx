import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { determineAuthRoute } from '@/utils/authRouter';
import { logger } from '@/utils/logger';
import { StarField } from '@/components/StarField';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
  requireOnboarding?: boolean;
}

/**
 * ProtectedRoute - Protects routes that require authentication
 * Automatically redirects unauthenticated users to login
 * Checks profile and onboarding completion based on props
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireProfile = false,
  requireOnboarding = false,
}) => {
  const location = useLocation();
  const { user, loading } = useAppStore();
  const [checking, setChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      logger.debug('ProtectedRoute: Checking access', {
        path: location.pathname,
        requireProfile,
        requireOnboarding,
        hasUser: !!user,
      });

      // If no user, redirect to login
      if (!user && !loading) {
        logger.debug('ProtectedRoute: No user, redirecting to /login');
        setRedirectPath('/login');
        setChecking(false);
        return;
      }

      // If user exists, check if they should be somewhere else
      if (user && !loading) {
        const { route, reason } = determineAuthRoute();
        
        // If current route doesn't match determined route, redirect
        if (route !== location.pathname) {
          logger.debug('ProtectedRoute: User should be redirected', {
            from: location.pathname,
            to: route,
            reason,
          });
          setRedirectPath(route);
        }
      }

      setChecking(false);
    };

    checkAccess();
  }, [user, loading, location.pathname, requireProfile, requireOnboarding]);

  // Show loading while checking
  if (checking || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <StarField starCount={150} />
        <div className="cosmic-block backdrop-blur-sm p-8 rounded-lg border border-cosmic-accent/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cosmic-accent/60 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cosmic-secondary">Проверка доступа...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if needed
  if (redirectPath) {
    logger.debug('ProtectedRoute: Redirecting', { to: redirectPath });
    return <Navigate to={redirectPath} replace />;
  }

  // Allow access
  return <>{children}</>;
};
