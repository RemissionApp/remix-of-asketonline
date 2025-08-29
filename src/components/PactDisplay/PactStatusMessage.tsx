import React from 'react';
import { Plus, Trophy, Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { PactStatistics } from './PactStats';
import { Button } from '@/components/ui/button';

interface PactStatusMessageProps {
  stats: PactStatistics;
  onCreatePact?: () => void;
  className?: string;
}

export const PactStatusMessage: React.FC<PactStatusMessageProps> = ({
  stats,
  onCreatePact,
  className
}) => {
  const { language } = useAppStore();

  const getText = (key: string) => {
    const texts = {
      ru: {
        noActivePacts: 'Нет активных аскез',
        noActivePactsDesc: 'У вас есть завершённые аскезы, но нет активных. Создайте новую для продолжения пути развития.',
        noPacts: 'Пока нет аскез',
        noPactsDesc: 'Начните свой путь духовного развития, создав первую аскезу.',
        createFirst: 'Создать первую аскезу',
        createNew: 'Создать новую аскезу',
        completedMessage: 'Поздравляем! Вы завершили аскез:',
        wellDone: 'Отличная работа!'
      },
      es: {
        noActivePacts: 'No hay ascesis activas',
        noActivePactsDesc: 'Tienes ascesis completadas, pero ninguna activa. Crea una nueva para continuar tu camino de desarrollo.',
        noPacts: 'Aún no hay ascesis',
        noPactsDesc: 'Comienza tu camino de desarrollo espiritual creando tu primera ascesis.',
        createFirst: 'Crear primera ascesis',
        createNew: 'Crear nueva ascesis',
        completedMessage: '¡Felicidades! Has completado ascesis:',
        wellDone: '¡Excelente trabajo!'
      },
      en: {
        noActivePacts: 'No active ascesis',
        noActivePactsDesc: 'You have completed ascesis, but none are active. Create a new one to continue your development path.',
        noPacts: 'No ascesis yet',
        noPactsDesc: 'Start your spiritual development journey by creating your first ascesis.',
        createFirst: 'Create first ascesis',
        createNew: 'Create new ascesis',
        completedMessage: 'Congratulations! You have completed ascesis:',
        wellDone: 'Great work!'
      }
    };
    return texts[language][key] || texts.en[key];
  };

  // No pacts at all
  if (stats.total === 0) {
    return (
      <div className={cn(
        "text-center py-12 px-6",
        "bg-cosmic-dark/20 backdrop-blur-sm border border-cosmic-accent/20 rounded-xl",
        className
      )}>
        <Target className="w-16 h-16 text-cosmic-accent mx-auto mb-4 opacity-60" />
        <h3 className="text-xl font-serif text-cosmic-accent mb-2">
          {getText('noPacts')}
        </h3>
        <p className="text-cosmic-secondary mb-6 max-w-md mx-auto">
          {getText('noPactsDesc')}
        </p>
        {onCreatePact && (
          <Button
            onClick={onCreatePact}
            className="bg-cosmic-accent hover:bg-cosmic-accent/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {getText('createFirst')}
          </Button>
        )}
      </div>
    );
  }

  // Has pacts but no active ones
  if (stats.active === 0 && stats.total > 0) {
    return (
      <div className={cn(
        "text-center py-8 px-6",
        "bg-cosmic-dark/20 backdrop-blur-sm border border-cosmic-accent/20 rounded-xl",
        className
      )}>
        {stats.completed > 0 && (
          <>
            <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-serif text-green-400 mb-2">
              {getText('wellDone')}
            </h3>
            <p className="text-cosmic-secondary mb-1">
              {getText('completedMessage')} {stats.completed}
            </p>
          </>
        )}
        
        <div className="mt-4">
          <h4 className="text-cosmic-accent mb-2">{getText('noActivePacts')}</h4>
          <p className="text-cosmic-secondary text-sm mb-4">
            {getText('noActivePactsDesc')}
          </p>
          {onCreatePact && (
            <Button
              onClick={onCreatePact}
              size="sm"
              className="bg-cosmic-accent hover:bg-cosmic-accent/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {getText('createNew')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};