import { PushNotificationService } from './pushNotificationService';
import { supabase } from '@/lib/supabase';

/**
 * Интеграции push-уведомлений с событиями приложения
 */
export class NotificationIntegrations {
  /**
   * Интеграция с системой аскез (пактов)
   */
  static setupPactIntegrations() {
    // Слушаем события создания новых пактов
    window.addEventListener('pact:created', async (event: any) => {
      const { pact, userId } = event.detail;

      // Отправляем уведомление о начале аскезы
      await PushNotificationService.sendPactStart(userId, pact.title, pact.id);
    });

    // Слушаем события завершения пактов
    window.addEventListener('pact:completed', async (event: any) => {
      const { pact, userId } = event.detail;

      // Отправляем уведомление о завершении
      await PushNotificationService.sendPactComplete(
        userId,
        pact.title,
        pact.id
      );
    });
  }

  /**
   * Интеграция с системой достижений
   */
  static setupAchievementIntegrations() {
    window.addEventListener('achievement:unlocked', async (event: any) => {
      const { achievement, userId } = event.detail;

      await PushNotificationService.sendAchievement(
        userId,
        achievement.title,
        achievement.id
      );
    });
  }

  /**
   * Интеграция с системой Вселенной
   */
  static setupUniverseIntegrations() {
    window.addEventListener('universe:message', async (event: any) => {
      const { message, userId } = event.detail;

      await PushNotificationService.sendUniverseMessage(userId, message);
    });
  }

  /**
   * Интеграция с системой подписки
   */
  static setupSubscriptionIntegrations() {
    window.addEventListener('subscription:reminder', async (event: any) => {
      const { userId, message } = event.detail;

      await PushNotificationService.sendSubscriptionReminder(userId, message);
    });
  }

  /**
   * Инициализация всех интеграций
   */
  static initializeAll() {
    this.setupPactIntegrations();
    this.setupAchievementIntegrations();
    this.setupUniverseIntegrations();
    this.setupSubscriptionIntegrations();

    console.log('Push notification integrations initialized');
  }

  /**
   * Запланированные уведомления (для ежедневных напоминаний)
   */
  static async scheduleDailyReminders() {
    try {
      // Получаем всех пользователей с активными пактами
      const { data: activePacts, error } = await supabase
        .from('pacts')
        .select(
          `
          id,
          title,
          user_id,
          profiles!inner(name)
        `
        )
        .eq('status', 'active');

      if (error) throw error;

      // Группируем по пользователям
      const userPacts = activePacts?.reduce((acc: any, pact: any) => {
        const userId = pact.user_id;
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push(pact);
        return acc;
      }, {});

      // Отправляем напоминания
      for (const userId in userPacts) {
        const pacts = userPacts[userId];
        const mainPact = pacts[0]; // Берем первый активный пакт

        await PushNotificationService.sendDailyReminder(userId, mainPact.title);
      }

      console.log(
        `Daily reminders sent to ${Object.keys(userPacts).length} users`
      );
    } catch (error) {
      console.error('Error sending daily reminders:', error);
    }
  }

  /**
   * Отправка еженедельных мотивационных сообщений
   */
  static async sendWeeklyMotivation() {
    const motivationalMessages = [
      'Ваш путь к просветлению продолжается! Каждый день - это новая возможность стать лучше ✨',
      'Вселенная видит ваши усилия. Продолжайте идти по пути аскезы! 🌟',
      'Медитация и самодисциплина приближают вас к истинному счастью 🧘‍♀️',
      'Ваша духовная практика растет с каждым днем. Гордитесь своими достижениями! 🏆',
      'Космическая энергия поддерживает вас на пути развития 🌌',
    ];

    try {
      // Получаем всех активных пользователей
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id')
        .gte('total_days', 1); // Пользователи с хотя бы одним днем активности

      if (error) throw error;

      const randomMessage =
        motivationalMessages[
          Math.floor(Math.random() * motivationalMessages.length)
        ];

      const userIds = users?.map(user => user.id) || [];

      if (userIds.length > 0) {
        await PushNotificationService.sendBulk(userIds, {
          type: 'universe_message',
          title: 'Еженедельное напутствие 🌟',
          body: randomMessage,
        });
      }

      console.log(`Weekly motivation sent to ${userIds.length} users`);
    } catch (error) {
      console.error('Error sending weekly motivation:', error);
    }
  }
}
