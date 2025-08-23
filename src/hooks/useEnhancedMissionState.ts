import { useState, useEffect, useCallback } from 'react';
import { Mission, Choice, Consequence, EnhancedReward } from '@/types';
import { usePersistentMissionState } from './usePersistentMissionState';
import { useCosmicArtifacts } from './useCosmicArtifacts';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export const useEnhancedMissionState = (mission: Mission) => {
  const { language, userProfile, updateUserProfile } = useAppStore();
  const [isProcessingReward, setIsProcessingReward] = useState(false);
  
  // Use persistent mission state
  const persistentState = usePersistentMissionState(mission);
  const cosmicArtifacts = useCosmicArtifacts();

  const {
    state: missionState,
    isLoading,
    isSaving,
    isOnline,
    lastSyncTime,
    updateState,
    forcSync,
  } = persistentState;

  // Get current day's data with persistence
  const getCurrentDayChoice = useCallback(() => {
    return mission.choiceEvents?.find(event => event.day === missionState.currentDay);
  }, [mission.choiceEvents, missionState.currentDay]);

  const getCurrentDayQuestion = useCallback(() => {
    return mission.dailyQuestions?.find(q => q.day === missionState.currentDay);
  }, [mission.dailyQuestions, missionState.currentDay]);

  const getCurrentDayProgress = useCallback(() => {
    return missionState.progressData[missionState.currentDay];
  }, [missionState.progressData, missionState.currentDay]);

  const getCurrentDayReflection = useCallback(() => {
    return missionState.reflectionsData[missionState.currentDay];
  }, [missionState.reflectionsData, missionState.currentDay]);

  const getCurrentDayChoiceData = useCallback(() => {
    const currentChoice = getCurrentDayChoice();
    if (!currentChoice) return null;
    return missionState.choicesData[currentChoice.id];
  }, [getCurrentDayChoice, missionState.choicesData]);

  // Process consequences from choices with persistence
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

  // Process rewards with persistence
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

  // Handle user choice with persistence
  const handleChoice = useCallback(async (choiceId: string) => {
    const currentChoiceEvent = getCurrentDayChoice();
    if (!currentChoiceEvent) return;

    const selectedChoice = currentChoiceEvent.choices.find(c => c.id === choiceId);
    if (!selectedChoice) return;

    try {
      // Update persistent state
      await updateState({
        choicesData: {
          ...missionState.choicesData,
          [currentChoiceEvent.id]: {
            choiceId,
            consequences: selectedChoice.consequences,
            chosenAt: new Date().toISOString(),
          }
        }
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
  }, [getCurrentDayChoice, missionState.choicesData, updateState, processConsequences, language]);

  // Handle daily reflection with persistence
  const handleReflection = useCallback(async (answer: any) => {
    const currentQuestion = getCurrentDayQuestion();
    if (!currentQuestion) return;

    try {
      // Update persistent state
      await updateState({
        reflectionsData: {
          ...missionState.reflectionsData,
          [missionState.currentDay]: {
            question: currentQuestion.question,
            answer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer),
            reflectionType: currentQuestion.type,
          }
        }
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
  }, [getCurrentDayQuestion, missionState.reflectionsData, missionState.currentDay, updateState, language]);

  // Complete current day with persistence
  const completeDay = useCallback(async () => {
    try {
      const completedAt = new Date().toISOString();
      
      // Update persistent state
      await updateState({
        progressData: {
          ...missionState.progressData,
          [missionState.currentDay]: {
            completed: true,
            completedAt,
            data: { completedAt }
          }
        },
        currentDay: missionState.currentDay + 1,
      });

      // Check for milestone rewards
      const milestone = mission.milestoneRewards?.find(m => m.day === missionState.currentDay);
      if (milestone) {
        await processReward(milestone.reward);
      }

      const message = language === 'ru' 
        ? `День ${missionState.currentDay} завершён!` 
        : language === 'es' 
        ? `¡Día ${missionState.currentDay} completado!` 
        : `Day ${missionState.currentDay} completed!`;
      
      toast.success(message);
    } catch (error) {
      console.error('Error completing day:', error);
      toast.error('Error completing day');
    }
  }, [missionState.currentDay, missionState.progressData, mission.milestoneRewards, updateState, processReward, language]);

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

  // Calculate progress metrics
  const progressPercentage = Math.floor((Object.keys(missionState.progressData).filter(day => 
    missionState.progressData[parseInt(day)]?.completed
  ).length / mission.duration) * 100);

  const completedDays = Object.keys(missionState.progressData).filter(day => 
    missionState.progressData[parseInt(day)]?.completed
  ).length;

  return {
    // Current state
    currentDay: missionState.currentDay,
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
    progressPercentage,
    completedDays,
    totalDays: mission.duration,

    // Persistence state
    isLoading,
    isSaving,
    isOnline,
    lastSyncTime,
    forceSync: forcSync,

    // Loading states (for backward compatibility)
    isUpdating: isSaving,
  };
};