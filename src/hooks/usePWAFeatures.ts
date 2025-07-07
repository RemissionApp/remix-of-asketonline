// Хук для управления всеми PWA функциями
import { useEffect, useState } from 'react';
import { shareUtils } from '@/utils/webShare';
import { hapticFeedback, createHapticManager } from '@/utils/hapticFeedback';
import { createNotificationManager } from '@/utils/enhancedNotifications';
import { backgroundSync } from '@/utils/backgroundSync';
import { persistentStorage } from '@/utils/persistentStorage';
import { screenWakeLock, meditationWakeLock } from '@/utils/screenWakeLock';
import { deviceOrientation, meditationOrientation, responsiveOrientation } from '@/utils/deviceOrientation';
import { badgeManager, notificationBadges, persistentBadge } from '@/utils/badgeAPI';
import { advancedCache, cacheServiceWorker } from '@/utils/advancedCaching';
import { useToast } from '@/hooks/use-toast';

export const usePWAFeatures = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [backgroundSyncStatus, setBackgroundSyncStatus] = useState(backgroundSync.getSyncStatus());
  const [persistentStorageGranted, setPersistentStorageGranted] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(screenWakeLock.getStatus().supported);
  const [orientationLocked, setOrientationLocked] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
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

      // Инициализация Persistent Storage
      const persistent = await persistentStorage.isPersistent();
      setPersistentStorageGranted(persistent);

      // Инициализация Advanced Caching
      await advancedCache.initializeStrategies();
      cacheServiceWorker.setupServiceWorkerCache();

      // Инициализация Badge API
      await persistentBadge.restoreBadge();
      setBadgeCount(badgeManager.getCurrentCount());

      // Инициализация Device Orientation
      responsiveOrientation.setupResponsiveClasses();
      setWakeLockSupported(screenWakeLock.getStatus().supported);

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

  const requestPersistentStorage = async () => {
    const result = await persistentStorage.request();
    setPersistentStorageGranted(result.persistent || false);
    return result;
  };

  const updateBadgeCount = async (count: number) => {
    const result = await persistentBadge.setBadgeAndSave(count);
    if (result.success) {
      setBadgeCount(count);
    }
    return result;
  };

  const clearBadge = async () => {
    const result = await persistentBadge.clearBadgeAndSave();
    if (result.success) {
      setBadgeCount(0);
    }
    return result;
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

  // Screen Wake Lock функции
  const wakeLock = {
    start: screenWakeLock.request.bind(screenWakeLock),
    release: screenWakeLock.release.bind(screenWakeLock),
    getStatus: screenWakeLock.getStatus.bind(screenWakeLock),
    meditation: {
      start: meditationWakeLock.startMeditation,
      end: meditationWakeLock.endMeditation,
      getStatus: meditationWakeLock.getMeditationStatus
    }
  };

  // Device Orientation функции
  const orientation = {
    getCurrentOrientation: deviceOrientation.getCurrentOrientation.bind(deviceOrientation),
    lockOrientation: deviceOrientation.lockOrientation.bind(deviceOrientation),
    unlockOrientation: deviceOrientation.unlockOrientation.bind(deviceOrientation),
    getStatus: deviceOrientation.getStatus.bind(deviceOrientation),
    meditation: {
      lock: meditationOrientation.lockForMeditation,
      unlock: meditationOrientation.unlockAfterMeditation
    }
  };

  // Persistent Storage функции
  const storage = {
    isSupported: persistentStorage.isSupported,
    isPersistent: persistentStorage.isPersistent,
    request: requestPersistentStorage,
    getEstimate: persistentStorage.getEstimate,
    formatSize: persistentStorage.formatSize
  };

  // Badge функции
  const badge = {
    set: updateBadgeCount,
    clear: clearBadge,
    increment: badgeManager.incrementBadge.bind(badgeManager),
    decrement: badgeManager.decrementBadge.bind(badgeManager),
    getCount: () => badgeCount,
    notifications: notificationBadges
  };

  // Advanced Caching функции
  const cache = {
    handleRequest: advancedCache.handleRequest.bind(advancedCache),
    preload: advancedCache.preloadCriticalResources.bind(advancedCache),
    getStats: advancedCache.getCacheStats.bind(advancedCache),
    clear: advancedCache.clearCache.bind(advancedCache)
  };

  return {
    // Статус инициализации
    isInitialized,
    
    // Настройки
    hapticEnabled,
    notificationsEnabled,
    backgroundSyncStatus,
    persistentStorageGranted,
    wakeLockSupported,
    orientationLocked,
    badgeCount,
    toggleHaptic,
    
    // Функции PWA
    share: shareContent,
    haptic,
    notifications,
    sync,
    wakeLock,
    orientation,
    storage,
    badge,
    cache,
    
    // Утилиты
    toast
  };
};