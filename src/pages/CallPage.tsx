import React from 'react';
import { VoiceCallInterface } from '@/components/voice/VoiceCallInterface';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';

const CallPage: React.FC = () => {
  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        <StarField />
        
        {/* Top bar - Fixed with safe area */}
        <div className="fixed top-0 left-0 right-0 z-30 pt-safe-top">
          <TopBar />
        </div>
        
        {/* Main content - Adjusted for fixed headers */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-4 pt-20 pb-24">
          <VoiceCallInterface />
        </div>
        
        {/* Bottom navigation - Fixed with safe area */}
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default CallPage;