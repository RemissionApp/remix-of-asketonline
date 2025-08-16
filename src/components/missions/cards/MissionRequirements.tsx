import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
import { MissionRequirement } from '@/types';

interface MissionRequirementsProps {
  requirements: string[] | MissionRequirement[];
  requirementStatus: boolean[];
  toggleRequirement: (index: number) => void;
  acceptedMission: boolean;
  missionType?: 'single' | 'multi-day' | 'chain';
  canCompleteToday: boolean;
  daysCompleted?: number;
  totalDays?: number;
}

export const MissionRequirements: React.FC<MissionRequirementsProps> = ({
  requirements,
  requirementStatus,
  toggleRequirement,
  acceptedMission,
  missionType,
  canCompleteToday,
  daysCompleted = 0,
  totalDays = 0,
}) => {
  const { language } = useAppStore();

  // Convert requirements to string array if they are MissionRequirement objects
  const requirementStrings = requirements.map(req =>
    typeof req === 'string' ? req : req.type
  );

  // For multi-day missions, we only need to show the first requirement
  const displayRequirements =
    missionType === 'multi-day'
      ? requirementStrings.slice(0, 1)
      : requirementStrings;

  const handleToggle = (index: number) => {
    // For multi-day missions, only allow checking today's requirement
    if (
      missionType === 'multi-day' &&
      !canCompleteToday &&
      !requirementStatus[index]
    ) {
      toast.error(
        language === 'ru'
          ? 'Вы уже выполнили задачу сегодня. Возвращайтесь завтра!'
          : language === 'es'
            ? '¡Ya has completado la tarea hoy. ¡Vuelve mañana!'
            : "You already completed today's task. Come back tomorrow!"
      );
      return;
    }

    toggleRequirement(index);
  };

  if (acceptedMission) {
    return (
      <ul className="space-y-3 mb-4">
        {displayRequirements.map((req, i) => (
          <li key={i} className="flex items-start">
            <div className="flex items-center h-5 mr-2">
              {requirementStatus[i] ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <CheckSquare size={16} className="text-green-500" />
                </div>
              ) : (
                <Checkbox
                  id={`req-${i}`}
                  checked={false}
                  onCheckedChange={() => handleToggle(i)}
                  className="border-cosmic-gold data-[state=checked]:bg-cosmic-gold data-[state=checked]:text-cosmic-dark rounded-sm"
                  disabled={missionType === 'multi-day' && !canCompleteToday}
                />
              )}
            </div>
            <label
              htmlFor={`req-${i}`}
              className={cn(
                'text-sm text-white cursor-pointer',
                requirementStatus[i] && 'line-through opacity-70'
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
      {displayRequirements.map((req, i) => (
        <li key={i} className="flex items-start">
          <ArrowRight className="w-4 h-4 text-cosmic-gold mr-2 mt-0.5" />
          <span className="text-sm text-white">{req}</span>
        </li>
      ))}
    </ul>
  );
};
