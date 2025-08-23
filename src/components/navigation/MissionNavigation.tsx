import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, Gem, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export const MissionNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useAppStore();

  const getText = (key: 'missions' | 'artifacts' | 'back') => {
    const texts = {
      ru: {
        missions: 'Миссии',
        artifacts: 'Артефакты',
        back: 'Назад'
      },
      es: {
        missions: 'Misiones',
        artifacts: 'Artefactos',
        back: 'Atrás'
      },
      en: {
        missions: 'Missions',
        artifacts: 'Artifacts', 
        back: 'Back'
      }
    };
    return texts[language][key];
  };

  const isOnMissions = location.pathname === '/cosmic-missions';
  const isOnArtifacts = location.pathname === '/artifacts';

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/main')}
        className="text-cosmic-silver hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {getText('back')}
      </Button>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant={isOnMissions ? 'default' : 'outline'}
          size="sm"
          onClick={() => navigate('/cosmic-missions')}
          className={cn(
            'transition-all duration-200',
            isOnMissions 
              ? 'bg-cosmic-accent hover:bg-cosmic-accent/90 text-white' 
              : 'bg-cosmic-dark/60 border-cosmic-accent/30 text-cosmic-silver hover:text-white hover:bg-cosmic-accent/20'
          )}
        >
          <Star className="w-4 h-4 mr-2" />
          {getText('missions')}
        </Button>

        <Button
          variant={isOnArtifacts ? 'default' : 'outline'}
          size="sm"
          onClick={() => navigate('/artifacts')}
          className={cn(
            'transition-all duration-200',
            isOnArtifacts 
              ? 'bg-cosmic-accent hover:bg-cosmic-accent/90 text-white' 
              : 'bg-cosmic-dark/60 border-cosmic-accent/30 text-cosmic-silver hover:text-white hover:bg-cosmic-accent/20'
          )}
        >
          <Gem className="w-4 h-4 mr-2" />
          {getText('artifacts')}
        </Button>
      </div>
    </div>
  );
};