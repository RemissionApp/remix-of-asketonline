import React from 'react';
import { cn } from '@/lib/utils';
import { Mission } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Zap, Trophy, Calendar, ArrowRight } from 'lucide-react';
import { ProgressSyncIndicator } from '../progress/ProgressSyncIndicator';
import { MilestoneTracker } from '../rewards/MilestoneTracker';
import { CosmicArtifactCard } from '../rewards/CosmicArtifactCard';
import { PathChoiceModal } from './PathChoiceModal';
import { DailyReflectionForm } from './DailyReflectionForm';
import { useMissionState } from '@/hooks/useMissionState';
import { useRewardSystem } from '@/hooks/useRewardSystem';

interface InteractiveMissionCardProps {
  mission: Mission;
  className?: string;
  onStart?: () => void;
  onComplete?: () => void;
}

export const InteractiveMissionCard: React.FC<InteractiveMissionCardProps> = ({
  mission,
  className,
  onStart,
  onComplete,
}) => {
  const { language, userProfile } = useAppStore();
  const { onMissionComplete, onArtifactFound } = useRewardSystem();
  const [showChoiceModal, setShowChoiceModal] = React.useState(false);
  const [showReflectionForm, setShowReflectionForm] = React.useState(false);

  // Use the new mission state hook
  const missionState = useMissionState(mission);

  // All data now comes from missionState hook
  const {
    currentDay,
    currentDayChoice,
    currentDayQuestion,
    currentDayProgress,
    currentDayReflection,
    currentDayChoiceData,
    handleChoice,
    handleReflection,
    completeDay,
    canCompleteDay,
    progressPercentage,
    completedDays,
    totalDays,
    isLoading,
    isSaving,
  } = missionState;

  // Определим специальные миссии с фоновыми изображениями
  const isSilenceChallenge =
    mission.title.includes('тишины') ||
    mission.title.includes('silence') ||
    mission.title.includes('silencio');

  const isGratitudeChain =
    mission.title.includes('благодарности') ||
    mission.title.includes('gratitude') ||
    mission.title.includes('gratitud');

  const isMorningRitual =
    mission.title.includes('Утренний ритуал') ||
    mission.title.includes('Morning mindfulness') ||
    mission.title.includes('Ritual matutino');

  const isCleansingRitual =
    mission.title.includes('очищения пространства') ||
    mission.title.includes('Space cleansing') ||
    mission.title.includes('limpieza de espacio');

  // Выбор фонового изображения в зависимости от миссии
  let backgroundStyle = {} as React.CSSProperties;

  if (isSilenceChallenge) {
    backgroundStyle = {
      backgroundImage:
        "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//slse.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    };
  } else if (isGratitudeChain) {
    backgroundStyle = {
      backgroundImage:
        "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Thanks.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    };
  } else if (isMorningRitual) {
    backgroundStyle = {
      backgroundImage:
        "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//morning.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    };
  } else if (isCleansingRitual) {
    backgroundStyle = {
      backgroundImage:
        "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//ritual.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    };
  }

  // Определение, нужен ли градиент поверх фона
  const needsOverlay =
    isSilenceChallenge ||
    isGratitudeChain ||
    isMorningRitual ||
    isCleansingRitual;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return 'bg-green-500/20 text-green-300';
      case 'explorer': return 'bg-blue-500/20 text-blue-300';
      case 'master': return 'bg-purple-500/20 text-purple-300';
      case 'cosmic-warrior': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ritual': return '🕯️';
      case 'research': return '📚';
      case 'social': return '👥';
      case 'mystical': return '🔮';
      case 'challenge': return '⚔️';
      default: return '✨';
    }
  };

  const isStarted = userProfile?.activeMission?.id === mission.id;
  const canStart = !userProfile?.activeMission || userProfile.activeMission.id === mission.id;
  const isCompleted = currentDayProgress?.completed && currentDay > totalDays;

  if (isLoading) {
    return (
      <Card className="bg-cosmic-dark/50 border-cosmic-accent/30 animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-cosmic-accent/20 rounded w-3/4"></div>
            <div className="h-4 bg-cosmic-accent/10 rounded w-full"></div>
            <div className="h-2 bg-cosmic-accent/10 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card 
        className={cn(
          "bg-cosmic-dark/50 border-cosmic-accent/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-cosmic-glow overflow-hidden",
          needsOverlay && 'relative',
          className
        )}
        style={backgroundStyle}
      >
        {needsOverlay && (
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-dark/40 to-cosmic-indigo/30"></div>
        )}

        <CardHeader className={cn('relative z-10 pb-4', needsOverlay && 'animate-fade-in')}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl text-cosmic-gold mb-2 flex items-center gap-2">
                {getCategoryIcon(mission.category)}
                {mission.title}
              </CardTitle>
              <p className="text-cosmic-silver text-sm leading-relaxed">
                {mission.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <Badge className={getDifficultyColor(mission.difficulty)}>
                {mission.difficulty}
              </Badge>
              <Badge variant="outline" className="text-cosmic-accent border-cosmic-accent/30">
                {mission.category}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn('relative z-10 space-y-6', needsOverlay && 'animate-fade-in')}>
          {/* Progress Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cosmic-silver">
                  {language === 'ru' ? 'Прогресс' : language === 'es' ? 'Progreso' : 'Progress'}
                </span>
                <span className="text-cosmic-gold">
                  {completedDays}/{totalDays} {language === 'ru' ? 'дней' : language === 'es' ? 'días' : 'days'}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <ProgressSyncIndicator 
                isOnline={navigator.onLine} 
                syncStatus={isSaving ? 'syncing' : 'synced'} 
                lastSyncTime={new Date()} 
              />
            </div>

            {/* Milestone Tracker */}
            {mission.milestoneRewards && mission.milestoneRewards.length > 0 && (
              <MilestoneTracker 
                milestones={mission.milestoneRewards}
                currentDay={currentDay}
                completedDays={completedDays}
              />
            )}
          </div>

          {/* Daily Actions Section */}
          {isStarted && currentDay <= totalDays && (
            <div className="space-y-3 p-4 bg-cosmic-purple/10 rounded-lg border border-cosmic-purple/30">
              <h4 className="font-semibold text-cosmic-gold">
                ⭐ {language === 'ru' ? `День ${currentDay}` : language === 'es' ? `Día ${currentDay}` : `Day ${currentDay}`}
              </h4>
              
              <div className="flex flex-col gap-2">
                {/* Choice Event Button */}
                {currentDayChoice && !currentDayChoiceData && (
                  <Button
                    onClick={() => setShowChoiceModal(true)}
                    disabled={isSaving}
                    className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-white disabled:opacity-50"
                  >
                    🔮 {language === 'ru' ? 'Сделать выбор' : language === 'es' ? 'Hacer elección' : 'Make Choice'}
                  </Button>
                )}
                
                {/* Daily Reflection Button */}
                {currentDayQuestion && !currentDayReflection && (
                  <Button
                    onClick={() => setShowReflectionForm(true)}
                    disabled={isSaving}
                    className="bg-cosmic-gold hover:bg-cosmic-gold/80 text-cosmic-dark disabled:opacity-50"
                  >
                    ✨ {language === 'ru' ? 'Размышление дня' : language === 'es' ? 'Reflexión del día' : 'Daily Reflection'}
                  </Button>
                )}

                {/* Complete Day Button */}
                {canCompleteDay && (
                  <Button
                    onClick={async () => {
                      await completeDay();
                      // Выдаем награду за завершение дня
                      await onMissionComplete('daily');
                      
                      // Проверяем, если миссия полностью завершена
                      if (currentDay >= totalDays) {
                        await onMissionComplete('weekly');
                      }
                    }}
                    disabled={isSaving}
                    className="bg-cosmic-accent hover:bg-cosmic-accent/80 text-white disabled:opacity-50"
                  >
                    ✅ {language === 'ru' ? 'Завершить день' : language === 'es' ? 'Completar día' : 'Complete Day'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Mission Actions */}
          <div className="flex gap-2">
            {!isStarted && canStart && (
              <Button
                onClick={onStart}
                className="flex-1 bg-cosmic-gold hover:bg-cosmic-gold/90 text-cosmic-dark"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {language === 'ru' ? 'Начать миссию' : language === 'es' ? 'Comenzar misión' : 'Start Mission'}
              </Button>
            )}

            {isCompleted && (
              <Button
                onClick={async () => {
                  // Выдаем финальную награду за завершение миссии
                  await onMissionComplete('weekly');
                  
                  // Выдаем артефакт за завершение миссии
                  await onArtifactFound('rare');
                  
                  onComplete?.();
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Trophy className="w-4 h-4 mr-2" />
                {language === 'ru' ? 'Получить награду' : language === 'es' ? 'Reclamar recompensa' : 'Claim Reward'}
              </Button>
            )}
          </div>

          {/* Rewards Preview */}
          {mission.reward && (
            <div className="p-4 bg-cosmic-gold/10 rounded-lg border border-cosmic-gold/30">
              <h4 className="font-semibold text-cosmic-gold mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                {language === 'ru' ? 'Награда' : language === 'es' ? 'Recompensa' : 'Reward'}
              </h4>
              <div className="space-y-1">
                {mission.reward.energyPoints && (
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-cosmic-silver">
                      +{mission.reward.energyPoints} {language === 'ru' ? 'энергии' : language === 'es' ? 'energía' : 'energy'}
                    </span>
                  </div>
                )}
                {mission.reward.achievement && (
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-cosmic-gold" />
                    <span className="text-cosmic-silver">{mission.reward.achievement}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {currentDayChoice && (
        <PathChoiceModal
          isOpen={showChoiceModal}
          onClose={() => setShowChoiceModal(false)}
          choiceEvent={currentDayChoice}
          onChoice={(choiceId) => {
            handleChoice(choiceId);
            setShowChoiceModal(false);
          }}
        />
      )}

      {currentDayQuestion && (
        <DailyReflectionForm
          isOpen={showReflectionForm}
          onClose={() => setShowReflectionForm(false)}
          question={currentDayQuestion}
          onSubmit={(answer) => {
            handleReflection(answer);
            setShowReflectionForm(false);
          }}
        />
      )}
    </>
  );
};