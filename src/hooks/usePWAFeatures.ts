// Хук для управления всеми PWA функциями
import { useEffect, useState } from 'react';
import { shareUtils } from '@/utils/webShare';
import { hapticFeedback, createHapticManager } from '@/utils/hapticFeedback';
import { createNotificationManager } from '@/utils/enhancedNotifications';
import { backgroundSync } from '@/utils/backgroundSync';
import { useToast } from '@/hooks/use-toast';

export const usePWAFeatures = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [backgroundSyncStatus, setBackgroundSyncStatus] = useState(backgroundSync.getSyncStatus());
  const { toast } = useToast();

  // Менеджеры для различных PWA функций
  const [hapticManager] = useState(() => createHapticManager());
  const [notificationManager] = useState(() => createNotificationManager());

  useEffect(() => {
    initializePWAFeatures();
  }, []);

  const initializePWAFeatures = async () => {
    try {
      // Инициализация уведомлений
      const notificationPermission = await notificationManager.init();
      setNotificationsEnabled(notificationPermission);

      // Загрузка настроек из localStorage
      const savedHapticSetting = localStorage.getItem('haptic-enabled');
      if (savedHapticSetting !== null) {
        const enabled = JSON.parse(savedHapticSetting);
        setHapticEnabled(enabled);
        hapticManager.setEnabled(enabled);
      }

      setIsInitialized(true);
      console.log('PWA features initialized successfully');
    } catch (error) {
      console.error('Error initializing PWA features:', error);
      toast({
        title: "Ошибка инициализации",
        description: "Не удалось инициализировать некоторые функции приложения",
        variant: "destructive"
      });
    }
  };

  // Обновление статуса Background Sync
  useEffect(() => {
    const updateSyncStatus = () => {
      setBackgroundSyncStatus(backgroundSync.getSyncStatus());
    };

    const interval = setInterval(updateSyncStatus, 5000);
    window.addEventListener('online', updateSyncStatus);
    window.addEventListener('offline', updateSyncStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', updateSyncStatus);
      window.removeEventListener('offline', updateSyncStatus);
    };
  }, []);

  // Функции для управления настройками
  const toggleHaptic = (enabled: boolean) => {
    setHapticEnabled(enabled);
    hapticManager.setEnabled(enabled);
    localStorage.setItem('haptic-enabled', JSON.stringify(enabled));
    
    if (enabled) {
      hapticManager.tap();
    }
  };

  // Web Share функции
  const shareContent = {
    pactProgress: shareUtils.sharePactProgress,
    achievement: shareUtils.shareAchievement,
    universeWisdom: shareUtils.shareUniverseWisdom,
    app: shareUtils.shareApp
  };

  // Haptic Feedback функции
  const haptic = {
    tap: () => hapticEnabled ? hapticManager.tap() : Promise.resolve({ success: false, supported: true }),
    success: () => hapticEnabled ? hapticManager.success() : Promise.resolve({ success: false, supported: true }),
    error: () => hapticEnabled ? hapticManager.error() : Promise.resolve({ success: false, supported: true }),
    notification: () => hapticEnabled ? hapticManager.notification() : Promise.resolve({ success: false, supported: true }),
    buttonTap: () => hapticEnabled ? hapticFeedback.buttonTap() : Promise.resolve({ success: false, supported: true }),
    dayCompleted: () => hapticEnabled ? hapticFeedback.dayCompleted() : Promise.resolve({ success: false, supported: true }),
    pactCompleted: () => hapticEnabled ? hapticFeedback.pactCompleted() : Promise.resolve({ success: false, supported: true }),
    meditationStart: () => hapticEnabled ? hapticFeedback.meditationStart() : Promise.resolve({ success: false, supported: true }),
    meditationEnd: () => hapticEnabled ? hapticFeedback.meditationEnd() : Promise.resolve({ success: false, supported: true }),
    warning: () => hapticEnabled ? hapticFeedback.warning() : Promise.resolve({ success: false, supported: true }),
    reminder: () => hapticEnabled ? hapticFeedback.reminder() : Promise.resolve({ success: false, supported: true }),
    energyBoost: () => hapticEnabled ? hapticFeedback.energyBoost() : Promise.resolve({ success: false, supported: true })
  };

  // Enhanced Notifications функции
  const notifications = {
    dailyReminder: notificationManager.templates.dailyReminder,
    pactCompleted: notificationManager.templates.pactCompleted,
    meditationReminder: notificationManager.templates.meditationReminder,
    universeMessage: notificationManager.templates.universeMessage,
    newAchievement: notificationManager.templates.newAchievement,
    subscriptionReminder: notificationManager.templates.subscriptionReminder,
    motivational: notificationManager.templates.motivational
  };

  // Background Sync функции
  const sync = {
    registerPactDayComplete: (pactId: string, date: string) => 
      backgroundSync.registerSync('pact_day_complete', { pactId, date }),
    
    registerPactBreak: (pactId: string) => 
      backgroundSync.registerSync('pact_break', { pactId }),
    
    registerUniverseQuestion: (question: string, answer: string) => 
      backgroundSync.registerSync('universe_question', { question, answer }),
    
    registerUserProfileUpdate: (data: any) => 
      backgroundSync.registerSync('user_profile_update', data),
    
    registerMissionProgress: (missionId: string, progress: any) => 
      backgroundSync.registerSync('mission_progress', { missionId, progress }),
    
    getPendingTasks: () => backgroundSync.getPendingTasks(),
    clearPendingTasks: () => backgroundSync.clearPendingTasks(),
    getStatus: () => backgroundSync.getSyncStatus()
  };

  return {
    // Статус инициализации
    isInitialized,
    
    // Настройки
    hapticEnabled,
    notificationsEnabled,
    backgroundSyncStatus,
    toggleHaptic,
    
    // Функции PWA
    share: shareContent,
    haptic,
    notifications,
    sync,
    
    // Утилиты
    toast
  };
};