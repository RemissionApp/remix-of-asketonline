import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap, Target, Crown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNotifications } from '@/components/notifications/NotificationSystem';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'missions' | 'artifacts' | 'energy' | 'consistency' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: {
    type:
      | 'missions_completed'
      | 'artifacts_collected'
      | 'energy_earned'
      | 'daily_streak'
      | 'special_event';
    target: number;
    current?: number;
  };
  rewards: {
    energyPoints: number;
    title?: string;
  };
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementSystemProps {
  userStats: {
    missionsCompleted: number;
    artifactsCollected: number;
    totalEnergyEarned: number;
    currentStreak: number;
    specialEvents: string[];
  };
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  userStats,
}) => {
  const { language } = useAppStore();
  const { showAchievementUnlocked } = useNotifications();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const getText = (key: string) => {
    const texts = {
      ru: {
        achievements: 'Достижения',
        progress: 'Прогресс',
        unlocked: 'Разблокировано',
        locked: 'Заблокировано',
        reward: 'Награда',
        missions: 'Миссии',
        artifacts: 'Артефакты',
        energy: 'Энергия',
        consistency: 'Постоянство',
        special: 'Особые',
        // Achievement titles
        first_mission_title: 'Первый шаг',
        first_mission_desc: 'Выполните свою первую миссию',
        mission_veteran_title: 'Ветеран миссий',
        mission_veteran_desc: 'Выполните 10 миссий',
        mission_master_title: 'Мастер миссий',
        mission_master_desc: 'Выполните 50 миссий',
        first_artifact_title: 'Коллекционер',
        first_artifact_desc: 'Получите свой первый артефакт',
        artifact_hunter_title: 'Охотник за артефактами',
        artifact_hunter_desc: 'Соберите 5 артефактов',
        energy_collector_title: 'Сборщик энергии',
        energy_collector_desc: 'Накопите 100 энергетических очков',
        streak_keeper_title: 'Хранитель традиций',
        streak_keeper_desc: 'Поддерживайте активность 7 дней подряд',
      },
      es: {
        achievements: 'Logros',
        progress: 'Progreso',
        unlocked: 'Desbloqueado',
        locked: 'Bloqueado',
        reward: 'Recompensa',
        missions: 'Misiones',
        artifacts: 'Artefactos',
        energy: 'Energía',
        consistency: 'Consistencia',
        special: 'Especiales',
        first_mission_title: 'Primer paso',
        first_mission_desc: 'Completa tu primera misión',
        mission_veteran_title: 'Veterano de misiones',
        mission_veteran_desc: 'Completa 10 misiones',
        mission_master_title: 'Maestro de misiones',
        mission_master_desc: 'Completa 50 misiones',
        first_artifact_title: 'Coleccionista',
        first_artifact_desc: 'Obtén tu primer artefacto',
        artifact_hunter_title: 'Cazador de artefactos',
        artifact_hunter_desc: 'Recolecta 5 artefactos',
        energy_collector_title: 'Recolector de energía',
        energy_collector_desc: 'Acumula 100 puntos de energía',
        streak_keeper_title: 'Guardián de tradiciones',
        streak_keeper_desc: 'Mantén actividad durante 7 días seguidos',
      },
      en: {
        achievements: 'Achievements',
        progress: 'Progress',
        unlocked: 'Unlocked',
        locked: 'Locked',
        reward: 'Reward',
        missions: 'Missions',
        artifacts: 'Artifacts',
        energy: 'Energy',
        consistency: 'Consistency',
        special: 'Special',
        first_mission_title: 'First Steps',
        first_mission_desc: 'Complete your first mission',
        mission_veteran_title: 'Mission Veteran',
        mission_veteran_desc: 'Complete 10 missions',
        mission_master_title: 'Mission Master',
        mission_master_desc: 'Complete 50 missions',
        first_artifact_title: 'Collector',
        first_artifact_desc: 'Obtain your first artifact',
        artifact_hunter_title: 'Artifact Hunter',
        artifact_hunter_desc: 'Collect 5 artifacts',
        energy_collector_title: 'Energy Collector',
        energy_collector_desc: 'Accumulate 100 energy points',
        streak_keeper_title: 'Tradition Keeper',
        streak_keeper_desc: 'Maintain activity for 7 days in a row',
      },
    };
    return texts[language]?.[key] || texts.en[key] || key;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'rare':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'epic':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'legendary':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'missions':
        return <Star className="w-4 h-4" />;
      case 'artifacts':
        return <Crown className="w-4 h-4" />;
      case 'energy':
        return <Zap className="w-4 h-4" />;
      case 'consistency':
        return <Target className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const initializeAchievements = (): Achievement[] => {
    return [
      {
        id: 'first_mission',
        title: getText('first_mission_title'),
        description: getText('first_mission_desc'),
        icon: <Star className="w-6 h-6" />,
        category: 'missions',
        rarity: 'common',
        condition: {
          type: 'missions_completed',
          target: 1,
          current: userStats.missionsCompleted,
        },
        rewards: { energyPoints: 10 },
        unlocked: userStats.missionsCompleted >= 1,
      },
      {
        id: 'mission_veteran',
        title: getText('mission_veteran_title'),
        description: getText('mission_veteran_desc'),
        icon: <Trophy className="w-6 h-6" />,
        category: 'missions',
        rarity: 'rare',
        condition: {
          type: 'missions_completed',
          target: 10,
          current: userStats.missionsCompleted,
        },
        rewards: { energyPoints: 50 },
        unlocked: userStats.missionsCompleted >= 10,
      },
      {
        id: 'mission_master',
        title: getText('mission_master_title'),
        description: getText('mission_master_desc'),
        icon: <Crown className="w-6 h-6" />,
        category: 'missions',
        rarity: 'epic',
        condition: {
          type: 'missions_completed',
          target: 50,
          current: userStats.missionsCompleted,
        },
        rewards: { energyPoints: 200, title: getText('mission_master_title') },
        unlocked: userStats.missionsCompleted >= 50,
      },
      {
        id: 'first_artifact',
        title: getText('first_artifact_title'),
        description: getText('first_artifact_desc'),
        icon: <Crown className="w-6 h-6" />,
        category: 'artifacts',
        rarity: 'common',
        condition: {
          type: 'artifacts_collected',
          target: 1,
          current: userStats.artifactsCollected,
        },
        rewards: { energyPoints: 15 },
        unlocked: userStats.artifactsCollected >= 1,
      },
      {
        id: 'artifact_hunter',
        title: getText('artifact_hunter_title'),
        description: getText('artifact_hunter_desc'),
        icon: <Crown className="w-6 h-6" />,
        category: 'artifacts',
        rarity: 'rare',
        condition: {
          type: 'artifacts_collected',
          target: 5,
          current: userStats.artifactsCollected,
        },
        rewards: { energyPoints: 75 },
        unlocked: userStats.artifactsCollected >= 5,
      },
      {
        id: 'energy_collector',
        title: getText('energy_collector_title'),
        description: getText('energy_collector_desc'),
        icon: <Zap className="w-6 h-6" />,
        category: 'energy',
        rarity: 'common',
        condition: {
          type: 'energy_earned',
          target: 100,
          current: userStats.totalEnergyEarned,
        },
        rewards: { energyPoints: 25 },
        unlocked: userStats.totalEnergyEarned >= 100,
      },
      {
        id: 'streak_keeper',
        title: getText('streak_keeper_title'),
        description: getText('streak_keeper_desc'),
        icon: <Target className="w-6 h-6" />,
        category: 'consistency',
        rarity: 'rare',
        condition: {
          type: 'daily_streak',
          target: 7,
          current: userStats.currentStreak,
        },
        rewards: { energyPoints: 100 },
        unlocked: userStats.currentStreak >= 7,
      },
    ];
  };

  useEffect(() => {
    const newAchievements = initializeAchievements();
    const previousAchievements = achievements;

    // Проверяем на новые разблокированные достижения
    newAchievements.forEach(achievement => {
      const previous = previousAchievements.find(a => a.id === achievement.id);
      if (achievement.unlocked && (!previous || !previous.unlocked)) {
        showAchievementUnlocked(
          achievement.title,
          achievement.description,
          language
        );
      }
    });

    setAchievements(newAchievements);
  }, [userStats, showAchievementUnlocked]);

  const groupedAchievements = achievements.reduce(
    (groups, achievement) => {
      const category = achievement.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(achievement);
      return groups;
    },
    {} as Record<string, Achievement[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-cosmic-gold" />
        <h2
          className={cn(
            'text-2xl font-bold text-white',
            language === 'en' ? 'font-serif' : ''
          )}
        >
          {getText('achievements')}
        </h2>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedAchievements).map(
          ([category, categoryAchievements]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                {getCategoryIcon(category)}
                <h3 className="text-lg font-semibold text-cosmic-gold">
                  {getText(category)}
                </h3>
              </div>

              <div className="grid gap-3">
                {categoryAchievements.map(achievement => (
                  <Card
                    key={achievement.id}
                    className={cn(
                      'bg-cosmic-dark/60 border-cosmic-accent/30 transition-all duration-300',
                      achievement.unlocked
                        ? 'ring-1 ring-cosmic-gold/50'
                        : 'opacity-60'
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'flex-shrink-0 p-2 rounded-lg',
                            achievement.unlocked
                              ? 'text-cosmic-gold'
                              : 'text-cosmic-silver/50'
                          )}
                        >
                          {achievement.icon}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4
                              className={cn(
                                'font-semibold',
                                achievement.unlocked
                                  ? 'text-white'
                                  : 'text-cosmic-silver/70'
                              )}
                            >
                              {achievement.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={getRarityColor(achievement.rarity)}
                              >
                                {achievement.rarity}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  achievement.unlocked
                                    ? 'bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30'
                                    : 'bg-cosmic-silver/10 text-cosmic-silver/50 border-cosmic-silver/20'
                                )}
                              >
                                {achievement.unlocked
                                  ? getText('unlocked')
                                  : getText('locked')}
                              </Badge>
                            </div>
                          </div>

                          <p
                            className={cn(
                              'text-sm',
                              achievement.unlocked
                                ? 'text-cosmic-silver'
                                : 'text-cosmic-silver/50'
                            )}
                          >
                            {achievement.description}
                          </p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-cosmic-silver">
                                {getText('progress')}
                              </span>
                              <span
                                className={cn(
                                  achievement.unlocked
                                    ? 'text-cosmic-gold'
                                    : 'text-cosmic-silver/70'
                                )}
                              >
                                {achievement.condition.current || 0} /{' '}
                                {achievement.condition.target}
                              </span>
                            </div>
                            <Progress
                              value={
                                ((achievement.condition.current || 0) /
                                  achievement.condition.target) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-cosmic-silver">
                              {getText('reward')}:
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/30"
                            >
                              +{achievement.rewards.energyPoints}{' '}
                              {getText('energy').toLowerCase()}
                            </Badge>
                            {achievement.rewards.title && (
                              <Badge
                                variant="outline"
                                className="bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30"
                              >
                                {achievement.rewards.title}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
