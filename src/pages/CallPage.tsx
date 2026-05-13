import React from 'react';
import { ConversationProvider } from '@elevenlabs/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VoiceCallInterface } from '@/components/voice/VoiceCallInterface';
import { StarField } from '@/components/StarField';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { useTranslations } from '@/hooks/useTranslations';
import { useAmbientDrone } from '@/hooks/useAmbientDrone';

const CallPage: React.FC = () => {
  const { t } = useTranslations();
  const navigate = useNavigate();
  // Mystical cosmic drone while user is on the call screen
  useAmbientDrone(true);

  return (
    <MobileOptimizedInterface>
      <div className="fixed inset-0 flex flex-col bg-cosmic-dark overflow-hidden">
        <StarField />

        {/* Minimal header: back button + title only, no logo, no bottom nav */}
        <header
          className="relative z-20 flex items-center gap-3 px-4 pb-3"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
        >
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/8 border border-white/15 text-white active:bg-white/15 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-base font-serif text-white truncate">
            {t.lyra?.callScreen ?? "Lyra's Call"}
          </h1>
        </header>

        {/* Centered call interface */}
        <main
          className="flex-1 flex flex-col items-center justify-center relative z-10 px-4"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
        >
          <ConversationProvider>
            <VoiceCallInterface />
          </ConversationProvider>
        </main>
      </div>
    </MobileOptimizedInterface>
  );
};

export default CallPage;
