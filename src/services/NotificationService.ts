
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useAppStore } from '@/store/useAppStore';

export class NotificationService {
  static async registerPushNotifications() {
    try {
      // Проверка разрешений
      const permissionStatus = await PushNotifications.checkPermissions();
      
      if (permissionStatus.receive !== 'granted') {
        // Запрос разрешений
        const requestPermission = await PushNotifications.requestPermissions();
        if (requestPermission.receive !== 'granted') {
          console.log('Push-уведомления запрещены пользователем');
          return false;
        }
      }
      
      // Регистрация для получения push-уведомлений
      await PushNotifications.register();
      
      // Настройка обработчиков событий
      PushNotifications.addListener('registration', (token) => {
        console.log('Push-регистрация: ', token.value);
        // Сохраняем токен в хранилище или отправляем на сервер
      });
      
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Ошибка регистрации push-уведомлений: ', error);
      });
      
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Получено push-уведомление: ', notification);
        // Можно показать локальное уведомление
      });
      
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Действие по нажатию на уведомление: ', action);
        // Обработка нажатия на уведомление
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка при настройке push-уведомлений:', error);
      return false;
    }
  }
  
  // Отправка локального уведомления
  static async sendLocalNotification(title: string, body: string, id: number = 1) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: new Date(Date.now() + 1000) },
            sound: 'default',
            actionTypeId: '',
            extra: null
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Ошибка при отправке локального уведомления:', error);
      return false;
    }
  }
  
  // Отправка напоминания о медитации
  static async scheduleMeditationReminder(hours: number, minutes: number) {
    const now = new Date();
    const scheduleTime = new Date();
    
    scheduleTime.setHours(hours);
    scheduleTime.setMinutes(minutes);
    scheduleTime.setSeconds(0);
    
    // Если заданное время уже прошло, устанавливаем на завтра
    if (scheduleTime <= now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }
    
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 2,
            title: 'Время медитации',
            body: 'Не забудьте выделить время для медитации сегодня',
            schedule: { at: scheduleTime, repeats: true, every: 'day' },
            sound: 'default',
            actionTypeId: '',
            extra: { type: 'meditation_reminder' }
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Ошибка при планировании напоминания:', error);
      return false;
    }
  }
  
  // Отправка напоминания о невыполненном пакте
  static async scheduleAscesisReminder() {
    try {
      const { pacts } = useAppStore.getState();
      const activePacts = pacts.filter(p => p.status === 'active');
      
      if (activePacts.length > 0) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 3,
              title: 'Аскеза',
              body: 'Не забудьте отметить выполнение аскезы на сегодня',
              schedule: { at: new Date(Date.now() + 8 * 60 * 60 * 1000) }, // Напоминание через 8 часов
              sound: 'default',
              actionTypeId: '',
              extra: { type: 'ascesis_reminder' }
            }
          ]
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка при планировании напоминания об аскезе:', error);
      return false;
    }
  }
}
