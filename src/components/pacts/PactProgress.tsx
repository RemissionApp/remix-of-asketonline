import React from 'react';
import { Calendar, Flame, Trophy, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { ru, es, enUS } from 'date-fns/locale';

interface PactProgressProps {
  pact: {
    days: Array<{ completed: boolean; date: string }>;
    duration: number;
    start_date: string;
    end_date: string;
    status: string;
  };
  showDetails?: boolean;
  className?: string;
}

export const PactProgress: React.FC<PactProgressProps> = ({
  pact,
  showDetails = false,
  className
}) => {
  const { language } = useAppStore();

  const getText = (key: string) => {
    const texts = {
      ru: {
        completed: 'Завершено',
        remaining: 'Осталось',
        days: 'дней',
        day: 'день',
        streak: 'Серия',
        progress: 'Прогресс',
        startDate: 'Начало',
        endDate: 'Окончание'
      },
      es: {
        completed: 'Completado',
        remaining: 'Restante',
        days: 'días',
        day: 'día',
        streak: 'Racha',
        progress: 'Progreso',
        startDate: 'Inicio',
        endDate: 'Fin'
      },
      en: {
        completed: 'Completed',
        remaining: 'Remaining',
        days: 'days',
        day: 'day',
        streak: 'Streak',
        progress: 'Progress',
        startDate: 'Start',
        endDate: 'End'
      }
    };
    return texts[language][key] || texts.en[key];
  };

  const getLocale = () => {
    switch (language) {
      case 'ru': return ru;
      case 'es': return es;
      default: return enUS;
    }
  };

  const daysCompleted = pact.days.filter(day => day.completed).length;
  const progressPercent = Math.round((daysCompleted / pact.duration) * 100);
  const remainingDays = pact.duration - daysCompleted;

  // Calculate current streak
  const calculateStreak = () => {
    let streak = 0;
    const sortedDays = [...pact.days].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (const day of sortedDays) {
      if (day.completed) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const startDate = new Date(pact.start_date);
  const endDate = new Date(pact.end_date);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-cosmic-secondary">
            {getText('progress')}
          </span>
          <span className="text-sm font-bold text-white">
            {progressPercent}%
          </span>
        </div>
        <Progress 
          value={progressPercent} 
          className="h-3 bg-cosmic-dark/60"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Completed Days */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cosmic-dark/40 border border-cosmic-accent/20">
          <Trophy className="w-4 h-4 text-cosmic-gold" />
          <div>
            <div className="text-lg font-bold text-cosmic-gold">
              {daysCompleted}
            </div>
            <div className="text-xs text-cosmic-secondary">
              {getText('completed')}
            </div>
          </div>
        </div>

        {/* Remaining Days */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cosmic-dark/40 border border-cosmic-accent/20">
          <Clock className="w-4 h-4 text-cosmic-accent" />
          <div>
            <div className="text-lg font-bold text-cosmic-accent">
              {remainingDays}
            </div>
            <div className="text-xs text-cosmic-secondary">
              {getText('remaining')}
            </div>
          </div>
        </div>
      </div>

      {/* Streak Display */}
      {currentStreak > 0 && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <Flame className="w-5 h-5 text-orange-400" />
          <div className="text-center">
            <div className="text-lg font-bold text-orange-400">
              {currentStreak}
            </div>
            <div className="text-xs text-orange-300">
              {getText('streak')}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-3 pt-2 border-t border-cosmic-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cosmic-secondary" />
              <span className="text-sm text-cosmic-secondary">
                {getText('startDate')}
              </span>
            </div>
            <span className="text-sm text-white">
              {format(startDate, 'dd MMM yyyy', { locale: getLocale() })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cosmic-secondary" />
              <span className="text-sm text-cosmic-secondary">
                {getText('endDate')}
              </span>
            </div>
            <span className="text-sm text-white">
              {format(endDate, 'dd MMM yyyy', { locale: getLocale() })}
            </span>
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex justify-center">
        <Badge 
          variant={pact.status === 'active' ? 'default' : 'secondary'}
          className={cn(
            'px-3 py-1',
            pact.status === 'active' 
              ? 'bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/30' 
              : 'bg-cosmic-secondary/20 text-cosmic-secondary border-cosmic-secondary/30'
          )}
        >
          {pact.status === 'active' 
            ? (language === 'ru' ? 'Активная' : language === 'es' ? 'Activa' : 'Active')
            : (language === 'ru' ? 'Завершена' : language === 'es' ? 'Completada' : 'Completed')
          }
        </Badge>
      </div>
    </div>
  );
};