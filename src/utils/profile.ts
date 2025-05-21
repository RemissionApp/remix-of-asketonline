
import { UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';

// Функция для загрузки профиля пользователя из Supabase
export const loadUserProfileFromSupabase = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error loading profile:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Преобразуем из формата БД в формат приложения
    return {
      id: data.id,
      name: data.name || 'Искатель',
      email: '',  // email хранится в auth.users, а не в profiles
      age: null,
      energyPoints: data.energy_points || 0,
      goal: data.goal || 'Познать свою истинную силу',
      isPro: false, // Это должно быть загружено из таблицы subscriptions
      rank: data.rank || 'seeker',
      zodiacSign: '', // Вычисляется на основе даты рождения
      totalDays: data.total_days || 0,
      achievements: [], // Должно быть загружено отдельно
      birthDate: data.birth_date ? new Date(data.birth_date) : null,
      avatar_url: data.avatar_url,
      activeMission: null // Должно быть загружено отдельно
    };
  } catch (error) {
    console.error('Exception loading profile:', error);
    return null;
  }
};

// Функция для обновления профиля пользователя
export const updateUserProfileInSupabase = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    // Преобразуем дату рождения в строку для БД, если она есть
    const updates: any = { ...profileData };
    if (profileData.birthDate && profileData.birthDate instanceof Date) {
      updates.birth_date = profileData.birthDate.toISOString().split('T')[0];
      delete updates.birthDate;
    }
    
    // Преобразовываем остальные поля в формат БД
    if ('energyPoints' in updates) {
      updates.energy_points = updates.energyPoints;
      delete updates.energyPoints;
    }
    
    if ('totalDays' in updates) {
      updates.total_days = updates.totalDays;
      delete updates.totalDays;
    }
    
    if ('activeMission' in updates) {
      updates.active_mission = updates.activeMission?.id || null;
      delete updates.activeMission;
    }
    
    // Удаляем поля, которые не хранятся в таблице profiles
    const fieldsToRemove = ['email', 'age', 'isPro', 'zodiacSign', 'achievements'];
    fieldsToRemove.forEach(field => {
      if (field in updates) delete updates[field];
    });
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};
