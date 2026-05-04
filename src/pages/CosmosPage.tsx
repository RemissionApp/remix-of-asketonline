import React from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';
import { NumerologyDisplay } from '@/components/NumerologyDisplay';
import { AffirmationsBlock } from '@/components/MainPageComponents/AffirmationsBlock';
import { CosmicMissionsEntryPoint } from '@/components/MainPageComponents/CosmicMissionsEntryPoint';

const titles = {
  ru: 'Космос',
  en: 'Cosmos',
  es: 'Cosmos',
};

const CosmosPage: React.FC = () => {
  const { language } = useAppStore();
  const lang = (language as keyof typeof titles) ?? 'ru';

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-24">
        <StarField />
        <PageHeader title={titles[lang] ?? titles.ru} />
        <div className="flex-1 relative z-10 px-3 pt-20 sm:px-4 max-w-lg mx-auto w-full flex flex-col gap-3 sm:gap-4">
          <ZodiacBadgeDisplay />
          <NumerologyDisplay />
          <AffirmationsBlock />
          <CosmicMissionsEntryPoint />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default CosmosPage;
