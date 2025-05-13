
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
  authRequired?: boolean;
}

const AuthRedirect = ({ 
  children, 
  redirectTo = '/signin', 
  authRequired = true 
}: AuthRedirectProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // If auth is required but user is not logged in, redirect
      if (authRequired && !isLoggedIn) {
        navigate(redirectTo);
      }
      
      // If auth is NOT required but user IS logged in, redirect to main
      if (!authRequired && isLoggedIn) {
        navigate('/');
      }
    }
  }, [authRequired, isLoggedIn, loading, navigate, redirectTo]);

  // Show nothing while checking auth status
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If we get here, either:
  // 1. Auth is required AND user is logged in
  // 2. Auth is NOT required AND user is NOT logged in
  // In both cases, show the children
  return <>{children}</>;
};

export default AuthRedirect;
