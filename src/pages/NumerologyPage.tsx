import React, { useMemo, useState } from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { PageHeader } from '@/components/ui/PageHeader';
import { Sparkles } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';
import { buildProfile } from '@/utils/numerology/calculations';
import {
  PLANET_SYMBOLS,
  TAROT_ARCANA,
} from '@/utils/numerology/astroLinks';
import { pickI18n } from '@/utils/numerology/interpretations';
import type { Lang } from '@/utils/numerology/interpretations';
import { PythagoreanSquareSVG } from '@/components/numerology/PythagoreanSquareSVG';
import { KarmaMatrixSVG } from '@/components/numerology/KarmaMatrixSVG';
import { NumberCard } from '@/components/numerology/NumberCard';
import { NumberDetailAccordion } from '@/components/numerology/NumberDetailAccordion';
import { SquareAnalysisAccordion } from '@/components/numerology/SquareAnalysisAccordion';
import { KarmaPositionCard } from '@/components/numerology/KarmaPositionCard';

type System = 'pythagorean' | 'chaldean';
type Tab = 'numbers' | 'square' | 'karma';

const NumerologyPage: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const lang = (language as Lang) ?? 'en';
  const v2 = t.numerology.v2!;

  const [system, setSystem] = useState<System>('pythagorean');
  const [tab, setTab] = useState<Tab>('numbers');

  const profile = useMemo(() => {
    if (!userProfile?.birthDate) return null;
    return buildProfile(String(userProfile.birthDate), userProfile.name || '');
  }, [userProfile?.birthDate, userProfile?.name]);

  const segmentBtn = (active: boolean) =>
    cn(
      'flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all',
      active
        ? 'bg-gradient-to-r from-cosmic-gold/40 to-cosmic-accent/40 text-foreground shadow-[0_0_14px_hsl(var(--cosmic-gold)/0.25)]'
        : 'text-cosmic-secondary hover:text-foreground'
    );

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-page">
        <StarField starCount={80} />
        <PageHeader title={t.numerology.title} />

        <div className="flex-1 relative z-10 px-3 sm:px-4 pt-page max-w-lg mx-auto w-full flex flex-col gap-4">
          {/* Hero */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-accent/15 via-cosmic-dark/60 to-cosmic-gold/10 backdrop-blur-md p-5 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cosmic-gold/30 bg-cosmic-gold/10 px-3 py-1 text-[10px] uppercase tracking-wider text-cosmic-gold">
              <Sparkles size={12} />
              {t.numerology.title}
            </span>
            <h2 className="mt-3 text-xl font-serif text-foreground cosmic-gradient-text">
              {userProfile?.name || '—'}
            </h2>
            <p className="text-cosmic-secondary text-sm mt-1">
              {userProfile?.birthDate
                ? new Date(String(userProfile.birthDate)).toLocaleDateString()
                : t.numerology.enterBirthDateInProfile}
            </p>
          </div>

          {!profile && (
            <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 p-5 text-center text-cosmic-secondary text-sm">
              {t.numerology.enterBirthDateInProfile}
            </div>
          )}

          {profile && (
            <>
              {/* System switcher */}
              <div className="rounded-full bg-cosmic-dark/60 backdrop-blur-md border border-cosmic-accent/20 p-1 flex gap-1">
                <button onClick={() => setSystem('pythagorean')} className={segmentBtn(system === 'pythagorean')}>
                  {v2.systems.pythagorean}
                </button>
                <button onClick={() => setSystem('chaldean')} className={segmentBtn(system === 'chaldean')}>
                  {v2.systems.chaldean}
                </button>
              </div>

              {/* Tabs */}
              <div className="rounded-full bg-cosmic-dark/60 backdrop-blur-md border border-cosmic-accent/20 p-1 flex gap-1">
                <button onClick={() => setTab('numbers')} className={segmentBtn(tab === 'numbers')}>
                  {v2.coreNumbers}
                </button>
                <button onClick={() => setTab('square')} className={segmentBtn(tab === 'square')}>
                  {v2.square.title}
                </button>
                <button onClick={() => setTab('karma')} className={segmentBtn(tab === 'karma')}>
                  {v2.karma.title}
                </button>
              </div>

              {/* NUMBERS */}
              {tab === 'numbers' && system === 'pythagorean' && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
                    <div className="grid grid-cols-4 gap-2">
                      <NumberCard label={v2.numbers.lifePath} value={profile.pythagorean.lifePath} size="md" />
                      <NumberCard label={v2.numbers.expression} value={profile.pythagorean.expression} size="md" />
                      <NumberCard label={v2.numbers.soul} value={profile.pythagorean.soul} size="md" />
                      <NumberCard label={v2.numbers.personality} value={profile.pythagorean.personality} size="md" />
                      <NumberCard label={v2.numbers.maturity} value={profile.pythagorean.maturity} size="sm" />
                      <NumberCard label={v2.numbers.balance} value={profile.pythagorean.balance} size="sm" />
                      <NumberCard label={v2.numbers.personalYear} value={profile.pythagorean.personalYear} size="sm" />
                      <NumberCard label="Birthday" value={profile.pythagorean.birthday} size="sm" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4 space-y-2">
                    <NumberDetailAccordion number={profile.pythagorean.lifePath} context="lifePath" label={v2.numbers.lifePath} />
                    <NumberDetailAccordion number={profile.pythagorean.soul} context="soul" label={v2.numbers.soul} />
                    <NumberDetailAccordion number={profile.pythagorean.personality} context="personality" label={v2.numbers.personality} />
                    <NumberDetailAccordion number={profile.pythagorean.expression} context="expression" label={v2.numbers.expression} />
                  </div>
                </div>
              )}

              {tab === 'numbers' && system === 'chaldean' && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <NumberCard
                        label={`${v2.numbers.chaldeanLife} (${profile.chaldean.lifePath.compound})`}
                        value={profile.chaldean.lifePath.single}
                        size="lg"
                      />
                      <NumberCard
                        label={`${v2.numbers.chaldeanName} (${profile.chaldean.name.compound})`}
                        value={profile.chaldean.name.single}
                        size="lg"
                      />
                    </div>
                    {!userProfile?.name && (
                      <p className="text-cosmic-secondary text-xs text-center mt-3">
                        {v2.enterName}
                      </p>
                    )}
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4 space-y-2">
                    <NumberDetailAccordion number={profile.chaldean.lifePath.single} context="chaldean" label={v2.numbers.chaldeanLife} />
                    {profile.chaldean.name.single > 0 && (
                      <NumberDetailAccordion number={profile.chaldean.name.single} context="chaldean" label={v2.numbers.chaldeanName} />
                    )}
                  </div>
                </div>
              )}

              {/* SQUARE */}
              {tab === 'square' && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
                    <p className="text-cosmic-secondary text-sm text-center mb-3">{v2.square.intro}</p>
                    <PythagoreanSquareSVG square={profile.square} cellLabels={v2.square.cells as Record<string, string>} />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
                    <h3 className="text-cosmic-gold text-xs uppercase tracking-wider mb-3">
                      {v2.square.analysis}
                    </h3>
                    <SquareAnalysisAccordion square={profile.square} />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <KarmaPositionCard label={v2.square.working.A} value={profile.square.workingNumbers.A} />
                      <KarmaPositionCard label={v2.square.working.B} value={profile.square.workingNumbers.B} />
                      <KarmaPositionCard label={v2.square.working.C} value={profile.square.workingNumbers.C} />
                      <KarmaPositionCard label={v2.square.working.D} value={profile.square.workingNumbers.D} />
                    </div>
                  </div>
                </div>
              )}

              {/* KARMA */}
              {tab === 'karma' && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
                    <KarmaMatrixSVG
                      karma={profile.karma}
                      labels={{
                        center: v2.karma.center,
                        sky: v2.karma.sky,
                        earth: v2.karma.earth,
                        planets: v2.karma.planets,
                      }}
                    />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4 space-y-2">
                    <KarmaPositionCard
                      label={v2.karma.center}
                      value={profile.karma.center}
                      hint={pickI18n(TAROT_ARCANA[profile.karma.center]?.name ?? { ru: '', en: '', es: '' }, lang)}
                    />
                    <KarmaPositionCard
                      label={v2.karma.sky}
                      value={profile.karma.sky}
                      hint={pickI18n(TAROT_ARCANA[profile.karma.sky]?.name ?? { ru: '', en: '', es: '' }, lang)}
                    />
                    <KarmaPositionCard
                      label={v2.karma.earth}
                      value={profile.karma.earth}
                      hint={pickI18n(TAROT_ARCANA[profile.karma.earth]?.name ?? { ru: '', en: '', es: '' }, lang)}
                    />
                    <KarmaPositionCard
                      label={v2.karma.missions.social}
                      value={profile.karma.socialMission}
                    />
                    <KarmaPositionCard
                      label={v2.karma.missions.spiritual}
                      value={profile.karma.personalMission}
                    />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
                    <h3 className="text-cosmic-gold text-xs uppercase tracking-wider mb-3">
                      {v2.karma.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(profile.karma.planets) as Array<keyof typeof profile.karma.planets>).map((p) => (
                        <KarmaPositionCard
                          key={p}
                          label={v2.karma.planets[p]}
                          value={profile.karma.planets[p]}
                          symbol={PLANET_SYMBOLS[p]}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default NumerologyPage;
