
import { useState, useEffect } from 'react';
import { Mission, MissionRequirement } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { format, isToday } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export const useMissionCard = (mission: Mission, onComplete?: () => void) => {
  const { language, completeMission, userProfile, updateUserProfile } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [acceptedMission, setAcceptedMission] = useState(userProfile?.activeMission?.id === mission?.id);
  const [requirementStatus, setRequirementStatus] = useState<boolean[]>([]);
  const [lastCompletedDate, setLastCompletedDate] = useState<Date | null>(null);
  const [daysCompleted, setDaysCompleted] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if we've already completed today's requirement
  const canCompleteToday = !lastCompletedDate || !isToday(lastCompletedDate);
  
  // Load mission progress from Supabase when component mounts
  useEffect(() => {
    const loadMissionProgress = async () => {
      if (!mission?.id || !userProfile?.id) return;
      
      try {
        // Check if mission progress exists
        const { data, error } = await supabase
          .from('mission_progress')
          .select('*')
          .eq('user_id', userProfile.id)
          .eq('mission_id', mission.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading mission progress:', error);
          return;
        }
        
        // If mission progress exists, update state
        if (data) {
          setAcceptedMission(true);
          
          // Update requirement status
          if (data.progress && Array.isArray(data.progress)) {
            setRequirementStatus(data.progress.map(p => p.completed));
            
            // Find the last completed date if any
            const lastCompleted = data.progress
              .filter(p => p.completed)
              .map(p => new Date(p.date))
              .sort((a, b) => b.getTime() - a.getTime())[0];
            
            if (lastCompleted) {
              setLastCompletedDate(lastCompleted);
            }
            
            // Calculate initial progress
            const completedCount = data.progress.filter(p => p.completed).length;
            const totalRequirements = data.progress.length;
            
            setDaysCompleted(completedCount);
            setTotalDays(totalRequirements);
            
            if (totalRequirements > 0) {
              setProgress(Math.floor((completedCount / totalRequirements) * 100));
            }
          }
        } else if (mission.requirements) {
          // Initialize for new missions
          setTotalDays(mission.type === 'multi-day' ? mission.requirements.length : 1);
        }
      } catch (error) {
        console.error('Error loading mission progress:', error);
      }
    };
    
    loadMissionProgress();
  }, [mission?.id, userProfile?.id]);
  
  // Save mission progress to Supabase
  const saveMissionProgress = async (newStatus: boolean[]) => {
    if (!mission?.id || !userProfile?.id) return;
    
    setIsLoading(true);
    
    try {
      const progressData = newStatus.map((completed, index) => ({
        day: index + 1,
        completed,
        date: completed ? format(new Date(), 'yyyy-MM-dd') : null
      }));
      
      const { error } = await supabase
        .from('mission_progress')
        .upsert({
          user_id: userProfile.id,
          mission_id: mission.id,
          progress: progressData,
          last_updated_at: new Date().toISOString(),
          completed: newStatus.every(status => status)
        });
      
      if (error) {
        console.error('Error saving mission progress:', error);
        toast.error(
          language === 'ru' ? 'Ошибка при сохранении прогресса миссии' : 
          language === 'es' ? 'Error al guardar el progreso de la misión' : 
          'Error saving mission progress'
        );
      }
    } catch (error) {
      console.error('Error saving mission progress:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompleteMission = async () => {
    // Check if this is a multi-day mission that hasn't been fully completed
    if (mission.type === 'multi-day' && daysCompleted < totalDays) {
      const message = language === 'ru' 
        ? `Вы должны завершить все ${totalDays} дней миссии перед тем, как получить награду. Выполнено: ${daysCompleted} из ${totalDays}.`
        : language === 'es'
          ? `Debes completar los ${totalDays} días de la misión antes de recibir la recompensa. Completado: ${daysCompleted} de ${totalDays}.`
          : `You must complete all ${totalDays} days of the mission before claiming the reward. Completed: ${daysCompleted} of ${totalDays}.`;
          
      toast.error(message);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mark mission as completed in database
      const { error } = await supabase
        .from('mission_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userProfile?.id)
        .eq('mission_id', mission.id);
      
      if (error) {
        console.error('Error completing mission:', error);
        toast.error(
          language === 'ru' ? 'Ошибка при завершении миссии' : 
          language === 'es' ? 'Error al completar la misión' : 
          'Error completing mission'
        );
        return;
      }
      
      // Clear active mission in user profile
      await updateUserProfile({ activeMission: null });
      
      toast.success(
        language === 'ru' ? 'Миссия выполнена! Вы получили награду.' : 
        language === 'es' ? '¡Misión completada! Has recibido tu recompensa.' : 
        'Mission completed! You received your reward.'
      );
      completeMission();
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Error completing mission:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAcceptMission = async () => {
    if (!mission?.id || !userProfile?.id) return;
    
    setIsLoading(true);
    
    try {
      // For multi-day missions, initialize progress array
      let initialProgress = [];
      
      if (mission.requirements) {
        const requirementsCount = mission.requirements.length;
        setTotalDays(requirementsCount);
        
        initialProgress = Array(requirementsCount).fill(0).map((_, index) => ({
          day: index + 1,
          completed: false,
          date: null
        }));
        
        setRequirementStatus(initialProgress.map(p => p.completed));
      }
      
      // Save mission progress to database
      const { error } = await supabase
        .from('mission_progress')
        .upsert({
          user_id: userProfile.id,
          mission_id: mission.id,
          progress: initialProgress,
          accepted_at: new Date().toISOString(),
          last_updated_at: new Date().toISOString(),
          completed: false
        });
      
      if (error) {
        console.error('Error accepting mission:', error);
        toast.error(
          language === 'ru' ? 'Ошибка при принятии миссии' : 
          language === 'es' ? 'Error al aceptar la misión' : 
          'Error accepting mission'
        );
        return;
      }
      
      // Update user profile with active mission
      await updateUserProfile({ activeMission: mission });
      
      setAcceptedMission(true);
      toast.success(
        language === 'ru' ? 'Вы приняли новую миссию!' : 
        language === 'es' ? '¡Has aceptado una nueva misión!' : 
        'You accepted a new mission!'
      );
    } catch (error) {
      console.error('Error accepting mission:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleRequirement = async (index: number) => {
    const newStatus = [...requirementStatus];
    
    // For multi-day missions, requirements should be completed in order
    if (mission.type === 'multi-day') {
      // Check if we're trying to complete a future requirement before completing previous ones
      const previousIncomplete = newStatus.slice(0, index).some(status => !status);
      if (previousIncomplete && !newStatus[index]) {
        const message = language === 'ru' 
          ? 'Вы должны выполнять задания по порядку.'
          : language === 'es'
            ? 'Debes completar las tareas en orden.'
            : 'You must complete the tasks in order.';
        toast.error(message);
        return;
      }
    }
    
    newStatus[index] = !newStatus[index];
    setRequirementStatus(newStatus);
    
    // If we're checking a requirement, update the last completed date
    if (newStatus[index]) {
      setLastCompletedDate(new Date());
    }
    
    // Calculate progress
    const completedCount = newStatus.filter(status => status).length;
    setDaysCompleted(completedCount);
    
    const requirementsLength = mission.requirements ? mission.requirements.length : 0;
    const newProgress = requirementsLength > 0 ? Math.floor((completedCount / requirementsLength) * 100) : 0;
    setProgress(newProgress);
    
    // Save changes to database
    await saveMissionProgress(newStatus);
  };
  
  // Check if all requirements are completed
  const allCompleted = requirementStatus.length > 0 && requirementStatus.every(status => status);
  
  return {
    progress,
    acceptedMission,
    requirementStatus,
    lastCompletedDate,
    canCompleteToday,
    allCompleted,
    daysCompleted,
    totalDays,
    toggleRequirement,
    handleCompleteMission,
    handleAcceptMission,
    isLoading
  };
};
