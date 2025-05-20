
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { isToday } from 'date-fns';

interface MissionProgressProps {
  progress: number;
  lastCompletedDate: Date | null;
  missionType?: 'single' | 'multi-day' | 'chain';
}

export const MissionProgress: React.FC<MissionProgressProps> = ({
  progress,
  lastCompletedDate,
  missionType
}) => {
  const { language } = useAppStore();
  
  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-cosmic-gold mb-1">
          <span>
            {language === 'ru' ? 'Прогресс' : 
             language === 'es' ? 'Progreso' : 
             'Progress'}
          </span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {missionType === 'multi-day' && lastCompletedDate && isToday(lastCompletedDate) && (
        <div className="text-xs text-cosmic-secondary mb-3">
          {language === 'ru' ? 'Задача на сегодня выполнена' : 
           language === 'es' ? 'Tarea de hoy completada' : 
           'Today\'s task completed'}
        </div>
      )}
    </>
  );
};
