import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { UserAvatar } from '@/components/UserAvatar';
import { PageHeader } from '@/components/ui/PageHeader';
import { DestinyMatrix } from '@/components/DestinyMatrix';
import FullDestinyMatrix from '@/components/FullDestinyMatrix';
import { Grid, Sparkles, Star } from 'lucide-react';
import { calculateLifePathNumber, calculateExpressionNumber, calculatePersonalityNumber, getNumerologyMeaning, calculateFullDestinyMatrix } from '@/utils/numerologyUtils';
import { MatrixDescription } from '@/components/MatrixDescription';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';

const NumerologyPage = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'matrix' | 'detailed' | 'full'>('full');

  const getNumerologyData = () => {
    if (!userProfile?.birthDate) {
      return {
        lifePathNumber: 0,
        destinyNumber: 0,
        soulUrgeNumber: 0,
        personalityNumber: 0,
        expressionNumber: 0,
        birthDayNumber: 0,
        attitude: 0,
        balanceNumber: 0,
        challenges: [0, 0, 0],
        periods: [],
      };
    }

    const birthDate = String(userProfile.birthDate);
    const name = userProfile.name || '';
    
    // Calculate real numerology data
    const lifePathNumber = calculateLifePathNumber(birthDate);
    const expressionNumber = calculateExpressionNumber(name);
    const personalityNumber = calculatePersonalityNumber(name);
    
    const date = new Date(birthDate);
    const birthDay = date.getDate();
    const birthMonth = date.getMonth() + 1;
    const birthYear = date.getFullYear();
    
    // Calculate additional numbers
    const reduceToSingleDigit = (num: number): number => {
      if (num === 11 || num === 22 || num === 33) return num;
      while (num > 9) {
        let sum = 0;
        while (num > 0) {
          sum += num % 10;
          num = Math.floor(num / 10);
        }
        num = sum;
      }
      return num;
    };

    const destinyNumber = reduceToSingleDigit(birthDay + birthMonth + birthYear);
    const soulUrgeNumber = reduceToSingleDigit(lifePathNumber + expressionNumber);
    const attitude = reduceToSingleDigit(birthDay + birthMonth);
    const balanceNumber = reduceToSingleDigit(lifePathNumber + destinyNumber);
    
    // Calculate life periods
    const firstPeriod = reduceToSingleDigit(birthMonth);
    const secondPeriod = reduceToSingleDigit(birthDay);
    const thirdPeriod = reduceToSingleDigit(birthYear);
    
    return {
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber,
      expressionNumber,
      birthDayNumber: reduceToSingleDigit(birthDay),
      attitude,
      balanceNumber,
      challenges: [
        Math.abs(lifePathNumber - destinyNumber) || 1,
        Math.abs(firstPeriod - secondPeriod) || 1,
        Math.abs(firstPeriod - thirdPeriod) || 1
      ],
      periods: [
        { number: firstPeriod, ageRange: '0-28' },
        { number: secondPeriod, ageRange: '29-56' },
        { number: thirdPeriod, ageRange: '57+' },
      ],
    };
  };

  const tr = (ru: string, en: string, es: string) =>
    language === 'ru' ? ru : language === 'es' ? es : en;

  const renderNumerologyDefinition = (
    title: string,
    number: number,
    description: string
  ) => (
    <div className="mb-3 rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-cosmic-gold font-serif text-base">{title}</h3>
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-white/10 shadow-[0_0_18px_rgba(232,193,108,0.25)] flex items-center justify-center font-serif text-lg text-white">
          {number}
        </div>
      </div>
      <p className="text-cosmic-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );

  const handleBack = () => {
    navigate('/main');
  };

  const numerologyData = getNumerologyData();

  const segmentBtn = (active: boolean) =>
    cn(
      'flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all',
      active
        ? 'bg-gradient-to-r from-cosmic-gold/40 to-cosmic-accent/40 text-white shadow-[0_0_14px_rgba(232,193,108,0.25)]'
        : 'text-cosmic-secondary hover:text-white'
    );

  const numerologyContent = (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-24">
        <StarField starCount={80} />
        <PageHeader title={t.numerology.title} />

        <div className="flex-1 relative z-10 px-3 sm:px-4 pt-20 max-w-lg mx-auto w-full flex flex-col gap-4">
          {/* Hero — User card */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-accent/15 via-cosmic-dark/60 to-cosmic-gold/10 backdrop-blur-md p-5 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cosmic-gold/30 bg-cosmic-gold/10 px-3 py-1 text-[10px] uppercase tracking-wider text-cosmic-gold">
              <Sparkles size={12} />
              {tr('Числовой портрет', 'Numerical portrait', 'Retrato numérico')}
            </span>
            <h2 className="mt-3 text-xl font-serif text-white cosmic-gradient-text">
              {userProfile?.name || tr('Гость', 'Guest', 'Invitado')}
            </h2>
            <p className="text-cosmic-secondary text-sm mt-1">
              {userProfile?.birthDate
                ? new Date(userProfile?.birthDate).toLocaleDateString()
                : t.numerology.enterBirthDateInProfile}
            </p>
          </div>

          {/* Core numbers */}
          {userProfile?.birthDate && (
            <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: numerologyData.lifePathNumber, label: tr('Путь жизни', 'Life Path', 'Sendero de vida') },
                  { n: numerologyData.expressionNumber, label: tr('Выражение', 'Expression', 'Expresión') },
                  { n: numerologyData.personalityNumber, label: tr('Личность', 'Personality', 'Personalidad') },
                ].map((it, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-white/10 shadow-[0_0_20px_rgba(232,193,108,0.25)] flex items-center justify-center mb-2 font-serif text-xl text-white">
                      {it.n}
                    </div>
                    <p className="text-cosmic-secondary text-[11px] text-center leading-tight">{it.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="rounded-full bg-cosmic-dark/60 backdrop-blur-md border border-cosmic-accent/20 p-1 flex gap-1">
            <button onClick={() => setViewMode('full')} className={segmentBtn(viewMode === 'full')}>
              <Star className="w-3.5 h-3.5" />
              {t.numerology.viewModes.full}
            </button>
            <button onClick={() => setViewMode('matrix')} className={segmentBtn(viewMode === 'matrix')}>
              <Sparkles className="w-3.5 h-3.5" />
              {t.numerology.viewModes.simple}
            </button>
            <button onClick={() => setViewMode('detailed')} className={segmentBtn(viewMode === 'detailed')}>
              <Grid className="w-3.5 h-3.5" />
              {t.numerology.viewModes.data}
            </button>
          </div>

        {/* Destiny Matrix Views */}
        {viewMode === 'matrix' && userProfile?.birthDate && (
          <DestinyMatrix 
            birthDate={String(userProfile.birthDate)} 
            name={userProfile.name || ''} 
            language={language}
          />
        )}

        {/* Full Destiny Matrix View */}
        {viewMode === 'full' && userProfile?.birthDate && (
          <>
            <FullDestinyMatrix 
              birthDate={String(userProfile.birthDate)} 
              name={userProfile.name || ''} 
              language={language}
            />
            <MatrixDescription
              matrixData={calculateFullDestinyMatrix(String(userProfile.birthDate), userProfile.name || '')}
              birthDate={String(userProfile.birthDate)}
              name={userProfile.name || ''}
              language={language}
            />
          </>
        )}

        {/* Detailed View */}
        {viewMode === 'detailed' && (
          <>
            <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: numerologyData.lifePathNumber, label: t.numerology.numbers.lifePath },
                  { n: numerologyData.destinyNumber, label: t.numerology.numbers.destiny },
                  { n: numerologyData.soulUrgeNumber, label: t.numerology.numbers.soul },
                  { n: numerologyData.personalityNumber, label: t.numerology.numbers.personality },
                ].map((it, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-white/10 shadow-[0_0_20px_rgba(232,193,108,0.25)] flex items-center justify-center mb-2 font-serif text-2xl text-white">
                      {it.n}
                    </div>
                    <p className="text-cosmic-secondary text-xs text-center">{it.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {renderNumerologyDefinition(t.numerology.numbers.lifePath, numerologyData.lifePathNumber, t.numerology.descriptions.lifePath)}
            {renderNumerologyDefinition(t.numerology.numbers.destiny, numerologyData.destinyNumber, t.numerology.descriptions.destiny)}
            {renderNumerologyDefinition(t.numerology.numbers.soul, numerologyData.soulUrgeNumber, t.numerology.descriptions.soul)}
            {renderNumerologyDefinition(t.numerology.numbers.personality, numerologyData.personalityNumber, t.numerology.descriptions.personality)}
            {renderNumerologyDefinition(t.numerology.numbers.expression, numerologyData.expressionNumber, t.numerology.descriptions.expression)}

            <h3 className="text-cosmic-gold font-serif mt-6 mb-3 text-base">
              {t.numerology.lifePeriods.title}
            </h3>

            <div className="space-y-3 mb-4">
              {numerologyData.periods.map((period, index) => {
                const periodLabels = [
                  t.numerology.lifePeriods.forming,
                  t.numerology.lifePeriods.productive,
                  t.numerology.lifePeriods.wisdom,
                ];
                const yearsLabel = tr('лет', 'years', 'años');
                return (
                  <div key={index} className="flex items-center rounded-2xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-white/10 shadow-[0_0_18px_rgba(232,193,108,0.2)] flex items-center justify-center mr-4 font-serif text-xl text-white">
                      {period.number}
                    </div>
                    <div>
                      <p className="text-white text-sm">{period.ageRange} {yearsLabel}</p>
                      <p className="text-cosmic-secondary text-xs">{periodLabels[index]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );

  return numerologyContent;
};

export default NumerologyPage;
