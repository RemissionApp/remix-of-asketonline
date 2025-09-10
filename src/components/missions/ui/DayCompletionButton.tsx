import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle, Clock, Lock } from 'lucide-react';

interface DayCompletionButtonProps {
  canComplete: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  isLoading?: boolean;
  dayNumber: number;
  hasCompletedToday?: boolean;
}

export const DayCompletionButton: React.FC<DayCompletionButtonProps> = ({
  canComplete,
  isCompleted,
  onComplete,
  isLoading = false,
  dayNumber,
  hasCompletedToday = false,
}) => {
  const { language } = useAppStore();

  if (isCompleted) {
    return (
      <Button
        disabled
        variant="outline"
        className="w-full bg-cosmic-accent/20 border-cosmic-accent text-cosmic-accent cursor-not-allowed"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        {language === 'ru' ? 'День завершён' : language === 'es' ? 'Día completado' : 'Day Completed'}
      </Button>
    );
  }

  if (hasCompletedToday) {
    return (
      <Button
        disabled
        variant="outline"
        className="w-full bg-orange-500/20 border-orange-500 text-orange-400 cursor-not-allowed"
      >
        <Clock className="mr-2 h-4 w-4" />
        {language === 'ru' 
          ? 'Сегодня уже был завершён один шаг' 
          : language === 'es' 
          ? 'Ya se completó un paso hoy' 
          : 'One step already completed today'}
      </Button>
    );
  }

  if (!canComplete) {
    return (
      <Button
        disabled
        variant="outline"
        className="w-full bg-cosmic-dark/50 border-cosmic-accent/30 text-cosmic-silver/50 cursor-not-allowed"
      >
        <Lock className="mr-2 h-4 w-4" />
        {language === 'ru' 
          ? 'Выполните все задания дня' 
          : language === 'es' 
          ? 'Completa todas las tareas del día' 
          : 'Complete all daily tasks'}
      </Button>
    );
  }

  return (
    <Button
      onClick={onComplete}
      disabled={isLoading}
      className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 disabled:opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cosmic-dark mr-2"></div>
          {language === 'ru' ? 'Завершение...' : language === 'es' ? 'Completando...' : 'Completing...'}
        </div>
      ) : (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          {language === 'ru' ? `Завершить день ${dayNumber}` : language === 'es' ? `Completar día ${dayNumber}` : `Complete Day ${dayNumber}`}
        </>
      )}
    </Button>
  );
};