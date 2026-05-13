import React from 'react';
import { ConversationProvider } from '@elevenlabs/react';
import { VoiceCallInterface } from '@/components/voice/VoiceCallInterface';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslations } from '@/hooks/useTranslations';

const CallPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-20">
        <StarField />

        <PageHeader title={t.lyra?.callScreen ?? "Lyra's Call"} />

        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-20">
          <ConversationProvider>
            <VoiceCallInterface />
          </ConversationProvider>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default CallPage;
