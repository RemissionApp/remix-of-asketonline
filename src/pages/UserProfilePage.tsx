import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import UserProfileForm from '@/components/UserProfileForm';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    user,
    loading,
    onboardingComplete,
    emailConfirmed,
    checkEmailConfirmation,
  } = useAppStore();
  const [authChecking, setAuthChecking] = useState(true);

  // Проверяем, вошел ли пользователь в систему, существуют ли данные профиля и подтвержден ли email
  useEffect(() => {
    // Добавлен console.log для отладки потока аутентификации
    console.log('Profile setup: user status', {
      user,
      userProfile,
      loading,
      onboardingComplete,
      emailConfirmed,
    });

    const checkAuth = async () => {
      try {
        // Сначала проверяем текущую сессию
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionUser = sessionData?.session?.user;

        // Если сессия не найдена, перенаправляем на вход
        if (!sessionUser) {
          console.log('Пользователь не найден, перенаправляем на вход');
          navigate('/login');
          return;
        }

        // Проверяем, подтвержден ли email
        const isConfirmed = await checkEmailConfirmation();
        console.log('Статус подтверждения email:', isConfirmed);

        if (!isConfirmed) {
          toast({
            title: 'Подтвердите email',
            description: 'Пожалуйста, подтвердите ваш email перед продолжением',
            variant: 'warning',
          });
          navigate('/login');
          return;
        }

        // Перенаправляем на onboarding или main только если пользователь заполнил профиль
        if (
          userProfile &&
          userProfile.name &&
          userProfile.name !== 'Искатель' &&
          userProfile.birthDate
        ) {
          // Если пользователь еще не прошел onboarding, отправляем его туда
          if (!onboardingComplete) {
            console.log('Профиль заполнен, перенаправляем на onboarding');
            navigate('/onboarding');
          } else {
            // Если onboarding уже пройден, перенаправляем на main
            console.log(
              'Профиль и onboarding завершены, перенаправляем на main'
            );
            navigate('/main');
          }
        }

        setAuthChecking(false);
      } catch (error) {
        console.error('Ошибка при проверке аутентификации:', error);
        setAuthChecking(false);
      }
    };

    // Если данные еще загружаются, ждем завершения загрузки
    if (!loading) {
      checkAuth();
    }
  }, [
    userProfile,
    user,
    loading,
    navigate,
    onboardingComplete,
    emailConfirmed,
    checkEmailConfirmation,
  ]);

  // Показываем загрузку, пока проверяем статус аутентификации
  if (loading || authChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <StarField starCount={150} />
        <div className="cosmic-block backdrop-blur-sm p-8 rounded-lg border border-cosmic-accent/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cosmic-accent/60 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cosmic-secondary">Загрузка профиля...</p>
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
