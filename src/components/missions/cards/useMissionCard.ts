
import { useState, useEffect } from 'react';
import { Mission, MissionRequirement } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { format, isToday } from 'date-fns';
import { toast } from 'sonner';

export const useMissionCard = (mission: Mission, onComplete?: () => void) => {
  const { language, completeMission, userProfile } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [acceptedMission, setAcceptedMission] = useState(userProfile?.activeMission?.id === mission?.id);
  const [requirementStatus, setRequirementStatus] = useState<boolean[]>([]);
  const [lastCompletedDate, setLastCompletedDate] = useState<Date | null>(null);
  const [daysCompleted, setDaysCompleted] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  
  // Check if we've already completed today's requirement
  const canCompleteToday = !lastCompletedDate || !isToday(lastCompletedDate);
  
  useEffect(() => {
    // Initialize requirement status based on mission progress if accepted
    if (acceptedMission && mission.progress) {
      setRequirementStatus(mission.progress.map(p => p.completed));
      
      // Find the last completed date if any
      const lastCompleted = mission.progress
        .filter(p => p.completed)
        .map(p => new Date(p.date))
        .sort((a, b) => b.getTime() - a.getTime())[0];
      
      if (lastCompleted) {
        setLastCompletedDate(lastCompleted);
      }
      
      // Calculate initial progress
      const completedCount = mission.progress.filter(p => p.completed).length;
      const totalRequirements = mission.progress.length;
      
      setDaysCompleted(completedCount);
      setTotalDays(totalRequirements);
      
      if (totalRequirements > 0) {
        setProgress(Math.floor((completedCount / totalRequirements) * 100));
      }
    } else if (mission.requirements) {
      // Initialize for new missions
      setTotalDays(mission.type === 'multi-day' ? mission.requirements.length : 1);
    }
  }, [acceptedMission, mission]);
  
  const handleCompleteMission = () => {
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
    
    toast.success(
      language === 'ru' ? 'Миссия выполнена! Вы получили награду.' : 
      language === 'es' ? '¡Misión completada! Has recibido tu recompensa.' : 
      'Mission completed! You received your reward.'
    );
    completeMission();
    if (onComplete) onComplete();
  };
  
  const handleAcceptMission = () => {
    setAcceptedMission(true);
    toast.success(
      language === 'ru' ? 'Вы приняли новую миссию!' : 
      language === 'es' ? '¡Has aceptado una nueva misión!' : 
      'You accepted a new mission!'
    );
    
    // For multi-day missions, initialize progress array
    if (mission.requirements) {
      const requirementsCount = mission.requirements.length;
      setTotalDays(requirementsCount);
      
      const initialProgress = Array(requirementsCount).fill(0).map((_, index) => ({
        day: index + 1,
        completed: false,
        date: format(new Date(), 'yyyy-MM-dd')
      }));
      
      setRequirementStatus(initialProgress.map(p => p.completed));
    }
  };
  
  const toggleRequirement = (index: number) => {
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
    handleAcceptMission
  };
};
