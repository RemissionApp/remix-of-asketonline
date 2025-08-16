import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, CheckSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Progress } from '@/components/ui/progress';
import { isToday } from 'date-fns';

export const ActiveMissionWidget: React.FC = () => {
  const { language, userProfile } = useAppStore();
  const navigate = useNavigate();

  // No active mission
  if (!userProfile?.activeMission) {
    return null;
  }

  const mission = userProfile.activeMission;

  // Calculate progress
  const completedCount =
    mission.progress?.filter(p => p.completed)?.length || 0;
  const totalRequirements = mission.progress?.length || 1;
  const progress = Math.floor((completedCount / totalRequirements) * 100);

  // Calculate if today's task was completed
  const lastCompletedDate = mission.progress
    ?.filter(p => p.completed)
    ?.map(p => new Date(p.date))
    ?.sort((a, b) => b.getTime() - a.getTime())[0];

  const todayCompleted = lastCompletedDate && isToday(lastCompletedDate);

  // Language specific strings
  const getTitle = () => {
    switch (language) {
      case 'ru':
        return 'Активная миссия';
      case 'es':
        return 'Misión activa';
      default:
        return 'Active mission';
    }
  };

  const getReminderText = () => {
    if (todayCompleted) {
      return language === 'ru'
        ? 'Задача на сегодня выполнена'
        : language === 'es'
          ? 'Tarea de hoy completada'
          : "Today's task completed";
    }

    return language === 'ru'
      ? 'Задача на сегодня не выполнена'
      : language === 'es'
        ? 'Tarea de hoy pendiente'
        : "Today's task pending";
  };

  const handleClick = () => {
    navigate('/cosmic-missions');
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 relative overflow-hidden">
        <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent relative z-10">
          <div className="flex items-center mb-3">
            <div className="cosmic-block-icon-wrapper bg-cosmic-dark/60">
              <Star size={24} className="text-cosmic-accent" />
            </div>

            <h3 className="text-lg font-medium text-white ml-2">
              {mission.title}
            </h3>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-cosmic-secondary mb-1">
              <span className="flex items-center">
                <Clock size={14} className="inline mr-1" />
                {mission.type === 'multi-day'
                  ? `${completedCount}/${totalRequirements} ${language === 'ru' ? 'дней' : language === 'es' ? 'días' : 'days'}`
                  : language === 'ru'
                    ? 'Одноразовая'
                    : language === 'es'
                      ? 'Única'
                      : 'One-time'}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {todayCompleted && (
            <div className="text-xs text-cosmic-secondary flex items-center">
              <CheckSquare size={14} className="inline mr-1 text-green-500" />
              {getReminderText()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
