
import { Mission } from '@/types';
import { supabase } from '@/lib/supabase';

// Функция для загрузки миссий пользователя
export const loadUserMissions = async (userId: string): Promise<Mission[]> => {
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!data) return [];
    
    // Преобразуем из формата БД в формат приложения
    return data.map(mission => ({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      requirements: mission.requirements || [],
      reward: mission.reward,
      completed: mission.completed || false,
      type: mission.type || 'single',
      progress: []  // Прогресс должен быть загружен отдельно
    }));
  } catch (error) {
    console.error('Error loading missions:', error);
    return [];
  }
};

// Функция для получения активной миссии пользователя
export const loadActiveMission = async (userId: string, activeMissionId?: string): Promise<Mission | null> => {
  if (!activeMissionId) return null;
  
  try {
    // Загружаем саму миссию
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .select('*')
      .eq('id', activeMissionId)
      .single();
      
    if (missionError) throw missionError;
    if (!mission) return null;
    
    // Загружаем прогресс миссии
    const { data: progress, error: progressError } = await supabase
      .from('mission_progress')
      .select('*')
      .eq('mission_id', activeMissionId)
      .eq('user_id', userId)
      .single();
      
    if (progressError && progressError.code !== 'PGRST116') {
      // PGRST116 означает "результат не содержит строк" - это ОК, если прогресса еще нет
      throw progressError;
    }
    
    return {
      id: mission.id,
      title: mission.title,
      description: mission.description,
      requirements: mission.requirements || [],
      reward: mission.reward,
      completed: mission.completed || false,
      type: mission.type || 'single',
      progress: progress ? progress.progress : []
    };
  } catch (error) {
    console.error('Error loading active mission:', error);
    return null;
  }
};
