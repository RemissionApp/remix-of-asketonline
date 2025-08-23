import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { firebaseConfig } from '@/utils/firebaseConfig';
import { createLogger } from '@/utils/logger';

interface NotificationSettings {
  dailyReminder: boolean;
  pactUpdates: boolean;
  meditation: boolean;
  universeMessages: boolean;
  achievements: boolean;
  subscription: boolean;
}

export const PushNotificationManager: React.FC = () => {
  const logger = createLogger('PushNotificationManager');
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyReminder: true,
    pactUpdates: true,
    meditation: true,
    universeMessages: true,
    achievements: true,
    subscription: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Проверяем поддержку уведомлений
    const isNotificationSupported =
      'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(isNotificationSupported);

    // Безопасно получаем разрешение только если API доступен
    if (isNotificationSupported && typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }

    // Загружаем настройки из localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Проверяем текущую подписку
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      logger.error('Ошибка проверки подписки', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported || typeof Notification === 'undefined') {
      toast({
        title: 'Уведомления не поддерживаются',
        description: 'Push-уведомления недоступны в этой среде',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        await subscribeToNotifications();
        toast({
          title: 'Уведомления включены',
          description: 'Теперь вы будете получать push-уведомления',
        });
        return true;
      } else {
        toast({
          title: 'Уведомления отклонены',
          description: 'Вы можете включить их в настройках браузера',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      logger.error('Ошибка запроса разрешения', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось запросить разрешение на уведомления',
        variant: 'destructive',
      });
      return false;
    }
  };

  const subscribeToNotifications = async () => {
    if (!('serviceWorker' in navigator) || permission !== 'granted') return;

    try {
      const registration = await navigator.serviceWorker.ready;

      // Используем реальный VAPID ключ из конфигурации
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: firebaseConfig.vapidKey,
      });

      // Сохраняем подписку в Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        subscription: subscription.toJSON(),
        settings: settings,
      });

      if (error) throw error;

      setIsSubscribed(true);
      toast({
        title: 'Подписка создана',
        description: 'Вы успешно подписались на push-уведомления',
      });
    } catch (error) {
      logger.error('Ошибка подписки на уведомления', error);
      toast({
        title: 'Ошибка подписки',
        description: 'Не удалось подписаться на уведомления',
        variant: 'destructive',
      });
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Удаляем подписку из Supabase
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id);
        }

        setIsSubscribed(false);
        toast({
          title: 'Подписка отменена',
          description: 'Вы отписались от push-уведомлений',
        });
      }
    } catch (error) {
      logger.error('Ошибка отписки от уведомлений', error);
      toast({
        title: 'Ошибка отписки',
        description: 'Не удалось отписаться от уведомлений',
        variant: 'destructive',
      });
    }
  };

  const updateSettings = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Сохраняем в localStorage
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));

    // Обновляем в Supabase
    if (isSubscribed) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_subscriptions')
          .update({ settings: newSettings })
          .eq('user_id', user.id);
      }
    }
  };

  const sendTestNotification = async () => {
    if (!isSubscribed) {
      toast({
        title: 'Подписка не активна',
        description: 'Сначала включите push-уведомления',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Отправляем тестовое уведомление через Edge Function
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.functions.invoke(
        'send-push-notification',
        {
          body: {
            userId: user.id,
            type: 'test',
            title: 'Тестовое уведомление',
            body: 'Поздравляем! Push-уведомления работают корректно 🎉',
          },
        }
      );

      if (error) throw error;

      toast({
        title: 'Тестовое уведомление отправлено',
        description: 'Проверьте, получили ли вы push-уведомление',
      });
    } catch (error) {
      logger.error('Ошибка отправки тестового уведомления', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить тестовое уведомление',
        variant: 'destructive',
      });
    }
  };

  // Если уведомления не поддерживаются, показываем сообщение
  if (!isSupported) {
    return (
      <Card className="bg-cosmic-dark/30 border-cosmic-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BellOff className="h-5 w-5 text-cosmic-secondary mr-2" />
              <div>
                <h3 className="font-medium text-white">Push-уведомления</h3>
                <p className="text-sm text-cosmic-secondary">
                  Недоступны в этой среде
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-cosmic-dark/30 border-cosmic-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Bell className="h-5 w-5 mr-2" />
          Push-уведомления
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Статус подписки */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Статус подписки</h4>
            <p className="text-sm text-cosmic-secondary">
              {isSubscribed ? 'Активна' : 'Неактивна'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isSubscribed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={unsubscribeFromNotifications}
                className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
              >
                Отписаться
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={requestPermission}
                disabled={permission === 'denied'}
                className="bg-cosmic-accent text-white hover:bg-cosmic-accent/90"
              >
                Подписаться
              </Button>
            )}
          </div>
        </div>

        {/* Разрешение */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Разрешение</h4>
            <p className="text-sm text-cosmic-secondary">
              {permission === 'granted'
                ? 'Разрешено'
                : permission === 'denied'
                  ? 'Отклонено'
                  : 'Не запрошено'}
            </p>
          </div>
        </div>

        {/* Настройки уведомлений */}
        {isSubscribed && (
          <div className="space-y-3">
            <h4 className="font-medium text-white">Настройки уведомлений</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cosmic-secondary">
                  Ежедневные напоминания
                </span>
                <Switch
                  checked={settings.dailyReminder}
                  onCheckedChange={checked =>
                    updateSettings('dailyReminder', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cosmic-secondary">
                  Обновления аскез
                </span>
                <Switch
                  checked={settings.pactUpdates}
                  onCheckedChange={checked =>
                    updateSettings('pactUpdates', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cosmic-secondary">Медитации</span>
                <Switch
                  checked={settings.meditation}
                  onCheckedChange={checked =>
                    updateSettings('meditation', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cosmic-secondary">
                  Сообщения Вселенной
                </span>
                <Switch
                  checked={settings.universeMessages}
                  onCheckedChange={checked =>
                    updateSettings('universeMessages', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cosmic-secondary">
                  Достижения
                </span>
                <Switch
                  checked={settings.achievements}
                  onCheckedChange={checked =>
                    updateSettings('achievements', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cosmic-secondary">Подписка</span>
                <Switch
                  checked={settings.subscription}
                  onCheckedChange={checked =>
                    updateSettings('subscription', checked)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Тестовое уведомление */}
        {isSubscribed && (
          <div className="pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
              className="w-full border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
            >
              Отправить тестовое уведомление
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
