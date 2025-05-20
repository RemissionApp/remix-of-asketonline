
import { useState, useEffect } from 'react';
import { Mission } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { format, isToday } from 'date-fns';
import { toast } from 'sonner';

export const useMissionCard = (mission: Mission, onComplete?: () => void) => {
  const { language, completeMission, userProfile } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [acceptedMission, setAcceptedMission] = useState(userProfile?.activeMission?.id === mission?.id);
  const [requirementStatus, setRequirementStatus] = useState<boolean[]>([]);
  const [lastCompletedDate, setLastCompletedDate] = useState<Date | null>(null);
  
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
      if (totalRequirements > 0) {
        setProgress(Math.floor((completedCount / totalRequirements) * 100));
      }
    }
  }, [acceptedMission, mission]);
  
  const handleCompleteMission = () => {
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
    if (Array.isArray(mission.requirements)) {
      const initialProgress = mission.requirements.map((_, index) => ({
        day: index + 1,
        completed: false,
        date: format(new Date(), 'yyyy-MM-dd')
      }));
      
      setRequirementStatus(initialProgress.map(p => p.completed));
    }
  };
  
  const toggleRequirement = (index: number) => {
    const newStatus = [...requirementStatus];
    newStatus[index] = !newStatus[index];
    setRequirementStatus(newStatus);
    
    // If we're checking a requirement, update the last completed date
    if (newStatus[index]) {
      setLastCompletedDate(new Date());
    }
    
    // Calculate progress
    const completedCount = newStatus.filter(status => status).length;
    const newProgress = Math.floor((completedCount / mission.requirements.length) * 100);
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
    toggleRequirement,
    handleCompleteMission,
    handleAcceptMission
  };
};
