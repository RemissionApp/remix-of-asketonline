import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthFlow } from '@/hooks/useAuthFlow';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - For public pages like /, /language, /login
 * Authenticated users are redirected to their target route per useAuthFlow.
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation();
  const { status, targetRoute } = useAuthFlow();

  if (status === 'initializing') {
    return null; // <AuthBootstrap> already shows the global loader
  }

  if (status !== 'unauthenticated' && targetRoute !== location.pathname) {
    return <Navigate to={targetRoute} replace />;
  }

  return <>{children}</>;
};
