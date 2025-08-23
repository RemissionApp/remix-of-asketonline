import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, Gem, ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { CompactUserProgress } from './CompactUserProgress';

export const MissionNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useAppStore();

  const getText = (key: 'missions' | 'artifacts' | 'achievements' | 'back') => {
    const texts = {
      ru: {
        missions: 'Миссии',
        artifacts: 'Артефакты',
        achievements: 'Достижения',
        back: 'Назад'
      },
      es: {
        missions: 'Misiones',
        artifacts: 'Artefactos',
        achievements: 'Logros',
        back: 'Atrás'
      },
      en: {
        missions: 'Missions',
        artifacts: 'Artifacts',
        achievements: 'Achievements',
        back: 'Back'
      }
    };
    return texts[language][key];
  };

  const isOnMissions = location.pathname === '/cosmic-missions';
  const isOnArtifacts = location.pathname === '/artifacts';
  const isOnAchievements = location.pathname === '/achievements';

  return (
    <div className="space-y-4 mb-6">
      {/* Top row with back button and user progress */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/main')}
          className="text-cosmic-silver hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {getText('back')}
        </Button>

        <CompactUserProgress className="hidden sm:flex" />
      </div>

      {/* Compact user progress for mobile */}
      <div className="sm:hidden">
        <CompactUserProgress />
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2 justify-center">
        <Button
          variant={isOnMissions ? 'default' : 'outline'}
          size="sm"
          onClick={() => navigate('/cosmic-missions')}
          className={cn(
            'transition-all duration-300 hover-scale',
            isOnMissions 
              ? 'bg-gradient-to-r from-cosmic-accent to-cosmic-accent2 hover:from-cosmic-accent/90 hover:to-cosmic-accent2/90 text-white shadow-lg shadow-cosmic-accent/20' 
              : 'bg-cosmic-dark/60 border-cosmic-accent/30 text-cosmic-silver hover:text-white hover:bg-cosmic-accent/20 hover:border-cosmic-accent/60'
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
            'transition-all duration-300 hover-scale',
            isOnArtifacts 
              ? 'bg-gradient-to-r from-cosmic-accent to-cosmic-accent2 hover:from-cosmic-accent/90 hover:to-cosmic-accent2/90 text-white shadow-lg shadow-cosmic-accent/20' 
              : 'bg-cosmic-dark/60 border-cosmic-accent/30 text-cosmic-silver hover:text-white hover:bg-cosmic-accent/20 hover:border-cosmic-accent/60'
          )}
        >
          <Gem className="w-4 h-4 mr-2" />
          {getText('artifacts')}
        </Button>

        <Button
          variant={isOnAchievements ? 'default' : 'outline'}
          size="sm"
          onClick={() => navigate('/achievements')}
          className={cn(
            'transition-all duration-300 hover-scale',
            isOnAchievements 
              ? 'bg-gradient-to-r from-cosmic-gold to-cosmic-indigo hover:from-cosmic-gold/90 hover:to-cosmic-indigo/90 text-white shadow-lg shadow-cosmic-gold/20' 
              : 'bg-cosmic-dark/60 border-cosmic-gold/30 text-cosmic-secondary hover:text-cosmic-gold hover:bg-cosmic-gold/20 hover:border-cosmic-gold/60'
          )}
        >
          <Trophy className="w-4 h-4 mr-2" />
          {getText('achievements')}
        </Button>
      </div>
    </div>
  );
};