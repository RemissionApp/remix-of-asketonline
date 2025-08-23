import React from 'react';
import { Mission } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useMissionState } from '@/hooks/useMissionState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Star, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressTimelineProps {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ mission, isOpen, onClose }) => {
  const { language } = useAppStore();
  const missionState = useMissionState(mission);

  const getDayStatus = (dayNumber: number) => {
    if (dayNumber < missionState.currentDay) return 'completed';
    if (dayNumber === missionState.currentDay) return 'current';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'current':
        return <Clock className="w-5 h-5 text-cosmic-gold" />;
      default:
        return <Circle className="w-5 h-5 text-cosmic-silver/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/50';
      case 'current':
        return 'bg-cosmic-gold/20 border-cosmic-gold/50';
      default:
        return 'bg-cosmic-silver/10 border-cosmic-silver/30';
    }
  };

  const generateTimelineData = () => {
    const timelineData = [];
    
    for (let day = 1; day <= mission.duration; day++) {
      const status = getDayStatus(day);
      const hasChoice = mission.choiceEvents?.some(event => event.day === day);
      const hasQuestion = mission.dailyQuestions?.some(q => q.day === day);
      const hasMilestone = mission.milestoneRewards?.some(m => m.day === day);
      
      timelineData.push({
        day,
        status,
        hasChoice,
        hasQuestion,
        hasMilestone,
      });
    }
    
    return timelineData;
  };

  const timelineData = generateTimelineData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-cosmic-dark/95 border-cosmic-accent/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-cosmic-gold">
            {language === 'ru' ? 'Временная линия миссии' : language === 'es' ? 'Línea de tiempo de la misión' : 'Mission Timeline'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-cosmic-accent/30"></div>
            <div 
              className="absolute left-6 top-0 w-0.5 bg-cosmic-gold transition-all duration-500"
              style={{ height: `${(missionState.completedDays / mission.duration) * 100}%` }}
            ></div>
            
            <div className="space-y-4">
              {timelineData.map((item, index) => (
                <div key={item.day} className="relative flex items-center gap-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-cosmic-dark border-2 border-cosmic-accent/50">
                    {getStatusIcon(item.status)}
                  </div>
                  
                  {/* Day content */}
                  <div className={cn(
                    "flex-1 p-4 rounded-lg border transition-all duration-200",
                    getStatusColor(item.status),
                    item.status === 'current' && "animate-pulse"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-white">
                          {language === 'ru' ? `День ${item.day}` : language === 'es' ? `Día ${item.day}` : `Day ${item.day}`}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          {item.hasChoice && (
                            <Badge variant="outline" className="text-xs bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30">
                              🔮 {language === 'ru' ? 'Выбор' : language === 'es' ? 'Elección' : 'Choice'}
                            </Badge>
                          )}
                          
                          {item.hasQuestion && (
                            <Badge variant="outline" className="text-xs bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30">
                              ✨ {language === 'ru' ? 'Размышление' : language === 'es' ? 'Reflexión' : 'Reflection'}
                            </Badge>
                          )}
                          
                          {item.hasMilestone && (
                            <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                              <Gift className="w-3 h-3 mr-1" />
                              {language === 'ru' ? 'Награда' : language === 'es' ? 'Recompensa' : 'Reward'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {item.status === 'current' && (
                        <div className="text-cosmic-gold animate-bounce">
                          <Star className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    
                    {/* Additional details for current day */}
                    {item.status === 'current' && (
                      <div className="mt-3 pt-3 border-t border-cosmic-gold/20">
                        <div className="text-xs text-cosmic-silver space-y-1">
                          {mission.choiceEvents?.find(e => e.day === item.day) && (
                            <div>
                              <span className="text-cosmic-purple">🔮</span>
                              <span className="ml-2">
                                {mission.choiceEvents.find(e => e.day === item.day)?.title}
                              </span>
                            </div>
                          )}
                          
                          {mission.dailyQuestions?.find(q => q.day === item.day) && (
                            <div>
                              <span className="text-cosmic-gold">✨</span>
                              <span className="ml-2">
                                {mission.dailyQuestions.find(q => q.day === item.day)?.question}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary */}
          <div className="mt-6 p-4 bg-cosmic-accent/10 rounded-lg border border-cosmic-accent/30">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cosmic-gold">
                  {missionState.completedDays}
                </div>
                <div className="text-xs text-cosmic-silver">
                  {language === 'ru' ? 'Завершено' : language === 'es' ? 'Completado' : 'Completed'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-cosmic-accent">
                  {mission.duration - missionState.completedDays}
                </div>
                <div className="text-xs text-cosmic-silver">
                  {language === 'ru' ? 'Осталось' : language === 'es' ? 'Restante' : 'Remaining'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};