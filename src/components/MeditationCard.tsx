
import React from 'react';
import { LockIcon, PlayCircleIcon } from 'lucide-react';
import { CosmicButton } from './CosmicButton';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';

interface MeditationCardProps {
  title: string;
  description: string;
  duration: string;
  image: string;
  locked?: boolean;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  title,
  description,
  duration,
  image,
  locked = false
}) => {
  const { t } = useTranslations();

  const handlePlay = () => {
    if (locked) return;
    // Play meditation logic would go here
    console.log(`Playing meditation: ${title}`);
  };
  
  return (
    <Card className={`overflow-hidden border border-cosmic-accent/30 bg-cosmic-dark/40 backdrop-blur-sm ${locked ? 'relative' : ''}`}>
      <div className="bg-gradient-to-b from-cosmic-accent/10 to-cosmic-dark/30 p-3">
        <div className="relative h-32 rounded-md overflow-hidden mb-3">
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${image})` }}
          />
          {locked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <LockIcon size={32} className="text-cosmic-accent" />
            </div>
          )}
        </div>
        
        <CardContent className="p-0">
          <h3 className="text-lg font-serif text-white mb-1">{title}</h3>
          <p className="text-sm text-cosmic-secondary mb-2">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-cosmic-accent">{duration}</span>
            {!locked ? (
              <CosmicButton size="sm" onClick={handlePlay}>
                <PlayCircleIcon size={16} className="mr-1" />
                {t.meditation.play}
              </CosmicButton>
            ) : (
              <CosmicButton size="sm" variant="outline" onClick={() => window.location.href = '/comparison'}>
                {t.meditation.unlock}
              </CosmicButton>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
