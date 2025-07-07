import React from 'react';
import { VoiceCallInterface } from '@/components/voice/VoiceCallInterface';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';

const CallPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField />
      
      {/* Полупрозрачный фон */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/40 to-cosmic-dark/60" />
      </div>
      
      {/* Top bar */}
      <TopBar />
      
      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center relative z-10">
        <VoiceCallInterface />
      </div>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default CallPage;