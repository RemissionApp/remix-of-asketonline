import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { Bell, Gift, Star, Zap, Trophy } from 'lucide-react';

interface Notification {
  id: string;
  type: 'achievement' | 'artifact' | 'milestone' | 'energy' | 'reminder';
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: () => void;
  actionLabel?: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  showAchievementUnlocked: (title: string, description: string) => void;
  showArtifactObtained: (name: string, rarity: string) => void;
  showMilestoneReached: (milestone: string, reward: string) => void;
  showEnergyGained: (amount: number) => void;
  showDailyReminder: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { language } = useAppStore();

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    const content = (
      <div className="flex items-start gap-3">
        {notification.icon && (
          <div className="flex-shrink-0 text-cosmic-gold">
            {notification.icon}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-cosmic-gold mb-1">
            {notification.title}
          </h4>
          <p className="text-cosmic-silver text-sm">
            {notification.message}
          </p>
          {notification.action && notification.actionLabel && (
            <button
              onClick={notification.action}
              className="mt-2 px-3 py-1 bg-cosmic-accent hover:bg-cosmic-accent/80 text-white text-xs rounded transition-colors"
            >
              {notification.actionLabel}
            </button>
          )}
        </div>
      </div>
    );

    toast.custom(() => content, {
      duration: notification.duration || 5000,
      style: {
        background: 'hsl(var(--cosmic-dark))',
        border: '1px solid hsl(var(--cosmic-accent) / 0.3)',
        color: 'white',
      },
    });
  }, []);

  const showAchievementUnlocked = useCallback((title: string, description: string) => {
    showNotification({
      type: 'achievement',
      title: language === 'ru' ? '🏆 Достижение разблокировано!' 
           : language === 'es' ? '🏆 ¡Logro desbloqueado!' 
           : '🏆 Achievement Unlocked!',
      message: `${title}: ${description}`,
      icon: <Trophy className="w-6 h-6" />,
      duration: 8000,
    });
  }, [language, showNotification]);

  const showArtifactObtained = useCallback((name: string, rarity: string) => {
    const rarityEmojis = {
      common: '⚪',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟡',
    };

    showNotification({
      type: 'artifact',
      title: language === 'ru' ? '🔮 Новый артефакт!' 
           : language === 'es' ? '🔮 ¡Nuevo artefacto!' 
           : '🔮 New Artifact!',
      message: `${rarityEmojis[rarity as keyof typeof rarityEmojis] || '✨'} ${name} (${rarity})`,
      icon: <Star className="w-6 h-6" />,
      duration: 6000,
    });
  }, [language, showNotification]);

  const showMilestoneReached = useCallback((milestone: string, reward: string) => {
    showNotification({
      type: 'milestone',
      title: language === 'ru' ? '🎯 Этап достигнут!' 
           : language === 'es' ? '🎯 ¡Hito alcanzado!' 
           : '🎯 Milestone Reached!',
      message: `${milestone}: ${reward}`,
      icon: <Gift className="w-6 h-6" />,
      duration: 7000,
    });
  }, [language, showNotification]);

  const showEnergyGained = useCallback((amount: number) => {
    showNotification({
      type: 'energy',
      title: language === 'ru' ? '⚡ Энергия получена!' 
           : language === 'es' ? '⚡ ¡Energía obtenida!' 
           : '⚡ Energy Gained!',
      message: language === 'ru' ? `+${amount} энергии` 
             : language === 'es' ? `+${amount} energía` 
             : `+${amount} energy`,
      icon: <Zap className="w-6 h-6" />,
      duration: 3000,
    });
  }, [language, showNotification]);

  const showDailyReminder = useCallback((message: string) => {
    showNotification({
      type: 'reminder',
      title: language === 'ru' ? '🔔 Напоминание' 
           : language === 'es' ? '🔔 Recordatorio' 
           : '🔔 Reminder',
      message,
      icon: <Bell className="w-6 h-6" />,
      duration: 10000,
    });
  }, [language, showNotification]);

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