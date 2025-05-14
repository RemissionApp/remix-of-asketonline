
import React from 'react';
import { LockIcon, PlayCircleIcon, SparklesIcon } from 'lucide-react';
import { CosmicButton } from './CosmicButton';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useUserSubscription } from '@/hooks/useUserSubscription';

interface MeditationCardProps {
  title: string;
  description: string;
  duration: string;
  image: string;
  locked?: boolean;
  requiresPro?: boolean;
  onPlay?: () => void;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  title,
  description,
  duration,
  image,
  locked = false,
  requiresPro = true,
  onPlay
}) => {
  const { t } = useTranslations();
  const { userProfile } = useAppStore();
  const { upgradeToPro } = useUserSubscription();
  const navigate = useNavigate();
  const isPro = userProfile.isPro;

  const handlePlay = () => {
    if (locked) return;
    if (requiresPro && !isPro) {
      navigate('/comparison');
      return;
    }
    if (onPlay) {
      onPlay();
    } else {
      // Default play action
      console.log(`Playing meditation: ${title}`);
    }
  };
  
  const handleUpgrade = () => {
    // For demo purposes, immediately upgrade the user
    upgradeToPro();
    navigate('/comparison');
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
          {requiresPro && !isPro && !locked && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 bg-black/60 text-cosmic-gold px-2 py-1 rounded-full text-xs">
                <SparklesIcon size={12} />
                <span>PRO</span>
              </div>
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
              <CosmicButton size="sm" variant="outline" onClick={handleUpgrade}>
                <SparklesIcon size={14} className="mr-1" />
                {t.meditation.unlock}
              </CosmicButton>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
