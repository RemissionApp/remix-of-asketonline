import React from 'react';
import { cn } from '@/lib/utils';
import { Mission } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { MissionHeader } from '../cards/MissionHeader';
import { MissionRequirements } from '../cards/MissionRequirements';
import { MissionProgress } from '../cards/MissionProgress';
import { MissionReward } from '../cards/MissionReward';
import { MissionActions } from '../cards/MissionActions';
import { useMissionCard } from '../cards/useMissionCard';
import { DifficultyBadge } from './DifficultyBadge';
import { CategoryIcon } from './CategoryIcon';
import { PathChoiceModal } from './PathChoiceModal';
import { DailyReflectionForm } from './DailyReflectionForm';

interface InteractiveMissionCardProps {
  mission?: Mission;
  className?: string;
  onComplete?: () => void;
}

export const InteractiveMissionCard: React.FC<InteractiveMissionCardProps> = ({
  mission,
  className,
  onComplete,
}) => {
  const { language } = useAppStore();
  const [showChoiceModal, setShowChoiceModal] = React.useState(false);
  const [showReflectionForm, setShowReflectionForm] = React.useState(false);

  if (!mission) return null;

  const {
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
  } = useMissionCard(mission, onComplete);

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

  // Показать модальное окно выбора, если есть события выбора для текущего дня
  const currentDayChoice = mission.choiceEvents?.find(
    event => event.day === daysCompleted + 1
  );

  // Проверить, есть ли вопросы для текущего дня
  const todayQuestion = mission.dailyQuestions?.find(
    q => q.day === daysCompleted + 1
  );

  return (
    <>
      <div
        className={cn(
          'p-4 rounded-lg border border-cosmic-accent/20 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-cosmic-glow',
          needsOverlay && 'relative overflow-hidden',
          className
        )}
        style={backgroundStyle}
      >
        {needsOverlay && (
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-dark/40 to-cosmic-indigo/30"></div>
        )}

        <div className={cn('relative z-10', needsOverlay && 'animate-fade-in')}>
          {/* Enhanced Mission Header with badges */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <MissionHeader
                title={mission.title}
                description={mission.description}
                language={language}
                hasBackground={needsOverlay}
              />
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <DifficultyBadge difficulty={mission.difficulty} />
              <CategoryIcon category={mission.category} />
            </div>
          </div>

          <MissionRequirements
            requirements={mission.requirements}
            requirementStatus={requirementStatus}
            toggleRequirement={toggleRequirement}
            acceptedMission={acceptedMission}
            missionType={mission.type}
            canCompleteToday={canCompleteToday}
            daysCompleted={daysCompleted}
            totalDays={totalDays}
          />

          {acceptedMission && (
            <MissionProgress
              progress={progress}
              lastCompletedDate={lastCompletedDate}
              missionType={mission.type}
              daysCompleted={daysCompleted}
              totalDays={totalDays}
            />
          )}

          {/* Interactive elements */}
          {acceptedMission && (
            <div className="mb-4 space-y-2">
              {/* Choice Event Button */}
              {currentDayChoice && (
                <button
                  onClick={() => setShowChoiceModal(true)}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 hover:bg-cosmic-purple/30 border border-cosmic-purple/30 rounded-lg text-cosmic-purple transition-colors text-sm"
                >
                  🔮 {language === 'ru' ? 'Сделать выбор' : language === 'es' ? 'Hacer elección' : 'Make Choice'}
                </button>
              )}

              {/* Daily Reflection Button */}
              {todayQuestion && (
                <button
                  onClick={() => setShowReflectionForm(true)}
                  className="w-full px-3 py-2 bg-cosmic-gold/20 hover:bg-cosmic-gold/30 border border-cosmic-gold/30 rounded-lg text-cosmic-gold transition-colors text-sm"
                >
                  ✨ {language === 'ru' ? 'Ответить на вопрос дня' : language === 'es' ? 'Responder pregunta del día' : 'Answer daily question'}
                </button>
              )}
            </div>
          )}

          <MissionReward reward={mission.reward} />

          <MissionActions
            acceptedMission={acceptedMission}
            allCompleted={allCompleted}
            onComplete={handleCompleteMission}
            onAccept={handleAcceptMission}
          />
        </div>
      </div>

      {/* Modals */}
      {currentDayChoice && (
        <PathChoiceModal
          isOpen={showChoiceModal}
          onClose={() => setShowChoiceModal(false)}
          choiceEvent={currentDayChoice}
          onChoice={(choiceId) => {
            console.log('Choice made:', choiceId);
            setShowChoiceModal(false);
          }}
        />
      )}

      {todayQuestion && (
        <DailyReflectionForm
          isOpen={showReflectionForm}
          onClose={() => setShowReflectionForm(false)}
          question={todayQuestion}
          onSubmit={(answer) => {
            console.log('Reflection submitted:', answer);
            setShowReflectionForm(false);
          }}
        />
      )}
    </>
  );
};