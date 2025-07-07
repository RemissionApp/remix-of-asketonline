import React from 'react';
import { VoiceCallInterface } from '@/components/voice/VoiceCallInterface';
import { StarField } from '@/components/StarField';

const CallPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-purple-900/20 to-cosmic-dark relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <VoiceCallInterface />
      </div>
    </div>
  );
};

export default CallPage;