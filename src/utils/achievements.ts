
import { Achievement } from '@/types';
import { supabase } from '@/lib/supabase';

// Функция для загрузки достижений пользователя
export const loadUserAchievements = async (userId: string): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    if (!data) return [];
    
    // Преобразуем из формата БД в формат приложения
    return data.map(achievement => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      unlocked: true,
      unlockedDate: achievement.unlocked_at
    }));
  } catch (error) {
    console.error('Error loading achievements:', error);
    return [];
  }
};

// Функция для разблокировки достижения
export const unlockAchievement = async (
  userId: string,
  achievementType: string,
  title: string,
  description: string,
  icon: string
): Promise<Achievement | null> => {
  try {
    // Проверим, не разблокировано ли уже это достижение
    const { data: existing, error: checkError } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_type', achievementType)
      .single();
      
    if (existing) {
      // Достижение уже разблокировано
      return {
        id: existing.id,
        title: existing.title,
        description: existing.description,
        icon: existing.icon,
        unlocked: true,
        unlockedDate: existing.unlocked_at
      };
    }
    
    // Добавляем новое достижение
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        user_id: userId,
        title,
        description,
        icon,
        achievement_type: achievementType,
        unlocked_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon,
      unlocked: true,
      unlockedDate: data.unlocked_at
    };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return null;
  }
};
