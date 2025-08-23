import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Star, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MilestoneReward } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface MilestoneTrackerProps {
  milestones: MilestoneReward[];
  currentDay: number;
  completedDays: number;
  onClaimReward?: (milestone: MilestoneReward) => void;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
  currentDay,
  completedDays,
  onClaimReward,
}) => {
  const { language } = useAppStore();

  const getMilestoneStatus = (milestoneDay: number) => {
    if (completedDays >= milestoneDay) return 'completed';
    if (currentDay >= milestoneDay) return 'available';
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'available':
        return <Gift className="w-5 h-5 text-cosmic-gold animate-pulse" />;
      case 'locked':
        return <Circle className="w-5 h-5 text-cosmic-secondary/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/30';
      case 'available':
        return 'bg-cosmic-gold/10 border-cosmic-gold/30';
      case 'locked':
        return 'bg-cosmic-secondary/5 border-cosmic-secondary/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="w-5 h-5 text-cosmic-gold" />
        <h3 className="text-lg font-semibold text-white">
          {language === 'ru' 
            ? 'Этапные награды' 
            : language === 'es' 
              ? 'Recompensas por etapas' 
              : 'Milestone Rewards'}
        </h3>
      </div>

      <div className="space-y-3">
        {milestones
          .sort((a, b) => a.day - b.day)
          .map((milestone, index) => {
            const status = getMilestoneStatus(milestone.day);
            
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border transition-all duration-300',
                  getStatusColor(status),
                  status === 'available' && 'cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-cosmic-gold/20'
                )}
                onClick={() => status === 'available' && onClaimReward?.(milestone)}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <div>
                    <div className="font-medium text-white">
                      {language === 'ru' 
                        ? `День ${milestone.day}` 
                        : language === 'es' 
                          ? `Día ${milestone.day}` 
                          : `Day ${milestone.day}`}
                    </div>
                    <div className="text-sm text-cosmic-secondary">
                      {milestone.celebrationMessage}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  {milestone.reward.energyPoints && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                      +{milestone.reward.energyPoints}
                    </Badge>
                  )}
                  
                  {milestone.reward.cosmicArtifact && (
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                      {milestone.reward.cosmicArtifact.name}
                    </Badge>
                  )}
                  
                  {milestone.reward.achievement && (
                    <Badge variant="outline" className="bg-cosmic-gold/10 text-cosmic-gold border-cosmic-gold/30">
                      {language === 'ru' ? 'Достижение' : language === 'es' ? 'Logro' : 'Achievement'}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-cosmic-secondary mb-2">
          <span>
            {language === 'ru' ? 'Прогресс' : language === 'es' ? 'Progreso' : 'Progress'}
          </span>
          <span>{completedDays} / {Math.max(...milestones.map(m => m.day))}</span>
        </div>
        <div className="w-full bg-cosmic-secondary/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cosmic-gold to-cosmic-accent h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(completedDays / Math.max(...milestones.map(m => m.day))) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};