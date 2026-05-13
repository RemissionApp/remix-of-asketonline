import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAdmin = useIsAdmin();
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-dark">
        <div className="h-8 w-8 rounded-full border-2 border-cosmic-accent border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/main" replace />;
  return <>{children}</>;
};
