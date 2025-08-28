import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { useTranslations } from '@/hooks/useTranslations';
import UserProfileForm from '@/components/UserProfileForm';
import { LanguageSelector } from '@/components/ProfilePage/LanguageSelector';
import { LegalDocuments } from '@/components/ProfilePage/LegalDocuments';
import { SubscriptionManager } from '@/components/ProfilePage/SubscriptionManager';
import { PushNotificationManager } from '@/components/notifications/PushNotificationManager';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="min-h-screen bg-cosmic-dark text-cosmic-text">
      <StarField starCount={50} />

      {/* Cosmic background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark opacity-30" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="text-cosmic-text hover:text-cosmic-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.common?.back || 'Back'}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-md mx-auto w-full space-y-8">
          {/* Title */}
          <h1 className="text-2xl font-serif text-center text-cosmic-text">
            {t.userProfile?.title || 'Account Settings'}
          </h1>

          {/* User Profile Form */}
          <div className="w-full">
            <UserProfileForm />
          </div>

          {/* Settings Sections */}
          <div className="w-full space-y-8">
            {/* Language Settings */}
            <div>
              <h2 className="text-xl text-white font-serif mb-4">
                {t.userProfile?.languageLabel || 'Application Language'}
              </h2>
              <LanguageSelector />
            </div>

            {/* Notifications */}
            <div>
              <h2 className="text-xl text-white font-serif mb-4">
                {t.userProfile?.notifications || 'Уведомления'}
              </h2>
              <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4">
                <ErrorBoundary
                  onError={error => {
                    console.error('Notification component error:', error);
                    toast({
                      title: 'Ошибка уведомлений',
                      description: 'Не удалось загрузить настройки уведомлений',
                      variant: 'destructive',
                    });
                  }}
                >
                  <PushNotificationManager />
                </ErrorBoundary>
              </div>
            </div>

            {/* Pro Subscription */}
            <div>
              <h2 className="text-xl text-white font-serif mb-4">
                {t.subscription?.title || 'PRO Подписка'}
              </h2>
              <SubscriptionManager />
            </div>

            {/* Legal Documents */}
            <LegalDocuments />

            {/* Data Management Section */}
            <div className="pt-6 border-t border-cosmic-accent/20 space-y-4">
              <h3 className="text-lg text-white font-serif mb-4">
                Управление данными
              </h3>

              {/* Delete Data Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/30 rounded-lg text-orange-400 transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                    {t.userProfile?.deleteData || 'Очистить все данные'}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-cosmic-dark border-cosmic-accent/30">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Очистить все данные?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-cosmic-text">
                      Будут удалены все ваши аскезы, достижения и прогресс.
                      Профиль останется.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-cosmic-text border-cosmic-accent/30">
                      Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          // TODO: Implement actual data deletion
                          await new Promise(resolve =>
                            setTimeout(resolve, 1000)
                          );
                          toast({
                            title: 'Данные очищены',
                            description: 'Все ваши данные успешно удалены',
                          });
                        } catch (error) {
                          toast({
                            title: 'Ошибка',
                            description: 'Не удалось очистить данные',
                            variant: 'destructive',
                          });
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Удаление...' : 'Очистить данные'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Delete Account Button */}
              <button
                onClick={() => {
                  // Check if delete account page exists
                  try {
                    navigate('/delete-account');
                  } catch (error) {
                    toast({
                      title: 'Страница недоступна',
                      description:
                        'Функция удаления аккаунта будет добавлена в следующих обновлениях',
                      variant: 'destructive',
                    });
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t.userProfile?.deleteAccount || 'Удалить данные аккаунта'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
