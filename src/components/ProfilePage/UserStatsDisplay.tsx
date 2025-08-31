import React, { useMemo } from 'react';
import { Calendar, Flame, Star, Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useUserProgress } from '@/hooks/useUserProgress';
import { ProfileCard } from './ProfileCard';
import { ProfileMetric } from './ProfileMetric';

export const UserStatsDisplay: React.FC = () => {
  const { language, userProfile } = useAppStore();
  const { stats, isLoading } = useUserProgress();

  const getText = (key: string) => {
    const texts = {
      ru: {
        daysActive: 'Дней в приложении',
        streak: 'Серия дней',
        missions: 'Миссий выполнено',
        artifacts: 'Артефактов найдено',
        stats: 'Статистика'
      },
      es: {
        daysActive: 'Días en la app',
        streak: 'Racha de días',
        missions: 'Misiones completadas',
        artifacts: 'Artefactos encontrados',
        stats: 'Estadísticas'
      },
      en: {
        daysActive: 'Days in app',
        streak: 'Day streak',
        missions: 'Missions completed',
        artifacts: 'Artifacts found',
        stats: 'Statistics'
      }
    };
    return texts[language]?.[key] || texts.en[key] || key;
  };

  // Calculate days since user joined - using fallback for now
  const daysActive = useMemo(() => {
    // TODO: Add createdAt to UserProfile interface when available from backend
    // For now, use a reasonable default based on user activity
    return Math.max(stats.missionsCompleted || 1, 1);
  }, [stats.missionsCompleted]);

  const statsData = useMemo(() => [
    {
      icon: Calendar,
      label: getText('daysActive'),
      value: daysActive || 1,
      color: 'text-cosmic-silver'
    },
    {
      icon: Flame,
      label: getText('streak'),
      value: stats.currentStreak || 0,
      color: 'text-orange-400'
    },
    {
      icon: Target,
      label: getText('missions'),
      value: stats.missionsCompleted || 0,
      color: 'text-cosmic-accent'
    },
    {
      icon: Star,
      label: getText('artifacts'),
      value: stats.artifactsCollected || 0,
      color: 'text-cosmic-gold'
    }
  ], [daysActive, stats, getText]);

  if (isLoading) {
    return (
      <ProfileCard variant="compact">
        <div className="animate-pulse">
          <div className="h-4 bg-cosmic-accent/20 rounded mb-space-md w-24"></div>
          <div className="grid grid-cols-2 gap-space-sm">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-cosmic-accent/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard variant="compact">
      <h3 className="text-cosmic-text font-medium mb-space-md">
        {getText('stats')}
      </h3>
      
      <div className="grid grid-cols-2 gap-space-sm">
        {statsData.map((stat, index) => (
          <ProfileMetric
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>
    </ProfileCard>
  );
};