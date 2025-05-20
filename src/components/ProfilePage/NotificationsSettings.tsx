
import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TimeInput } from '../TimeInput';
import { NotificationService } from '@/services/NotificationService';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const NotificationsSettings: React.FC = () => {
  const { t } = useTranslations();
  const [meditationReminders, setMeditationReminders] = useState(false);
  const [ascesisReminders, setAscesisReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState({ hours: 20, minutes: 0 });
  const [isPushAvailable, setIsPushAvailable] = useState(false);
  
  // Проверяем доступность push-уведомлений на устройстве
  useEffect(() => {
    const checkPushAvailability = async () => {
      try {
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
          const result = await NotificationService.registerPushNotifications();
          setIsPushAvailable(result);
        }
      } catch (error) {
        console.error('Ошибка при проверке доступности push-уведомлений:', error);
        setIsPushAvailable(false);
      }
    };
    
    checkPushAvailability();
  }, []);
  
  // Функция для сохранения настроек уведомлений
  const saveNotificationSettings = async () => {
    try {
      if (meditationReminders) {
        await NotificationService.scheduleMeditationReminder(reminderTime.hours, reminderTime.minutes);
      }
      
      if (ascesisReminders) {
        await NotificationService.scheduleAscesisReminder();
      }
      
      toast({
        title: "Настройки сохранены",
        description: "Ваши настройки уведомлений успешно сохранены",
        variant: "default"
      });
    } catch (error) {
      console.error('Ошибка при сохранении настроек уведомлений:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки уведомлений",
        variant: "destructive"
      });
    }
  };
  
  // Тестирование уведомлений
  const sendTestNotification = async () => {
    const success = await NotificationService.sendLocalNotification(
      'Тестовое уведомление',
      'Это тестовое уведомление для проверки функциональности'
    );
    
    if (success) {
      toast({
        title: "Уведомление отправлено",
        description: "Тестовое уведомление успешно отправлено",
        variant: "default"
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить тестовое уведомление",
        variant: "destructive"
      });
    }
  };
  
  const handleTimeChange = (type: 'hours' | 'minutes', value: number) => {
    setReminderTime(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  return (
    <div className="space-y-4">
      {!isPushAvailable && window.Capacitor?.isNativePlatform() && (
        <div className="rounded-md bg-yellow-50/10 p-4 border border-yellow-300/30 mb-4">
          <p className="text-yellow-300 text-sm">
            Для получения уведомлений необходимо предоставить разрешение в настройках устройства
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between py-2">
        <div>
          <Label htmlFor="meditation-reminders" className="text-cosmic-light">Напоминания о медитации</Label>
          <p className="text-cosmic-secondary text-xs mt-1">Ежедневные напоминания о практике медитации</p>
        </div>
        <Switch
          id="meditation-reminders"
          checked={meditationReminders}
          onCheckedChange={setMeditationReminders}
        />
      </div>
      
      {meditationReminders && (
        <div className="pl-4 border-l border-cosmic-accent/20 my-4">
          <Label className="text-cosmic-light mb-2 block">Время напоминания:</Label>
          <TimeInput 
            hours={reminderTime.hours}
            minutes={reminderTime.minutes}
            onHoursChange={(h) => handleTimeChange('hours', h)}
            onMinutesChange={(m) => handleTimeChange('minutes', m)}
          />
        </div>
      )}
      
      <div className="flex items-center justify-between py-2">
        <div>
          <Label htmlFor="ascesis-reminders" className="text-cosmic-light">Напоминания об аскезе</Label>
          <p className="text-cosmic-secondary text-xs mt-1">Напоминания о необходимости отметить выполнение аскезы</p>
        </div>
        <Switch
          id="ascesis-reminders"
          checked={ascesisReminders}
          onCheckedChange={setAscesisReminders}
        />
      </div>
      
      <div className="mt-6 flex flex-col gap-3">
        <Button onClick={saveNotificationSettings} className="w-full">
          Сохранить настройки
        </Button>
        
        <Button 
          variant="outline" 
          onClick={sendTestNotification} 
          className="w-full border-cosmic-accent/30 text-cosmic-accent"
        >
          <Bell className="mr-2 h-4 w-4" />
          Отправить тестовое уведомление
        </Button>
      </div>
    </div>
  );
};
