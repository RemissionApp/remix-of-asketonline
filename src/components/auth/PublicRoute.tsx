import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { determineAuthRoute } from '@/utils/authRouter';
import { logger } from '@/utils/logger';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - For public pages like /, /language, /login
 * Redirects authenticated users to appropriate page
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAppStore();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkRedirect = async () => {
      // Only redirect if user is authenticated
      if (user && !loading) {
        const { route, reason } = determineAuthRoute();
        
        // Don't redirect if user is already on login page and should be there
        if (location.pathname === '/login' && route === '/login') {
          return;
        }
        
        // Redirect authenticated users away from public pages
        if (route !== location.pathname && route !== '/login') {
          logger.debug('PublicRoute: Authenticated user, redirecting', {
            from: location.pathname,
            to: route,
            reason,
          });
          setRedirectPath(route);
        }
      }
    };

    checkRedirect();
  }, [user, loading, location.pathname]);

  // Redirect if needed
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Show page for unauthenticated users or users who need to stay
  return <>{children}</>;
};
