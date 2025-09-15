import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLogger } from '@/utils/logger';

export const AuthCallback: React.FC = () => {
  const logger = createLogger('AuthCallback');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        logger.info('Handling auth callback');

        // Обрабатываем callback от Supabase Auth
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (error) {
          logger.error('Auth callback error', { error, errorDescription });
          navigate(
            '/login?error=' + encodeURIComponent(errorDescription || error)
          );
          return;
        }

        // Если нет ошибки, перенаправляем на главную страницу
        navigate('/main');
      } catch (error) {
        logger.error('Error handling auth callback', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Обработка авторизации...</p>
      </div>
    </div>
  );
};
