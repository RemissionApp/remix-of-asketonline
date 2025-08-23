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
      // Моковые данные для демонстрации (в реальной версии нужно создать соответствующие таблицы)
      // Имитируем данные на основе существующих таблиц
      const missionsData = [{ id: '1' }, { id: '2' }, { id: '3' }]; // Моковые данные
      const artifactsData = [{ id: '1' }, { id: '2' }]; // Моковые данные


      // Получаем общую энергию
      const totalEnergyEarned = (missionsData?.length || 0) * 15 + (artifactsData?.length || 0) * 10;

      // Рассчитываем уровень и опыт
      const totalXP = totalEnergyEarned;
      const { level, xpToNext } = calculateLevel(totalXP);

      // Получаем текущую "серию" (пока простая логика)
      const currentStreak = Math.min((missionsData?.length || 0), 7);

      setStats({
        missionsCompleted: missionsData?.length || 0,
        artifactsCollected: artifactsData?.length || 0,
        totalEnergyEarned,
        currentStreak,
        specialEvents: [], // Пока пустой массив
        level,
        experiencePoints: totalXP,
        experienceToNextLevel: xpToNext,
      });

    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExperience = (amount: number) => {
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
  };

  const updateMissionCount = () => {
    setStats(prev => ({
      ...prev,
      missionsCompleted: prev.missionsCompleted + 1,
    }));
    
    // Добавляем опыт за выполнение миссии
    addExperience(15);
  };

  const updateArtifactCount = () => {
    setStats(prev => ({
      ...prev,
      artifactsCollected: prev.artifactsCollected + 1,
    }));
    
    // Добавляем опыт за получение артефакта
    addExperience(10);
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
  };
};