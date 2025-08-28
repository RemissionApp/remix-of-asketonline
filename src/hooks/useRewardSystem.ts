import { useAppStore } from '@/store/useAppStore';
import { useUserProgress } from './useUserProgress';
import { useNotifications } from '@/components/notifications/NotificationSystem';
import { supabase } from '@/integrations/supabase/client';

interface RewardConfig {
  type:
    | 'mission_complete'
    | 'artifact_found'
    | 'level_up'
    | 'streak'
    | 'special';
  energy: number;
  achievement?: {
    title: string;
    description: string;
    icon: string;
  };
}

export const useRewardSystem = () => {
  const { user, language } = useAppStore();
  const { addExperience, createAchievement, stats, refetch } =
    useUserProgress();
  const { showAchievementUnlocked, showEnergyGained, showNotification } =
    useNotifications();

  const REWARD_CONFIGS: Record<string, RewardConfig> = {
    mission_daily: {
      type: 'mission_complete',
      energy: 15,
      achievement: {
        title: 'Ежедневный Искатель',
        description: 'Выполнена ежедневная миссия',
        icon: '🌟',
      },
    },
    mission_weekly: {
      type: 'mission_complete',
      energy: 50,
      achievement: {
        title: 'Недельный Воин',
        description: 'Выполнена недельная миссия',
        icon: '⚔️',
      },
    },
    artifact_rare: {
      type: 'artifact_found',
      energy: 25,
      achievement: {
        title: 'Собиратель Редкостей',
        description: 'Найден редкий артефакт',
        icon: '💎',
      },
    },
    streak_7: {
      type: 'streak',
      energy: 100,
      achievement: {
        title: 'Недельная Серия',
        description: '7 дней подряд выполнения миссий',
        icon: '🔥',
      },
    },
    level_up: {
      type: 'level_up',
      energy: 0,
      achievement: {
        title: 'Новый Уровень',
        description: 'Достигнут новый уровень развития',
        icon: '⬆️',
      },
    },
  };

  const grantReward = async (
    rewardKey: string,
    customData?: Partial<RewardConfig>
  ) => {
    if (!user?.id) return;

    const config = REWARD_CONFIGS[rewardKey];
    if (!config) {
      console.warn(`Unknown reward key: ${rewardKey}`);
      return;
    }

    const finalConfig = { ...config, ...customData };

    try {
      // Добавляем энергию с космическим уведомлением
      if (finalConfig.energy > 0) {
        await addExperience(finalConfig.energy);
        showEnergyGained(finalConfig.energy, language);
      }

      // Создаем достижение с космическим уведомлением
      if (finalConfig.achievement) {
        await createAchievement(
          finalConfig.type,
          finalConfig.achievement.title,
          finalConfig.achievement.description,
          finalConfig.achievement.icon
        );
        showAchievementUnlocked(
          finalConfig.achievement.title,
          finalConfig.achievement.description,
          language
        );
      }

      // Проверяем особые достижения
      await checkSpecialAchievements();
    } catch (error) {
      console.error('Error granting reward:', error);
      showNotification({
        type: 'reminder',
        title: '❌ Ошибка награды',
        message: 'Не удалось выдать награду',
        duration: 3000,
      });
    }
  };

  const checkSpecialAchievements = async () => {
    if (!user?.id) return;

    // Проверяем достижения по количеству миссий
    if (stats.missionsCompleted === 10) {
      await grantReward('special', {
        type: 'special',
        energy: 200,
        achievement: {
          title: 'Опытный Искатель',
          description: '10 выполненных миссий',
          icon: '🏆',
        },
      });
    }

    // Проверяем достижения по количеству артефактов
    if (stats.artifactsCollected === 5) {
      await grantReward('special', {
        type: 'special',
        energy: 150,
        achievement: {
          title: 'Коллекционер',
          description: '5 собранных артефактов',
          icon: '🗿',
        },
      });
    }

    // Проверяем уровень
    const currentLevel = stats.level;
    if (currentLevel > 1) {
      const { data: existingLevelAchievement } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('achievement_type', 'level_up')
        .eq('title', `Уровень ${currentLevel}`)
        .single();

      if (!existingLevelAchievement) {
        await grantReward('level_up', {
          achievement: {
            title: `Уровень ${currentLevel}`,
            description: `Достигнут ${currentLevel} уровень развития`,
            icon: '⭐',
          },
        });
      }
    }
  };

  const onMissionComplete = async (
    missionType: 'daily' | 'weekly' = 'daily'
  ) => {
    await grantReward(`mission_${missionType}`);
    await refetch(); // Обновляем прогресс
  };

  const onArtifactFound = async (
    rarity: 'common' | 'rare' | 'epic' = 'rare'
  ) => {
    await grantReward(`artifact_${rarity}`);
    await refetch(); // Обновляем прогресс
  };

  return {
    grantReward,
    onMissionComplete,
    onArtifactFound,
    checkSpecialAchievements,
  };
};
