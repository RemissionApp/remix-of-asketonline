import { useState, useEffect, useCallback } from 'react';
import { Mission, Choice, Consequence, EnhancedReward } from '@/types';
import { useMissionProgress } from './useMissionProgress';
import { useDailyReflections } from './useDailyReflections';
import { useMissionChoices } from './useMissionChoices';
import { useCosmicArtifacts } from './useCosmicArtifacts';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export const useMissionState = (mission: Mission) => {
  const { language, userProfile, updateUserProfile } = useAppStore();
  const [currentDay, setCurrentDay] = useState(1);
  const [isProcessingReward, setIsProcessingReward] = useState(false);

  // API hooks
  const missionProgress = useMissionProgress(mission.id);
  const dailyReflections = useDailyReflections(mission.id);
  const missionChoices = useMissionChoices(mission.id);
  const cosmicArtifacts = useCosmicArtifacts();

  // Calculate current day based on progress
  useEffect(() => {
    if (missionProgress.progress) {
      const lastCompletedDay = missionProgress.progress
        .filter(p => p.completed)
        .map(p => p.day_number)
        .sort((a, b) => b - a)[0];
      
      setCurrentDay(lastCompletedDay ? lastCompletedDay + 1 : 1);
    }
  }, [missionProgress.progress]);

  // Get current day's data
  const getCurrentDayChoice = useCallback(() => {
    return mission.choiceEvents?.find(event => event.day === currentDay);
  }, [mission.choiceEvents, currentDay]);

  const getCurrentDayQuestion = useCallback(() => {
    return mission.dailyQuestions?.find(q => q.day === currentDay);
  }, [mission.dailyQuestions, currentDay]);

  const getCurrentDayProgress = useCallback(() => {
    return missionProgress.getProgressForDay(currentDay);
  }, [missionProgress, currentDay]);

  const getCurrentDayReflection = useCallback(() => {
    return dailyReflections.getReflectionForDay(currentDay);
  }, [dailyReflections, currentDay]);

  const getCurrentDayChoiceData = useCallback(() => {
    const currentChoice = getCurrentDayChoice();
    if (!currentChoice) return null;
    return missionChoices.getChoiceForEvent(currentChoice.id);
  }, [getCurrentDayChoice, missionChoices]);

  // Process consequences from choices
  const processConsequences = useCallback(async (consequences: Consequence[]) => {
    for (const consequence of consequences) {
      switch (consequence.type) {
        case 'energy':
          if (userProfile) {
            await updateUserProfile({
              energyPoints: (userProfile.energyPoints || 0) + consequence.value
            });
          }
          break;
        
        case 'unlock':
          // Handle content unlocking logic
          console.log('Unlocking content:', consequence.value);
          break;
        
        case 'message':
          toast.info(consequence.value, {
            duration: 5000,
          });
          break;
        
        case 'bonus':
          await processReward(consequence.value as EnhancedReward);
          break;
      }
    }
  }, [userProfile, updateUserProfile]);

  // Process rewards (artifacts, achievements, etc.)
  const processReward = useCallback(async (reward: EnhancedReward) => {
    setIsProcessingReward(true);
    
    try {
      // Add cosmic artifacts
      if (reward.cosmicArtifact) {
        await cosmicArtifacts.addArtifact({
          artifactId: reward.cosmicArtifact.id,
          name: reward.cosmicArtifact.name,
          description: reward.cosmicArtifact.description,
          type: reward.cosmicArtifact.type,
          rarity: reward.cosmicArtifact.rarity,
          effects: reward.cosmicArtifact.effects,
          obtainedFromMission: mission.id,
        });
      }

      // Add energy points
      if (reward.energyPoints && userProfile) {
        await updateUserProfile({
          energyPoints: (userProfile.energyPoints || 0) + reward.energyPoints
        });
      }

      // Handle rank bonus
      if (reward.rankBonus && userProfile) {
        await updateUserProfile({
          energyPoints: (userProfile.energyPoints || 0) + reward.rankBonus
        });
      }

      // Show celebration message
      const message = language === 'ru' 
        ? 'Вы получили награду!' 
        : language === 'es' 
        ? '¡Has recibido una recompensa!' 
        : 'You received a reward!';
      
      toast.success(message, {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error processing reward:', error);
      toast.error('Error processing reward');
    } finally {
      setIsProcessingReward(false);
    }
  }, [cosmicArtifacts, userProfile, updateUserProfile, mission.id, language]);

  // Handle user choice
  const handleChoice = useCallback(async (choiceId: string) => {
    const currentChoiceEvent = getCurrentDayChoice();
    if (!currentChoiceEvent) return;

    const selectedChoice = currentChoiceEvent.choices.find(c => c.id === choiceId);
    if (!selectedChoice) return;

    try {
      // Save choice to database
      await missionChoices.makeChoice({
        choiceEventId: currentChoiceEvent.id,
        choiceId,
        consequences: selectedChoice.consequences,
      });

      // Process consequences
      await processConsequences(selectedChoice.consequences);

      // Show success message
      const message = language === 'ru' 
        ? 'Выбор сделан!' 
        : language === 'es' 
        ? '¡Elección realizada!' 
        : 'Choice made!';
      
      toast.success(message);
    } catch (error) {
      console.error('Error making choice:', error);
      toast.error('Error making choice');
    }
  }, [getCurrentDayChoice, missionChoices, processConsequences, language]);

  // Handle daily reflection
  const handleReflection = useCallback(async (answer: any) => {
    const currentQuestion = getCurrentDayQuestion();
    if (!currentQuestion) return;

    try {
      // Save reflection to database
      await dailyReflections.saveReflection({
        dayNumber: currentDay,
        question: currentQuestion.question,
        answer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer),
        reflectionType: currentQuestion.type,
      });

      // Show success message
      const message = language === 'ru' 
        ? 'Размышление сохранено!' 
        : language === 'es' 
        ? '¡Reflexión guardada!' 
        : 'Reflection saved!';
      
      toast.success(message);
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error('Error saving reflection');
    }
  }, [getCurrentDayQuestion, dailyReflections, currentDay, language]);

  // Complete current day
  const completeDay = useCallback(async () => {
    try {
      await missionProgress.updateProgress({
        dayNumber: currentDay,
        completed: true,
        data: {
          completedAt: new Date().toISOString(),
        },
      });

      // Check for milestone rewards
      const milestone = mission.milestoneRewards?.find(m => m.day === currentDay);
      if (milestone) {
        await processReward(milestone.reward);
      }

      // Move to next day
      setCurrentDay(prev => prev + 1);

      const message = language === 'ru' 
        ? `День ${currentDay} завершён!` 
        : language === 'es' 
        ? `¡Día ${currentDay} completado!` 
        : `Day ${currentDay} completed!`;
      
      toast.success(message);
    } catch (error) {
      console.error('Error completing day:', error);
      toast.error('Error completing day');
    }
  }, [currentDay, missionProgress, mission.milestoneRewards, processReward, language]);

  // Check if current day can be completed
  const canCompleteDay = useCallback(() => {
    const currentProgress = getCurrentDayProgress();
    if (currentProgress?.completed) return false;

    const currentQuestion = getCurrentDayQuestion();
    const currentChoice = getCurrentDayChoice();
    
    // Check if required reflection is completed
    if (currentQuestion?.required) {
      const reflection = getCurrentDayReflection();
      if (!reflection) return false;
    }

    // Check if required choice is made
    if (currentChoice) {
      const choiceData = getCurrentDayChoiceData();
      if (!choiceData) return false;
    }

    return true;
  }, [getCurrentDayProgress, getCurrentDayQuestion, getCurrentDayChoice, getCurrentDayReflection, getCurrentDayChoiceData]);

  return {
    // Current state
    currentDay,
    isProcessingReward,

    // Current day data
    currentDayChoice: getCurrentDayChoice(),
    currentDayQuestion: getCurrentDayQuestion(),
    currentDayProgress: getCurrentDayProgress(),
    currentDayReflection: getCurrentDayReflection(),
    currentDayChoiceData: getCurrentDayChoiceData(),

    // Actions
    handleChoice,
    handleReflection,
    completeDay,
    canCompleteDay: canCompleteDay(),

    // Progress data
    progressPercentage: missionProgress.progressPercentage,
    completedDays: missionProgress.completedDays,
    totalDays: mission.duration,

    // Loading states
    isLoading: missionProgress.isLoading || dailyReflections.isLoading || missionChoices.isLoading,
    isSaving: missionProgress.isUpdating || dailyReflections.isSaving || missionChoices.isChoosing,
  };
};