import React from 'react';
import { Calendar, Flame, Star, Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useUserProgress } from '@/hooks/useUserProgress';

export const UserStatsDisplay: React.FC = () => {
  const { language, userProfile } = useAppStore();
  const { stats } = useUserProgress();

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

  // Calculate days since user joined (mock for now - will use real data later)
  const daysActive = 7; // Mock value for now

  const statsData = [
    {
      icon: Calendar,
      label: getText('daysActive'),
      value: daysActive || 0,
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
  ];

  return (
    <div className="cosmic-block rounded-lg p-space-md mb-space-lg">
      <h3 className="text-cosmic-text font-medium mb-space-md">
        {getText('stats')}
      </h3>
      
      <div className="grid grid-cols-2 gap-space-sm">
        {statsData.map((stat, index) => (
          <div key={index} className="text-center p-space-sm rounded-lg bg-cosmic-accent/5">
            <div className="flex items-center justify-center mb-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-cosmic-text/60">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};