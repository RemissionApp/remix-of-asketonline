import { supabase } from '@/integrations/supabase/client';

export interface NotificationData {
  type:
    | 'daily_reminder'
    | 'pact_start'
    | 'pact_complete'
    | 'meditation_reminder'
    | 'universe_message'
    | 'achievement'
    | 'subscription_reminder'
    | 'test';
  title: string;
  body: string;
  data?: Record<string, any>;
  userId?: string;
  userIds?: string[];
}

export class PushNotificationService {
  // Клиентский rate-limit: не дёргать одну и ту же отправку чаще, чем раз в 60 сек.
  private static lastSentAt = new Map<string, number>();
  private static readonly THROTTLE_MS = 60_000;

  private static throttleKey(n: NotificationData): string {
    return `${n.type}:${n.userId ?? ''}:${(n.userIds ?? []).join(',')}`;
  }

  private static async invokeWithRetry(
    notification: NotificationData,
    attempts = 3,
  ): Promise<{ data: unknown; error: unknown }> {
    let lastErr: unknown = null;
    for (let i = 0; i < attempts; i++) {
      const { data, error } = await supabase.functions.invoke(
        'send-push-notification',
        { body: notification },
      );
      if (!error) return { data, error: null };
      lastErr = error;
      // exponential backoff: 300ms, 900ms, 2700ms
      await new Promise(r => setTimeout(r, 300 * Math.pow(3, i)));
    }
    return { data: null, error: lastErr };
  }

  /**
   * Отправляет push-уведомление через Edge Function
   */
  static async send(notification: NotificationData): Promise<boolean> {
    try {
      const key = this.throttleKey(notification);
      const now = Date.now();
      const last = this.lastSentAt.get(key) ?? 0;
      if (now - last < this.THROTTLE_MS) {
        console.warn('[push] throttled:', key);
        return false;
      }
      this.lastSentAt.set(key, now);

      const { error } = await this.invokeWithRetry(notification);

      if (error) {
        console.error('Ошибка отправки push-уведомления:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Ошибка сервиса push-уведомлений:', error);
      return false;
    }
  }

  /**
   * Отправляет ежедневное напоминание о выполнении аскезы
   */
  static async sendDailyReminder(
    userId: string,
    pactTitle?: string
  ): Promise<boolean> {
    return this.send({
      type: 'daily_reminder',
      title: 'Ежедневное напоминание',
      body: pactTitle
        ? `Не забудьте подтвердить выполнение аскезы "${pactTitle}"`
        : 'Не забудьте подтвердить выполнение вашей аскезы',
      userId,
      data: { pactTitle },
    });
  }

  /**
   * Отправляет уведомление о начале аскезы
   */
  static async sendPactStart(
    userId: string,
    pactTitle: string,
    pactId: string
  ): Promise<boolean> {
    return this.send({
      type: 'pact_start',
      title: 'Начало аскезы',
      body: `Ваша аскеза "${pactTitle}" начинается сегодня! 🚀`,
      userId,
      data: { pactTitle, pactId },
    });
  }

  /**
   * Отправляет уведомление о завершении аскезы
   */
  static async sendPactComplete(
    userId: string,
    pactTitle: string,
    pactId: string
  ): Promise<boolean> {
    return this.send({
      type: 'pact_complete',
      title: 'Аскеза завершена! 🎉',
      body: `Поздравляем! Вы успешно завершили "${pactTitle}"`,
      userId,
      data: { pactTitle, pactId },
    });
  }

  /**
   * Отправляет напоминание о медитации
   */
  static async sendMeditationReminder(userId: string): Promise<boolean> {
    return this.send({
      type: 'meditation_reminder',
      title: 'Время медитации 🧘‍♀️',
      body: 'Найдите несколько минут для медитативной практики',
      userId,
    });
  }

  /**
   * Отправляет сообщение от Вселенной
   */
  static async sendUniverseMessage(
    userId: string,
    message: string
  ): Promise<boolean> {
    return this.send({
      type: 'universe_message',
      title: 'Сообщение от Вселенной ✨',
      body: message,
      userId,
      data: { message },
    });
  }

  /**
   * Отправляет уведомление о новом достижении
   */
  static async sendAchievement(
    userId: string,
    achievementTitle: string,
    achievementId: string
  ): Promise<boolean> {
    return this.send({
      type: 'achievement',
      title: 'Новое достижение! 🏆',
      body: `Вы получили достижение: ${achievementTitle}`,
      userId,
      data: { achievementTitle, achievementId },
    });
  }

  /**
   * Отправляет напоминание о подписке
   */
  static async sendSubscriptionReminder(
    userId: string,
    message?: string
  ): Promise<boolean> {
    return this.send({
      type: 'subscription_reminder',
      title: 'Напоминание о подписке',
      body:
        message ||
        'Ваша PRO-подписка скоро истекает. Продлите её, чтобы не потерять доступ к премиум-функциям',
      userId,
      data: { message },
    });
  }

  /**
   * Отправляет тестовое уведомление
   */
  static async sendTest(userId: string): Promise<boolean> {
    return this.send({
      type: 'test',
      title: 'Тестовое уведомление',
      body: 'Поздравляем! Push-уведомления работают корректно 🎉',
      userId,
    });
  }

  /**
   * Массовая отправка уведомлений
   */
  static async sendBulk(
    userIds: string[],
    notification: Omit<NotificationData, 'userId' | 'userIds'>
  ): Promise<boolean> {
    return this.send({
      ...notification,
      userIds,
    });
  }
}
