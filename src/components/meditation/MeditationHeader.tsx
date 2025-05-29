
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MeditationSession {
  id: string;
  title: string;
  category: string;
  curator: string;
  avatar: string;
  moonPhase: string;
  level: string;
}

interface MeditationHeaderProps {
  sessions: MeditationSession[];
  currentIndex: number;
  onSessionChange: (index: number) => void;
}

export const MeditationHeader: React.FC<MeditationHeaderProps> = ({
  sessions,
  currentIndex,
  onSessionChange
}) => {
  const currentSession = sessions[currentIndex];

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : sessions.length - 1;
    onSessionChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < sessions.length - 1 ? currentIndex + 1 : 0;
    onSessionChange(newIndex);
  };

  return (
    <div className="bg-cosmic-dark/80 backdrop-blur-md border-b border-cosmic-accent/20 px-4 py-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="text-cosmic-accent hover:bg-cosmic-accent/20"
        >
          <ChevronLeft size={20} />
        </Button>
        
        <div className="flex-1 text-center">
          <h1 className="text-xl font-serif text-white mb-1">
            {currentSession.title}
          </h1>
          <p className="text-cosmic-secondary text-sm mb-2">
            {currentSession.category}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-cosmic-accent/20 flex items-center justify-center">
              <User size={16} className="text-cosmic-accent" />
            </div>
            <span className="text-cosmic-accent text-sm">{currentSession.curator}</span>
          </div>
          
          <div className="text-cosmic-gold text-xs">
            {currentSession.moonPhase} • {currentSession.level}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="text-cosmic-accent hover:bg-cosmic-accent/20"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};
