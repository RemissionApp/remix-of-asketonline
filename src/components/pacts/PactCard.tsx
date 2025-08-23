import React from 'react';
import { Heart, Zap, Shield, Star, Target, Calendar, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Pact } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { PactProgress } from './PactProgress';

interface PactCardProps {
  pact: Pact;
  onClick?: () => void;
  compact?: boolean;
  showProgress?: boolean;
}

const getPactTypeIcon = (type?: string) => {
  switch (type?.toLowerCase()) {
    case 'health':
    case 'здоровье':
      return Heart;
    case 'energy':
    case 'энергия':
      return Zap;
    case 'protection':
    case 'защита':
      return Shield;
    case 'spiritual':
    case 'духовная':
      return Star;
    default:
      return Target;
  }
};

const getPactTypeColor = (type?: string) => {
  switch (type?.toLowerCase()) {
    case 'health':
    case 'здоровье':
      return 'text-red-400 border-red-500/30 bg-red-500/10';
    case 'energy':
    case 'энергия':
      return 'text-cosmic-accent border-cosmic-accent/30 bg-cosmic-accent/10';
    case 'protection':
    case 'защита':
      return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    case 'spiritual':
    case 'духовная':
      return 'text-cosmic-gold border-cosmic-gold/30 bg-cosmic-gold/10';
    default:
      return 'text-cosmic-secondary border-cosmic-secondary/30 bg-cosmic-secondary/10';
  }
};

export const PactCard: React.FC<PactCardProps> = ({ 
  pact, 
  onClick, 
  compact = false,
  showProgress = true 
}) => {
  const { language } = useAppStore();
  
  const getText = (key: string) => {
    const texts = {
      ru: {
        active: 'Активная',
        completed: 'Завершена',
        failed: 'Прервана',
        planned: 'Запланирована',
        days: 'дней',
        day: 'день',
        reward: 'Награда'
      },
      es: {
        active: 'Activa',
        completed: 'Completada',
        failed: 'Interrumpida',
        planned: 'Planificada',
        days: 'días',
        day: 'día',
        reward: 'Recompensa'
      },
      en: {
        active: 'Active',
        completed: 'Completed',
        failed: 'Failed',
        planned: 'Planned',
        days: 'days',
        day: 'day',
        reward: 'Reward'
      }
    };
    return texts[language][key] || texts.en[key];
  };

  const daysCompleted = pact.days.filter(day => day.completed).length;
  const progressPercent = Math.round((daysCompleted / pact.duration) * 100);
  const IconComponent = getPactTypeIcon(pact.type);
  const typeColors = getPactTypeColor(pact.type);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/30';
      case 'completed':
        return 'bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-cosmic-secondary/20 text-cosmic-secondary border-cosmic-secondary/30';
    }
  };

  if (compact) {
    return (
      <Card 
        className={cn(
          "cosmic-card cursor-pointer hover-scale transition-all duration-300",
          "bg-cosmic-dark/60 border-cosmic-accent/20 hover:border-cosmic-accent/40"
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-full border", typeColors)}>
                <IconComponent className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white text-sm line-clamp-1">
                {pact.title}
              </h3>
            </div>
            <Badge className={cn("text-xs", getStatusColor(pact.status))}>
              {getText(pact.status)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-cosmic-secondary">
                {daysCompleted}/{pact.duration} {getText('days')}
              </span>
              <span className="text-white font-medium">
                {progressPercent}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {currentStreak > 0 && (
            <div className="flex items-center gap-1 mt-2 text-orange-400">
              <Flame className="w-3 h-3" />
              <span className="text-xs font-medium">{currentStreak}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "cosmic-card cursor-pointer hover-scale transition-all duration-300",
        "bg-cosmic-dark/60 border-cosmic-accent/20 hover:border-cosmic-accent/40",
        "shadow-lg shadow-cosmic-accent/5"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full border", typeColors)}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-white line-clamp-2">
                {pact.title}
              </h3>
              {pact.type && (
                <p className="text-sm text-cosmic-secondary capitalize">
                  {pact.type}
                </p>
              )}
            </div>
          </div>
          <Badge className={cn("ml-2", getStatusColor(pact.status))}>
            {getText(pact.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {showProgress && (
          <PactProgress 
            pact={pact} 
            showDetails={false}
            className="mb-4" 
          />
        )}

        {/* Reward Section */}
        {pact.reward && (
          <div className="mt-4 p-3 rounded-lg bg-cosmic-accent/10 border border-cosmic-accent/20">
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-cosmic-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-cosmic-gold font-medium mb-1">
                  {getText('reward')}
                </p>
                <p className="text-sm text-white line-clamp-2">
                  {pact.reward}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cosmic-accent/10">
          <div className="flex items-center gap-1 text-cosmic-secondary">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">
              {pact.duration} {getText('days')}
            </span>
          </div>
          
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 text-orange-400">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">
                {currentStreak} streak
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};