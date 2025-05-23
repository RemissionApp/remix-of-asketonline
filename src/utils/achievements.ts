
import { Achievement } from '@/types';
import { supabase } from '@/lib/supabase';

// Load achievements for a user
export const loadAchievementsFromSupabase = async (userId: string): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error loading achievements:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      unlocked: item.unlocked,
      unlockedDate: item.unlocked_date
    }));
  } catch (error) {
    console.error('Exception loading achievements:', error);
    return [];
  }
};

// Export the function with the expected name
export const loadUserAchievements = loadAchievementsFromSupabase;

// Save achievement to Supabase
export const saveAchievementToSupabase = async (userId: string, achievement: Achievement): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('achievements')
      .insert({
        id: achievement.id,
        user_id: userId,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        unlocked: achievement.unlocked,
        unlocked_date: achievement.unlockedDate
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving achievement:', error);
    return false;
  }
};
