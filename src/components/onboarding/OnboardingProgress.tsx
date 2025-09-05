import { Progress } from '@/components/ui/progress';
import { useOptimizedOnboarding } from '@/hooks/useOptimizedOnboarding';
import { Check } from 'lucide-react';

export const OnboardingProgress = () => {
  const { progress } = useOptimizedOnboarding();

  const steps = [
    { key: 'profile', label: 'Профиль' },
    { key: 'preferences', label: 'Настройки' },
    { key: 'tour', label: 'Обзор' },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Прогресс настройки</span>
        <span>{progress.completedSteps}/{progress.totalSteps}</span>
      </div>
      
      <Progress value={progress.progress} className="h-2" />
      
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < progress.completedSteps;
          const isCurrent = index === progress.completedSteps;
          
          return (
            <div
              key={step.key}
              className={`flex flex-col items-center space-y-1 ${
                isCurrent ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                    ? 'border-primary bg-primary/10'
                    : 'border-muted-foreground/30'
                }`}
              >
                {isCompleted ? (
                  <Check size={16} />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className="text-xs">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};