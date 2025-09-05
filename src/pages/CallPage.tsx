import React from 'react';
import { VoiceCallInterface } from '@/components/voice/VoiceCallInterface';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { useDailyLimits } from '@/hooks/useDailyLimits';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { LimitIndicator } from '@/components/ui/LimitIndicator';

const CallPage: React.FC = () => {
  const { language } = useAppStore();
  const { limits } = useDailyLimits();

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-20">
        <StarField />

        <PageHeader
          title={
            language === 'ru'
              ? 'Звонок Вселенной'
              : language === 'es'
                ? 'Llamada al Universo'
                : 'Universe Call'
          }
        />

        {/* Main content - Adjusted for fixed headers */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-20 space-y-6">
          {/* Show limit indicator */}
          {limits && (
            <div className="w-full max-w-md">
              <LimitIndicator
                used={limits.voice_calls.used}
                limit={limits.voice_calls.limit}
                label={
                  language === 'ru' ? 'Голосовые звонки сегодня' :
                  language === 'es' ? 'Llamadas de voz hoy' :
                  'Voice Calls Today'
                }
                isPro={limits.isPro}
              />
            </div>
          )}

          {/* Show upgrade prompt if limit reached */}
          {limits && !limits.voice_calls.canUse ? (
            <UpgradePrompt 
              feature={
                language === 'ru' ? 'голосовых звонков' :
                language === 'es' ? 'llamadas de voz' :
                'voice calls'
              }
              currentUsage={`${limits.voice_calls.used}/${limits.voice_calls.limit}`}
            />
          ) : (
            <VoiceCallInterface />
          )}
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
