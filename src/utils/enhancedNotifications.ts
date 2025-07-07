// Enhanced Notifications с богатым контентом и действиями
export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface EnhancedNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  timestamp?: number;
  renotify?: boolean;
}

export interface NotificationResult {
  success: boolean;
  permission: NotificationPermission;
  error?: string;
}

/**
 * Проверяет поддержку уведомлений
 */
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

/**
 * Проверяет разрешение на уведомления
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

/**
 * Запрашивает разрешение на уведомления
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) return 'denied';
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

/**
 * Показывает уведомление с расширенными возможностями
 */
export const showEnhancedNotification = async (
  options: EnhancedNotificationOptions
): Promise<NotificationResult> => {
  if (!isNotificationSupported()) {
    return { 
      success: false, 
      permission: 'denied', 
      error: 'Notifications not supported' 
    };
  }

  const permission = getNotificationPermission();
  if (permission !== 'granted') {
    return { success: false, permission };
  }

  try {
    // Проверяем поддержку Service Worker для расширенных уведомлений
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Используем Service Worker для показа уведомления
      const registration = await navigator.serviceWorker.ready;
      const notificationOptions: any = {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge || '/icon-72.png',
        tag: options.tag,
        data: options.data,
        actions: options.actions || [],
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        timestamp: options.timestamp || Date.now(),
        renotify: options.renotify || false
      };
      
      // Добавляем дополнительные свойства если поддерживаются
      if (options.image) notificationOptions.image = options.image;
      if (options.vibrate) notificationOptions.vibrate = options.vibrate;
      
      await registration.showNotification(options.title, notificationOptions);
    } else {
      // Fallback к обычному уведомлению
      const basicNotificationOptions: any = {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        timestamp: options.timestamp || Date.now(),
        renotify: options.renotify || false
      };
      
      // Добавляем vibrate только если поддерживается
      if (options.vibrate && 'vibrate' in navigator) {
        navigator.vibrate(options.vibrate);
      }
      
      const notification = new Notification(options.title, basicNotificationOptions);

      // Добавляем обработчики событий
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
        
        // Обработка клика
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
      };
    }

    return { success: true, permission: 'granted' };
  } catch (error: any) {
    console.error('Error showing notification:', error);
    return { 
      success: false, 
      permission: 'granted', 
      error: error.message 
    };
  }
};

/**
 * Предустановленные типы уведомлений для приложения
 */
export const notificationTemplates = {
  // Напоминание о ежедневной аскезе
  dailyReminder: (pactTitle: string, dayNumber: number): EnhancedNotificationOptions => ({
    title: 'Время выполнить аскезу! 🔥',
    body: `День ${dayNumber}: "${pactTitle}". Не забудь подтвердить выполнение.`,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: 'daily-reminder',
    requireInteraction: true,
    vibrate: [150, 100, 150],
    data: { type: 'daily_reminder', url: '/main' },
    actions: [
      { action: 'complete', title: 'Выполнено ✓', icon: '/icon-72.png' },
      { action: 'remind_later', title: 'Напомнить позже' }
    ]
  }),

  // Завершение аскезы
  pactCompleted: (pactTitle: string, totalDays: number): EnhancedNotificationOptions => ({
    title: 'Аскеза завершена! 🏆',
    body: `Поздравляем! Вы успешно прошли "${pactTitle}" за ${totalDays} дней!`,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: 'pact-completed',
    requireInteraction: true,
    vibrate: [100, 50, 100, 50, 200, 50, 100],
    data: { type: 'pact_complete', url: '/profile' },
    actions: [
      { action: 'share', title: 'Поделиться 📱' },
      { action: 'new_pact', title: 'Новая аскеза' }
    ]
  }),

  // Напоминание о медитации
  meditationReminder: (): EnhancedNotificationOptions => ({
    title: 'Время медитации 🧘‍♀️',
    body: 'Найдите несколько минут для медитативной практики и внутреннего покоя.',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: 'meditation-reminder',
    vibrate: [80, 80, 80],
    data: { type: 'meditation_reminder', url: '/meditation' },
    actions: [
      { action: 'start_meditation', title: 'Начать медитацию' },
      { action: 'remind_later', title: 'Позже' }
    ]
  }),

  // Сообщение от Вселенной
  universeMessage: (message: string): EnhancedNotificationOptions => ({
    title: 'Сообщение от Вселенной 🌌',
    body: message.length > 100 ? message.substring(0, 97) + '...' : message,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: 'universe-message',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { type: 'universe_message', url: '/universe', fullMessage: message },
    actions: [
      { action: 'read_full', title: 'Читать полностью' },
      { action: 'share', title: 'Поделиться' }
    ]
  }),

  // Новое достижение
  newAchievement: (title: string, description: string): EnhancedNotificationOptions => ({
    title: 'Новое достижение! 🏆',
    body: `${title}: ${description}`,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: 'achievement',
    requireInteraction: true,
    vibrate: [100, 50, 100, 50, 100],
    data: { type: 'achievement', url: '/profile' },
    actions: [
      { action: 'view', title: 'Посмотреть' },
      { action: 'share', title: 'Поделиться' }
    ]
  }),

  // Напоминание о подписке
  subscriptionReminder: (daysLeft: number): EnhancedNotificationOptions => ({
    title: 'PRO подписка истекает',
    body: `До окончания подписки осталось ${daysLeft} дней. Продлите для доступа ко всем функциям.`,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: 'subscription',
    vibrate: [150, 100, 150],
    data: { type: 'subscription_reminder', url: '/comparison' },
    actions: [
      { action: 'renew', title: 'Продлить' },
      { action: 'remind_later', title: 'Напомнить позже' }
    ]
  }),

  // Мотивационное сообщение
  motivational: (message: string): EnhancedNotificationOptions => ({
    title: 'Мотивация дня 💪',
    body: message,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: 'motivation',
    vibrate: [100, 100, 100],
    data: { type: 'motivation', url: '/main' },
    actions: [
      { action: 'view', title: 'Узнать больше' }
    ]
  })
};

/**
 * Менеджер уведомлений для централизованного управления
 */
export const createNotificationManager = () => {
  let permissionGranted = false;

  const init = async (): Promise<boolean> => {
    const permission = await requestNotificationPermission();
    permissionGranted = permission === 'granted';
    return permissionGranted;
  };

  const isEnabled = (): boolean => permissionGranted;

  const show = async (options: EnhancedNotificationOptions): Promise<NotificationResult> => {
    if (!permissionGranted) {
      const permission = await requestNotificationPermission();
      permissionGranted = permission === 'granted';
      
      if (!permissionGranted) {
        return { success: false, permission };
      }
    }

    return showEnhancedNotification(options);
  };

  // Обертки для шаблонов
  const templates = {
    dailyReminder: (pactTitle: string, dayNumber: number) => 
      show(notificationTemplates.dailyReminder(pactTitle, dayNumber)),
    
    pactCompleted: (pactTitle: string, totalDays: number) => 
      show(notificationTemplates.pactCompleted(pactTitle, totalDays)),
    
    meditationReminder: () => 
      show(notificationTemplates.meditationReminder()),
    
    universeMessage: (message: string) => 
      show(notificationTemplates.universeMessage(message)),
    
    newAchievement: (title: string, description: string) => 
      show(notificationTemplates.newAchievement(title, description)),
    
    subscriptionReminder: (daysLeft: number) => 
      show(notificationTemplates.subscriptionReminder(daysLeft)),
    
    motivational: (message: string) => 
      show(notificationTemplates.motivational(message))
  };

  return {
    init,
    isEnabled,
    show,
    templates
  };
};