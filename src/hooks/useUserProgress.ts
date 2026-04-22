import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { getCachedUserProgress } from '@/hooks/useOptimizedDatabase';

interface UserProgressStats {
  missionsCompleted: number;
  artifactsCollected: number;
  totalEnergyEarned: number;
  currentStreak: number;
  specialEvents: string[];
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
}

export const useUserProgress = () => {
  const { user } = useAppStore();
  const [stats, setStats] = useState<UserProgressStats>({
    missionsCompleted: 0,
    artifactsCollected: 0,
    totalEnergyEarned: 0,
    currentStreak: 0,
    specialEvents: [],
    level: 1,
    experiencePoints: 0,
    experienceToNextLevel: 100,
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateLevel = (totalXP: number): { level: number; xpToNext: number } => {
    // Прогрессивная система уровней: каждый новый уровень требует больше XP
    let level = 1;
    let xpNeeded = 100;
    let totalXpForCurrentLevel = 0;

    while (totalXP >= totalXpForCurrentLevel + xpNeeded) {
      totalXpForCurrentLevel += xpNeeded;
      level++;
      xpNeeded = Math.floor(xpNeeded * 1.5); // Увеличиваем требования на 50% каждый уровень
    }

    const xpToNext = (totalXpForCurrentLevel + xpNeeded) - totalXP;
    return { level, xpToNext };
  };

  const fetchUserProgress = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    
    try {
      const progressData = await getCachedUserProgress(user.id);
      
      // Get additional detailed data for calculations
      const [completedMissions, achievements] = await Promise.all([
        supabase
          .from('mission_progress_detailed')
          .select('completed_at')
          .eq('user_id', user.id)
          .eq('completed', true),
        supabase
          .from('achievements')
          .select('title')
          .eq('user_id', user.id)
          .not('unlocked_at', 'is', null)
      ]);

      if (completedMissions.error) throw completedMissions.error;
      if (achievements.error) throw achievements.error;

      // Рассчитываем статистику из кэшированных данных
      const missionsCompleted = progressData.completedMissionsCount;
      const artifactsCollected = progressData.artifactsCount;
      const totalEnergyEarned = progressData.profile?.energy_points || 0;

      // Рассчитываем уровень и опыт на основе энергии
      const { level, xpToNext } = calculateLevel(totalEnergyEarned);

      // Рассчитываем текущую серию (последние 7 дней выполнения миссий)
      const recentMissions = completedMissions.data?.filter(mission => {
        const completedDate = new Date(mission.completed_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return completedDate >= weekAgo;
      }) || [];
      
      const currentStreak = Math.min(recentMissions.length, 7);

      // Получаем специальные события из достижений
      const specialEvents = achievements.data?.map(achievement => achievement.title) || [];

      setStats({
        missionsCompleted,
        artifactsCollected,
        totalEnergyEarned,
        currentStreak,
        specialEvents,
        level,
        experiencePoints: totalEnergyEarned,
        experienceToNextLevel: xpToNext,
      });

    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExperience = async (amount: number) => {
    if (!user?.id) return;

    try {
      // Обновляем энергетические очки в профиле
      const { error } = await supabase
        .from('profiles')
        .update({ 
          energy_points: stats.totalEnergyEarned + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Обновляем локальное состояние
      setStats(prev => {
        const newTotalXP = prev.experiencePoints + amount;
        const { level, xpToNext } = calculateLevel(newTotalXP);
        
        return {
          ...prev,
          experiencePoints: newTotalXP,
          level,
          experienceToNextLevel: xpToNext,
          totalEnergyEarned: prev.totalEnergyEarned + amount,
        };
      });

    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  const updateMissionCount = async () => {
    // Обновляем локальное состояние
    setStats(prev => ({
      ...prev,
      missionsCompleted: prev.missionsCompleted + 1,
    }));
    
    // Добавляем опыт за выполнение миссии
    await addExperience(15);
  };

  const updateArtifactCount = async () => {
    // Обновляем локальное состояние
    setStats(prev => ({
      ...prev,
      artifactsCollected: prev.artifactsCollected + 1,
    }));
    
    // Добавляем опыт за получение артефакта
    await addExperience(10);
  };

  const createAchievement = async (type: string, title: string, description: string, icon: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          achievement_type: type,
          title,
          description,
          icon,
          unlocked_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Обновляем прогресс после создания достижения
      await fetchUserProgress();

    } catch (error) {
      console.error('Error creating achievement:', error);
    }
  };

  useEffect(() => {
    fetchUserProgress();
  }, [user?.id]);

  return {
    stats,
    isLoading,
    refetch: fetchUserProgress,
    addExperience,
    updateMissionCount,
    updateArtifactCount,
    createAchievement,
  };
};