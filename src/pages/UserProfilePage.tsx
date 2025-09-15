import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import UserProfileForm from '@/components/UserProfileForm';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useTranslations } from '@/hooks/useTranslations';
import { useAuthDebug } from '@/hooks/useAuthDebug';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  useAuthDebug(); // Отладка состояния авторизации
  const {
    userProfile,
    user,
    loading,
    onboardingComplete,
    emailConfirmed,
    checkEmailConfirmation,
  } = useAppStore();
  const [authChecking, setAuthChecking] = useState(true);
  const authCheckRef = useRef(false);

  const checkAuth = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (authCheckRef.current) {
      return;
    }
    authCheckRef.current = true;

    try {
      // Use the centralized auth router logic
      const { determineAuthRoute } = await import('@/utils/authRouter');
      const { route, reason } = determineAuthRoute();
      
      console.log('UserProfilePage - Auth route determined:', { route, reason });
      
      // If we should be on a different route, navigate there
      if (route !== '/profile-setup') {
        console.log('UserProfilePage - Redirecting to:', route);
        navigate(route);
        return;
      }
      
      // If we're staying on this page, just stop the loading state
      setAuthChecking(false);
    } catch (error) {
      console.error('Authentication check error:', error);
      setAuthChecking(false);
    } finally {
      authCheckRef.current = false;
    }
  }, [navigate]);

  // Check authentication when conditions are ready
  useEffect(() => {
    if (!loading && !authCheckRef.current) {
      checkAuth();
    }
  }, [loading, checkAuth]);

  // Показываем загрузку, пока проверяем статус аутентификации
  if (loading || authChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <StarField starCount={150} />
        <div className="cosmic-block backdrop-blur-sm p-8 rounded-lg border border-cosmic-accent/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cosmic-accent/60 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cosmic-secondary">{t.auth.processing}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField starCount={150} />

      {/* Cosmic background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark" />

      <div className="relative z-10 max-w-md w-full mx-auto">
        <Card className="cosmic-card backdrop-blur-[5px] bg-cosmic-dark/10 border-cosmic-accent/20">
          <CardContent className="pt-6">
            <UserProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
