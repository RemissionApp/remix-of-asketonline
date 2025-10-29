import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { StarField } from '@/components/StarField';
import { logger } from '@/utils/logger';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Global authentication check
 * Ensures authentication state is loaded before rendering app
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const { setUser, loadUserProfile } = useAppStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        logger.debug('AuthGuard: Checking authentication state');
        
        // Check current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('AuthGuard: Error getting session', error);
          setIsChecking(false);
          return;
        }

        if (session?.user) {
          logger.debug('AuthGuard: User session found', { userId: session.user.id });
          setUser(session.user);
          
          // Load user profile
          await loadUserProfile();
        } else {
          logger.debug('AuthGuard: No active session');
        }
      } catch (error) {
        logger.error('AuthGuard: Error during auth check', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [setUser, loadUserProfile]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <StarField starCount={150} />
        <div className="cosmic-block backdrop-blur-sm p-8 rounded-lg border border-cosmic-accent/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cosmic-accent/60 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cosmic-secondary">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
