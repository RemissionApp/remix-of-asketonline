
import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'achievement' | 'artifact' | 'milestone' | 'energy' | 'reminder';
  title: string;
  message: string;
  icon?: string;
  action?: () => void;
  actionLabel?: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  showAchievementUnlocked: (
    title: string,
    description: string,
    language?: string
  ) => void;
  showArtifactObtained: (
    name: string,
    rarity: string,
    language?: string
  ) => void;
  showMilestoneReached: (
    milestone: string,
    reward: string,
    language?: string
  ) => void;
  showEnergyGained: (amount: number, language?: string) => void;
  showDailyReminder: (message: string, language?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationProvider'
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const showNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      toast(notification.title, {
        description: notification.message,
        duration: notification.duration || 5000,
        action:
          notification.action && notification.actionLabel
            ? {
                label: notification.actionLabel,
                onClick: notification.action,
              }
            : undefined,
      });
    },
    []
  );

  const showAchievementUnlocked = useCallback(
    (title: string, description: string, language: string = 'en') => {
      showNotification({
        type: 'achievement',
        title:
          language === 'ru'
            ? '🏆 Достижение разблокировано!'
            : language === 'es'
              ? '🏆 ¡Logro desbloqueado!'
              : '🏆 Achievement Unlocked!',
        message: `${title}: ${description}`,
        icon: '🏆',
        duration: 8000,
      });
    },
    [showNotification]
  );

  const showArtifactObtained = useCallback(
    (name: string, rarity: string, language: string = 'en') => {
      const rarityEmojis = {
        common: '⚪',
        rare: '🔵',
        epic: '🟣',
        legendary: '🟡',
      };

      showNotification({
        type: 'artifact',
        title:
          language === 'ru'
            ? '🔮 Новый артефакт!'
            : language === 'es'
              ? '🔮 ¡Nuevo artefacto!'
              : '🔮 New Artifact!',
        message: `${rarityEmojis[rarity as keyof typeof rarityEmojis] || '✨'} ${name} (${rarity})`,
        icon: '🔮',
        duration: 6000,
      });
    },
    [showNotification]
  );

  const showMilestoneReached = useCallback(
    (milestone: string, reward: string, language: string = 'en') => {
      showNotification({
        type: 'milestone',
        title:
          language === 'ru'
            ? '🎯 Этап достигнут!'
            : language === 'es'
              ? '🎯 ¡Hito alcanzado!'
              : '🎯 Milestone Reached!',
        message: `${milestone}: ${reward}`,
        icon: '🎯',
        duration: 7000,
      });
    },
    [showNotification]
  );

  const showEnergyGained = useCallback(
    (amount: number, language: string = 'en') => {
      showNotification({
        type: 'energy',
        title:
          language === 'ru'
            ? '⚡ Энергия получена!'
            : language === 'es'
              ? '⚡ ¡Energía obtenida!'
              : '⚡ Energy Gained!',
        message:
          language === 'ru'
            ? `+${amount} энергии`
            : language === 'es'
              ? `+${amount} energía`
              : `+${amount} energy`,
        icon: '⚡',
        duration: 3000,
      });
    },
    [showNotification]
  );

  const showDailyReminder = useCallback(
    (message: string, language: string = 'en') => {
      showNotification({
        type: 'reminder',
        title:
          language === 'ru'
            ? '🔔 Напоминание'
            : language === 'es'
              ? '🔔 Recordatorio'
              : '🔔 Reminder',
        message,
        icon: '🔔',
        duration: 10000,
      });
    },
    [showNotification]
  );

  const value: NotificationContextType = {
    showNotification,
    showAchievementUnlocked,
    showArtifactObtained,
    showMilestoneReached,
    showEnergyGained,
    showDailyReminder,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
