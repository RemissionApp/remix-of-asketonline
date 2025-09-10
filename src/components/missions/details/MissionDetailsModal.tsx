import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mission } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Target, Trophy, Calendar, Star } from 'lucide-react';
import { useMissionState } from '@/hooks/useMissionState';
import { useMissionTranslations } from '@/hooks/useMissionTranslations';

interface MissionDetailsModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({
  mission,
  isOpen,
  onClose,
}) => {
  const { language } = useAppStore();
  const { getTranslatedMissionTitle, getTranslatedMissionDescription, getTranslatedMissionRequirements } = useMissionTranslations();

  if (!mission) return null;

  const missionState = useMissionState(mission);
  
  // Get translated mission data
  const translatedTitle = getTranslatedMissionTitle(mission.id, mission.title);
  const translatedDescription = getTranslatedMissionDescription(mission.id, mission.description);
  const translatedRequirements = getTranslatedMissionRequirements(mission.id, mission.requirements);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'explorer': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'master': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'cosmic-warrior': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ritual': return '🕯️';
      case 'research': return '📚';
      case 'social': return '👥';
      case 'mystical': return '🔮';
      case 'challenge': return '⚔️';
      default: return '✨';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/30 text-white max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-cosmic-gold text-xl flex items-center gap-2">
            {getCategoryIcon(mission.category)}
            {translatedTitle}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Mission Overview */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getDifficultyColor(mission.difficulty)}>
                  {mission.difficulty}
                </Badge>
                <Badge className="bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30">
                  {mission.category}
                </Badge>
                <Badge className="bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/30">
                  {mission.duration} {language === 'ru' ? 'дней' : language === 'es' ? 'días' : 'days'}
                </Badge>
              </div>

              <p className="text-cosmic-silver leading-relaxed">
                {mission.description}
              </p>
            </div>

            {/* Progress Overview */}
            <div className="space-y-3 p-4 bg-cosmic-purple/10 rounded-lg border border-cosmic-purple/30">
              <h3 className="font-semibold text-cosmic-gold flex items-center gap-2">
                <Target className="w-4 h-4" />
                {language === 'ru' ? 'Прогресс миссии' : language === 'es' ? 'Progreso de la misión' : 'Mission Progress'}
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cosmic-silver">
                    {language === 'ru' ? 'Завершено дней' : language === 'es' ? 'Días completados' : 'Days Completed'}
                  </span>
                  <span className="text-cosmic-gold">
                    {missionState.completedDays} / {missionState.totalDays}
                  </span>
                </div>
                <Progress value={missionState.progressPercentage} className="h-2" />
                <div className="text-xs text-cosmic-silver text-center">
                  {missionState.progressPercentage}% {language === 'ru' ? 'завершено' : language === 'es' ? 'completado' : 'complete'}
                </div>
              </div>
            </div>

            {/* Current Day Status */}
            {missionState.currentDay <= missionState.totalDays && (
              <div className="space-y-3 p-4 bg-cosmic-accent/10 rounded-lg border border-cosmic-accent/30">
                <h3 className="font-semibold text-cosmic-gold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {language === 'ru' ? `День ${missionState.currentDay}` : language === 'es' ? `Día ${missionState.currentDay}` : `Day ${missionState.currentDay}`}
                </h3>
                
                <div className="space-y-2">
                  {missionState.currentDayChoice && (
                    <div className="text-sm">
                      <span className="text-cosmic-silver">
                        {language === 'ru' ? 'Выбор:' : language === 'es' ? 'Elección:' : 'Choice:'} 
                      </span>
                      <span className={missionState.currentDayChoiceData ? 'text-green-400 ml-2' : 'text-yellow-400 ml-2'}>
                        {missionState.currentDayChoiceData 
                          ? (language === 'ru' ? '✅ Сделан' : language === 'es' ? '✅ Realizada' : '✅ Made')
                          : (language === 'ru' ? '⏳ Ожидает' : language === 'es' ? '⏳ Pendiente' : '⏳ Pending')
                        }
                      </span>
                    </div>
                  )}
                  
                  {missionState.currentDayQuestion && (
                    <div className="text-sm">
                      <span className="text-cosmic-silver">
                        {language === 'ru' ? 'Размышление:' : language === 'es' ? 'Reflexión:' : 'Reflection:'} 
                      </span>
                      <span className={missionState.currentDayReflection ? 'text-green-400 ml-2' : 'text-yellow-400 ml-2'}>
                        {missionState.currentDayReflection 
                          ? (language === 'ru' ? '✅ Записано' : language === 'es' ? '✅ Registrada' : '✅ Recorded')
                          : (language === 'ru' ? '⏳ Ожидает' : language === 'es' ? '⏳ Pendiente' : '⏳ Pending')
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Milestone Rewards */}
            {mission.milestoneRewards && mission.milestoneRewards.length > 0 && (
              <div className="space-y-3 p-4 bg-cosmic-gold/10 rounded-lg border border-cosmic-gold/30">
                <h3 className="font-semibold text-cosmic-gold flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {language === 'ru' ? 'Награды за этапы' : language === 'es' ? 'Recompensas de hitos' : 'Milestone Rewards'}
                </h3>
                
                <div className="space-y-2">
                  {mission.milestoneRewards.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-cosmic-silver">
                        {language === 'ru' ? `День ${milestone.day}` : language === 'es' ? `Día ${milestone.day}` : `Day ${milestone.day}`}
                      </span>
                      <div className="flex items-center gap-2">
                        {milestone.reward.cosmicArtifact && (
                          <span className="text-purple-400">🔮</span>
                        )}
                        {milestone.reward.energyPoints && (
                          <span className="text-yellow-400">⚡{milestone.reward.energyPoints}</span>
                        )}
                        {missionState.completedDays >= milestone.day ? (
                          <span className="text-green-400">✅</span>
                        ) : (
                          <span className="text-cosmic-silver">⏳</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mission Requirements */}
            {translatedRequirements && translatedRequirements.length > 0 && (
              <div className="space-y-3 p-4 bg-cosmic-silver/10 rounded-lg border border-cosmic-silver/30">
                <h3 className="font-semibold text-cosmic-gold flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  {language === 'ru' ? 'Требования' : language === 'es' ? 'Requisitos' : 'Requirements'}
                </h3>
                
                <div className="space-y-1">
                  {translatedRequirements.map((req, index) => (
                    <div key={index} className="text-sm text-cosmic-silver flex items-center gap-2">
                      <span className="text-cosmic-accent">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};