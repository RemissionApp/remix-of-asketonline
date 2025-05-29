
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const { userProfile } = useAppStore();
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
    <div className="bg-cosmic-dark/80 backdrop-blur-md border-b border-cosmic-accent/20">
      {/* User Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-cosmic-accent/10">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userProfile.avatar_url || ''} />
            <AvatarFallback className="bg-cosmic-accent/20 text-cosmic-accent text-sm">
              {userProfile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="text-white text-sm font-medium">{userProfile.name}</span>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-cosmic-gold" />
              <span className="text-cosmic-gold text-xs">{userProfile.energyPoints} энергии</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-cosmic-accent/20 px-2 py-1 rounded-full">
            <span className="text-cosmic-accent text-xs capitalize">{userProfile.rank}</span>
          </div>
        </div>
      </div>

      {/* Session Navigation */}
      <div className="flex items-center justify-between px-4 py-3">
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
