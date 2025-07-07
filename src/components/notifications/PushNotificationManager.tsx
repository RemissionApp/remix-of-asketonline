import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { firebaseConfig } from '@/utils/firebaseConfig';

interface NotificationSettings {
  dailyReminder: boolean;
  pactUpdates: boolean;
  meditation: boolean;
  universeMessages: boolean;
  achievements: boolean;
  subscription: boolean;
}

export const PushNotificationManager: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
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
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    setPermission(Notification.permission);

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
      console.error('Ошибка проверки подписки:', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToNotifications();
        toast({
          title: "Уведомления включены",
          description: "Теперь вы будете получать push-уведомления",
        });
        return true;
      } else {
        toast({
          title: "Уведомления отклонены",
          description: "Вы можете включить их в настройках браузера",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Ошибка запроса разрешения:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось запросить разрешение на уведомления",
        variant: "destructive",
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription: subscription.toJSON(),
          settings: settings,
        });

      if (error) throw error;

      setIsSubscribed(true);
      console.log('Подписка на push-уведомления создана');
    } catch (error) {
      console.error('Ошибка создания подписки:', error);
      toast({
        title: "Ошибка подписки",
        description: "Не удалось подписаться на уведомления",
        variant: "destructive",
      });
    }
  };

  const unsubscribe = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Удаляем подписку из Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id);
        }
      }

      setIsSubscribed(false);
      toast({
        title: "Подписка отменена",
        description: "Вы больше не будете получать push-уведомления",
      });
    } catch (error) {
      console.error('Ошибка отмены подписки:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отменить подписку",
        variant: "destructive",
      });
    }
  };

  const updateSettings = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Сохраняем в localStorage
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
    
    // Обновляем в Supabase
    if (isSubscribed) {
      const { data: { user } } = await supabase.auth.getUser();
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
        title: "Подписка не активна",
        description: "Сначала включите push-уведомления",
        variant: "destructive",
      });
      return;
    }

    try {
      // Отправляем тестовое уведомление через Edge Function
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          userId: user.id,
          type: 'test',
          title: 'Тестовое уведомление',
          body: 'Поздравляем! Push-уведомления работают корректно 🎉',
        },
      });

      if (error) throw error;

      toast({
        title: "Тестовое уведомление отправлено",
        description: "Проверьте, получили ли вы push-уведомление",
      });
    } catch (error) {
      console.error('Ошибка отправки тестового уведомления:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить тестовое уведомление",
        variant: "destructive",
      });
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Push-уведомления недоступны
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cosmic-muted">
            Ваш браузер не поддерживает push-уведомления
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Push-уведомления
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Статус уведомлений</p>
            <p className="text-sm text-cosmic-muted">
              {permission === 'granted' 
                ? isSubscribed ? 'Активны' : 'Разрешены, но не подключены'
                : permission === 'denied' 
                  ? 'Заблокированы' 
                  : 'Не настроены'
              }
            </p>
          </div>
          
          {permission !== 'granted' ? (
            <Button onClick={requestPermission}>
              Разрешить уведомления
            </Button>
          ) : isSubscribed ? (
            <Button variant="outline" onClick={unsubscribe}>
              Отключить
            </Button>
          ) : (
            <Button onClick={subscribeToNotifications}>
              Подключить
            </Button>
          )}
        </div>

        {isSubscribed && (
          <>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Настройки уведомлений
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Ежедневные напоминания</label>
                  <Switch 
                    checked={settings.dailyReminder}
                    onCheckedChange={(checked) => updateSettings('dailyReminder', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Обновления аскез</label>
                  <Switch 
                    checked={settings.pactUpdates}
                    onCheckedChange={(checked) => updateSettings('pactUpdates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Напоминания о медитации</label>
                  <Switch 
                    checked={settings.meditation}
                    onCheckedChange={(checked) => updateSettings('meditation', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Сообщения от Вселенной</label>
                  <Switch 
                    checked={settings.universeMessages}
                    onCheckedChange={(checked) => updateSettings('universeMessages', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Достижения</label>
                  <Switch 
                    checked={settings.achievements}
                    onCheckedChange={(checked) => updateSettings('achievements', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Подписка и платежи</label>
                  <Switch 
                    checked={settings.subscription}
                    onCheckedChange={(checked) => updateSettings('subscription', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <Button 
                onClick={sendTestNotification}
                variant="outline"
                className="w-full"
              >
                Отправить тестовое уведомление
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};