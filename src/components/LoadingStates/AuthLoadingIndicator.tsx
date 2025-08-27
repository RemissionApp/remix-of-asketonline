import React from 'react';
import { createLogger } from '@/utils/logger';

const logger = createLogger('AuthLoadingIndicator');

interface AuthLoadingIndicatorProps {
  isLoading: boolean;
  hasUser: boolean;
  hasSession: boolean;
  userProfile?: any;
  pactsCount?: number;
}

export const AuthLoadingIndicator: React.FC<AuthLoadingIndicatorProps> = ({
  isLoading,
  hasUser,
  hasSession,
  userProfile,
  pactsCount = 0
}) => {
  // Log current auth state for debugging
  React.useEffect(() => {
    logger.debug('Auth state update', {
      isLoading,
      hasUser,
      hasSession,
      hasUserProfile: !!userProfile,
      pactsCount
    });
  }, [isLoading, hasUser, hasSession, userProfile, pactsCount]);

  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto"></div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            {!hasUser ? 'Проверка аутентификации...' :
             !userProfile ? 'Загрузка профиля...' :
             'Загрузка аскез...'}
          </p>
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-muted-foreground/60 space-y-1">
              <p>User: {hasUser ? '✓' : '✗'}</p>
              <p>Session: {hasSession ? '✓' : '✗'}</p>
              <p>Profile: {userProfile ? '✓' : '✗'}</p>
              <p>Pacts: {pactsCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};