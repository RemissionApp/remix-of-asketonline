
import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
import { isToday } from 'date-fns';

interface MissionRequirementsProps {
  requirements: string[];
  requirementStatus: boolean[];
  toggleRequirement: (index: number) => void;
  acceptedMission: boolean;
  missionType?: 'single' | 'multi-day' | 'chain';
  canCompleteToday: boolean;
}

export const MissionRequirements: React.FC<MissionRequirementsProps> = ({
  requirements,
  requirementStatus,
  toggleRequirement,
  acceptedMission,
  missionType,
  canCompleteToday
}) => {
  const { language } = useAppStore();

  const handleToggle = (index: number) => {
    // For multi-day missions, only allow checking today's requirement
    if (missionType === 'multi-day' && !canCompleteToday && !requirementStatus[index]) {
      toast.error(
        language === 'ru' ? 'Вы уже выполнили задачу сегодня. Возвращайтесь завтра!' : 
        language === 'es' ? '¡Ya has completado la tarea hoy. ¡Vuelve mañana!' : 
        'You already completed today\'s task. Come back tomorrow!'
      );
      return;
    }
    
    toggleRequirement(index);
  };

  if (acceptedMission) {
    return (
      <ul className="space-y-3 mb-4">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-start">
            <div className="flex items-center h-5 mr-2">
              <Checkbox
                id={`req-${i}`}
                checked={requirementStatus[i] || false}
                onCheckedChange={() => handleToggle(i)}
                className="border-cosmic-gold data-[state=checked]:bg-cosmic-gold data-[state=checked]:text-cosmic-dark"
                disabled={missionType === 'multi-day' && !canCompleteToday && !requirementStatus[i]}
              />
            </div>
            <label 
              htmlFor={`req-${i}`}
              className={cn(
                "text-sm text-white cursor-pointer",
                requirementStatus[i] && "line-through opacity-70"
              )}
            >
              {req}
            </label>
          </li>
        ))}
      </ul>
    );
  }
  
  return (
    <ul className="space-y-2 mb-4">
      {requirements.map((req, i) => (
        <li key={i} className="flex items-start">
          <ArrowRight className="w-4 h-4 text-cosmic-gold mr-2 mt-0.5" />
          <span className="text-sm text-white">{req}</span>
        </li>
      ))}
    </ul>
  );
};
