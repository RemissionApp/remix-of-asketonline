import { useState, useEffect, useCallback } from 'react';
import { Mission, Choice, Consequence, EnhancedReward } from '@/types';
import { usePersistentMissionState } from './usePersistentMissionState';
import { useCosmicArtifacts } from './useCosmicArtifacts';
import { useAppStore } from '@/store/useAppStore';
import { useNotifications } from '@/components/notifications/NotificationSystem';

export const useEnhancedMissionState = (mission: Mission) => {
  const { language, userProfile, updateUserProfile } = useAppStore();
  const {
    showEnergyGained,
    showArtifactObtained,
    showMilestoneReached,
    showNotification,
  } = useNotifications();
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
    return mission.choiceEvents?.find(
      event => event.day === missionState.currentDay
    );
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

  // Process consequences from choices with cosmic notifications
  const processConsequences = useCallback(
    async (consequences: Consequence[]) => {
      for (const consequence of consequences) {
        switch (consequence.type) {
          case 'energy':
            if (userProfile) {
              await updateUserProfile({
                energyPoints:
                  (userProfile.energyPoints || 0) + consequence.value,
              });
              // Show cosmic energy notification
              showEnergyGained(consequence.value, language);
            }
            break;

          case 'unlock':
            // Show unlock notification
            showNotification({
              type: 'milestone',
              title:
                language === 'ru'
                  ? '🔓 Контент разблокирован!'
                  : language === 'es'
                    ? '🔓 ¡Contenido desbloqueado!'
                    : '🔓 Content Unlocked!',
              message: consequence.value,
              duration: 5000,
            });
            break;

          case 'message':
            // Show cosmic message notification
            showNotification({
              type: 'reminder',
              title:
                language === 'ru'
                  ? '💫 Космическое сообщение'
                  : language === 'es'
                    ? '💫 Mensaje cósmico'
                    : '💫 Cosmic Message',
              message: consequence.value,
              duration: 6000,
            });
            break;

          case 'bonus':
            await processReward(consequence.value as EnhancedReward);
            break;
        }
      }
    },
    [
      userProfile,
      updateUserProfile,
      showEnergyGained,
      showNotification,
      language,
    ]
  );

  // Process rewards with cosmic notifications
  const processReward = useCallback(
    async (reward: EnhancedReward) => {
      setIsProcessingReward(true);

      try {
        // Add cosmic artifacts with notification
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

          // Show cosmic artifact notification
          showArtifactObtained(
            reward.cosmicArtifact.name,
            reward.cosmicArtifact.rarity,
            language
          );
        }

        // Add energy points with notification
        if (reward.energyPoints && userProfile) {
          await updateUserProfile({
            energyPoints: (userProfile.energyPoints || 0) + reward.energyPoints,
          });
          showEnergyGained(reward.energyPoints, language);
        }

        // Handle rank bonus with notification
        if (reward.rankBonus && userProfile) {
          await updateUserProfile({
            energyPoints: (userProfile.energyPoints || 0) + reward.rankBonus,
          });
          showNotification({
            type: 'milestone',
            title:
              language === 'ru'
                ? '👑 Бонус за ранг!'
                : language === 'es'
                  ? '👑 ¡Bono de rango!'
                  : '👑 Rank Bonus!',
            message:
              language === 'ru'
                ? `+${reward.rankBonus} энергии за ваш ранг!`
                : language === 'es'
                  ? `+${reward.rankBonus} energía por tu rango!`
                  : `+${reward.rankBonus} energy for your rank!`,
            duration: 4000,
          });
        }
      } catch (error) {
        console.error('Error processing reward:', error);
        showNotification({
          type: 'reminder',
          title:
            language === 'ru'
              ? '❌ Ошибка'
              : language === 'es'
                ? '❌ Error'
                : '❌ Error',
          message: 'Error processing reward',
          duration: 3000,
        });
      } finally {
        setIsProcessingReward(false);
      }
    },
    [
      cosmicArtifacts,
      userProfile,
      updateUserProfile,
      mission.id,
      language,
      showArtifactObtained,
      showEnergyGained,
      showNotification,
    ]
  );

  // Handle user choice with persistence
  const handleChoice = useCallback(
    async (choiceId: string) => {
      const currentChoiceEvent = getCurrentDayChoice();
      if (!currentChoiceEvent) return;

      const selectedChoice = currentChoiceEvent.choices.find(
        c => c.id === choiceId
      );
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
            },
          },
        });

        // Process consequences
        await processConsequences(selectedChoice.consequences);

        // Show cosmic success notification
        showNotification({
          type: 'achievement',
          title:
            language === 'ru'
              ? '🎯 Выбор сделан!'
              : language === 'es'
                ? '🎯 ¡Elección realizada!'
                : '🎯 Choice Made!',
          message:
            language === 'ru'
              ? 'Ваш выбор изменит ход миссии!'
              : language === 'es'
                ? '¡Tu elección cambiará el curso de la misión!'
                : 'Your choice will change the course of the mission!',
          duration: 4000,
        });
      } catch (error) {
        console.error('Error making choice:', error);
        showNotification({
          type: 'reminder',
          title:
            language === 'ru'
              ? '❌ Ошибка выбора'
              : language === 'es'
                ? '❌ Error de elección'
                : '❌ Choice Error',
          message: 'Error making choice',
          duration: 3000,
        });
      }
    },
    [
      getCurrentDayChoice,
      missionState.choicesData,
      updateState,
      processConsequences,
      language,
    ]
  );

  // Handle daily reflection with persistence
  const handleReflection = useCallback(
    async (answer: any) => {
      const currentQuestion = getCurrentDayQuestion();
      if (!currentQuestion) return;

      try {
        // Update persistent state
        await updateState({
          reflectionsData: {
            ...missionState.reflectionsData,
            [missionState.currentDay]: {
              question: currentQuestion.question,
              answer:
                typeof answer === 'object'
                  ? JSON.stringify(answer)
                  : String(answer),
              reflectionType: currentQuestion.type,
            },
          },
        });

        // Show cosmic reflection notification
        showNotification({
          type: 'milestone',
          title:
            language === 'ru'
              ? '💭 Размышление сохранено!'
              : language === 'es'
                ? '💭 ¡Reflexión guardada!'
                : '💭 Reflection Saved!',
          message:
            language === 'ru'
              ? 'Ваши мысли записаны в космическом дневнике!'
              : language === 'es'
                ? '¡Tus pensamientos están registrados en el diario cósmico!'
                : 'Your thoughts are recorded in the cosmic journal!',
          duration: 4000,
        });
      } catch (error) {
        console.error('Error saving reflection:', error);
        showNotification({
          type: 'reminder',
          title:
            language === 'ru'
              ? '❌ Ошибка сохранения'
              : language === 'es'
                ? '❌ Error de guardado'
                : '❌ Save Error',
          message: 'Error saving reflection',
          duration: 3000,
        });
      }
    },
    [
      getCurrentDayQuestion,
      missionState.reflectionsData,
      missionState.currentDay,
      updateState,
      language,
    ]
  );

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
            data: { completedAt },
          },
        },
        currentDay: missionState.currentDay + 1,
      });

      // Check for milestone rewards
      const milestone = mission.milestoneRewards?.find(
        m => m.day === missionState.currentDay
      );
      if (milestone) {
        await processReward(milestone.reward);
        // Show special milestone notification
        showMilestoneReached(
          language === 'ru'
            ? `День ${missionState.currentDay}`
            : language === 'es'
              ? `Día ${missionState.currentDay}`
              : `Day ${missionState.currentDay}`,
          language === 'ru'
            ? 'Особая награда за этап!'
            : language === 'es'
              ? '¡Recompensa especial por hito!'
              : 'Special milestone reward!',
          language
        );
      }

      // Show cosmic day completion notification
      showNotification({
        type: 'achievement',
        title:
          language === 'ru'
            ? '🌟 День завершён!'
            : language === 'es'
              ? '🌟 ¡Día completado!'
              : '🌟 Day Completed!',
        message:
          language === 'ru'
            ? `День ${missionState.currentDay} успешно завершён! Вы на шаг ближе к завершению миссии.`
            : language === 'es'
              ? `¡Día ${missionState.currentDay} completado con éxito! Estás un paso más cerca de completar la misión.`
              : `Day ${missionState.currentDay} successfully completed! You're one step closer to mission completion.`,
        duration: 6000,
      });
    } catch (error) {
      console.error('Error completing day:', error);
      showNotification({
        type: 'reminder',
        title:
          language === 'ru'
            ? '❌ Ошибка завершения'
            : language === 'es'
              ? '❌ Error de finalización'
              : '❌ Completion Error',
        message: 'Error completing day',
        duration: 3000,
      });
    }
  }, [
    missionState.currentDay,
    missionState.progressData,
    mission.milestoneRewards,
    updateState,
    processReward,
    language,
  ]);

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
  }, [
    getCurrentDayProgress,
    getCurrentDayQuestion,
    getCurrentDayChoice,
    getCurrentDayReflection,
    getCurrentDayChoiceData,
  ]);

  // Calculate progress metrics
  const progressPercentage = Math.floor(
    (Object.keys(missionState.progressData).filter(
      day => missionState.progressData[parseInt(day)]?.completed
    ).length /
      mission.duration) *
      100
  );

  const completedDays = Object.keys(missionState.progressData).filter(
    day => missionState.progressData[parseInt(day)]?.completed
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
