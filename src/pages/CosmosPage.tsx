import React from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';
import { NumerologyDisplay } from '@/components/NumerologyDisplay';
import { AffirmationsBlock } from '@/components/MainPageComponents/AffirmationsBlock';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';

const titles = {
  ru: 'Космос',
  en: 'Cosmos',
  es: 'Cosmos',
};

const ZodiacAstroMini: React.FC<{ lang: 'ru' | 'en' | 'es' }> = ({ lang }) => {
  const { userProfile } = useAppStore();
  const birth = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  const sign = birth ? getZodiacSign(birth) : null;
  if (!sign) return null;
  const d = zodiacData[sign];
  const label = { ru: 'Твой знак', en: 'Your sign', es: 'Tu signo' }[lang];
  return (
    <div className="glass-gold glass-shine relative rounded-2xl p-4 overflow-hidden">
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-15 select-none">{d.symbol}</div>
      <div className="relative z-10">
        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{label}</div>
        <div className="text-xl font-semibold text-white">{d.symbol} {d.name[lang]}</div>
        <div className="text-xs text-white/55 mt-1">{d.element} · {d.ruler}</div>
      </div>
    </div>
  );
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
          <ZodiacAstroMini lang={lang} />
          <ZodiacBadgeDisplay />
          <NumerologyDisplay />
          <AffirmationsBlock />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default CosmosPage;
