import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';

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
      // Получаем завершенные миссии
      const { data: completedMissions, error: missionsError } = await supabase
        .from('mission_progress_detailed')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (missionsError) throw missionsError;

      // Получаем артефакты
      const { data: artifacts, error: artifactsError } = await supabase
        .from('cosmic_artifacts')
        .select('*')
        .eq('user_id', user.id);

      if (artifactsError) throw artifactsError;

      // Получаем профиль пользователя
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Получаем достижения
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .not('unlocked_at', 'is', null);

      if (achievementsError) throw achievementsError;

      // Рассчитываем статистику
      const missionsCompleted = completedMissions?.length || 0;
      const artifactsCollected = artifacts?.length || 0;
      const totalEnergyEarned = profile?.energy_points || 0;

      // Рассчитываем уровень и опыт на основе энергии
      const { level, xpToNext } = calculateLevel(totalEnergyEarned);

      // Рассчитываем текущую серию (последние 7 дней выполнения миссий)
      const recentMissions = completedMissions?.filter(mission => {
        const completedDate = new Date(mission.completed_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return completedDate >= weekAgo;
      }) || [];
      
      const currentStreak = Math.min(recentMissions.length, 7);

      // Получаем специальные события из достижений
      const specialEvents = achievements?.map(achievement => achievement.title) || [];

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