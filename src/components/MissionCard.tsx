
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CosmicButton } from './CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionCardProps {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed?: boolean;
  className?: string;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  id,
  title,
  description,
  reward,
  completed = false,
  className
}) => {
  const { completeMission } = useAppStore();
  
  const handleComplete = () => {
    completeMission(id);
  };
  
  return (
    <Card className={cn("overflow-hidden border border-cosmic-accent/30 bg-cosmic-dark/40 backdrop-blur-sm", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <Badge variant={completed ? "outline" : "default"} className={completed ? "bg-cosmic-accent/20 text-cosmic-accent" : "bg-cosmic-accent/80"}>
            {completed ? "Completed" : "Active"}
          </Badge>
        </div>
        
        <p className="text-sm text-cosmic-secondary mb-4">{description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CircleDot size={16} className="text-cosmic-gold mr-1" />
            <span className="text-cosmic-gold font-medium">+{reward}</span>
          </div>
          
          {!completed && (
            <CosmicButton size="sm" onClick={handleComplete}>
              Complete
            </CosmicButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
