import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthFlow } from '@/hooks/useAuthFlow';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
  requireOnboarding?: boolean;
}

/**
 * ProtectedRoute - relies entirely on useAuthFlow for navigation decisions.
 * If user is on the wrong route for their auth state, redirect to the correct one.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { status, targetRoute } = useAuthFlow();

  if (status === 'initializing') {
    return null; // global loader handles it
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  // Force redirect only when the user must complete profile or onboarding.
  // When status === 'ready', allow free navigation across all protected routes.
  if (status === 'needs_profile' || status === 'needs_onboarding') {
    if (targetRoute !== location.pathname) {
      return <Navigate to={targetRoute} replace />;
    }
  }

  return <>{children}</>;
};
