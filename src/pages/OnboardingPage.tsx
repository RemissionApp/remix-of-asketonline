import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Crown, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const OnboardingPage: React.FC = () => {
  const { user, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const totalSteps = 2;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const completeOnboarding = async () => {
    if (!user || saving) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_onboarding_state')
        .upsert(
          {
            user_id: user.id,
            current_step: 'complete',
            onboarding_step_completed: true,
            preferences_step_completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      // Sync local store so useAuthFlow re-routes to /main.
      // Also bump lastSyncedAt to block any racing loadOnboardingState() reads
      // from overwriting these flags within the cache TTL window.
      useAppStore.setState({
        onboardingStepCompleted: true,
        preferencesStepCompleted: true,
        currentStep: 'complete',
        completedAt: new Date(),
        lastSyncedAt: new Date(),
      });

      // Navigate directly — don't rely on ProtectedRoute reacting to store changes.
      navigate('/main', { replace: true });
    } catch (err: any) {
      console.error('Failed to complete onboarding', err);
      toast({
        title: (t as any).auth?.error || 'Error',
        description: err?.message || (t.onboarding as any).completeFailed || 'Failed to complete onboarding',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Function to split text by newlines and render paragraphs
  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) =>
      paragraph ? (
        <p key={index} className="text-xl text-cosmic-secondary mb-4">
          {paragraph}
        </p>
      ) : (
        <br key={index} />
      )
    );
  };

  const renderFeatureList = (features: string[]) => {
    return (
      <ul className="text-left mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start mb-3">
            <span className="text-cosmic-accent mr-2">✦</span>
            <span className="text-cosmic-secondary">{feature}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField starCount={150} />

      {/* Top bar: progress + skip */}
      <div className="absolute top-0 inset-x-0 z-20 px-6 pt-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-cosmic-secondary/70">
              {((t.onboarding as any).stepCounter || 'Step {{current}} of {{total}}')
                .replace('{{current}}', String(step + 1))
                .replace('{{total}}', String(totalSteps))}
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-cosmic-accent/15 overflow-hidden">
            <div
              className="h-full bg-cosmic-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={completeOnboarding}
          disabled={saving}
          className="text-cosmic-secondary/70 hover:text-cosmic-accent transition-colors text-sm whitespace-nowrap py-2 px-3 -mr-2 min-h-[44px]"
        >
          {t.onboarding.buttons.skip || 'Пропустить'}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-lg px-5 pt-24 pb-10">
        {step === 0 ? (
          <div className="animate-fade-in text-center">
            <div className="w-56 h-56 mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full bg-cosmic-accent/10 animate-pulse-slow"></div>
              <div
                className="absolute inset-4 rounded-full bg-cosmic-accent/20 animate-pulse-slow"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div
                className="absolute inset-8 rounded-full bg-cosmic-accent/30 animate-pulse-slow"
                style={{ animationDelay: '1s' }}
              ></div>
              <div
                className="absolute inset-12 rounded-full bg-cosmic-accent/40 animate-pulse-slow"
                style={{ animationDelay: '1.5s' }}
              ></div>
              <div className="absolute inset-16 rounded-full bg-cosmic-accent/50 animate-circle-expand"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif text-white mb-4 leading-tight">
              {t.onboarding.title}
            </h1>

            <p className="text-lg sm:text-xl text-cosmic-secondary mb-10 max-w-md mx-auto leading-relaxed">
              {t.onboarding.description}
            </p>

            <CosmicButton
              onClick={handleNext}
              disabled={saving}
              className="min-h-[52px] px-8 text-base"
            >
              {t.onboarding.buttons.enter || 'Войти'}
            </CosmicButton>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-cosmic-gold/40 mb-5 shadow-[0_0_24px_rgba(232,193,108,0.25)]">
                <Crown className="h-7 w-7 text-cosmic-gold" />
              </div>
              <div className="inline-block text-[11px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-cosmic-gold/15 border border-cosmic-gold/40 text-cosmic-gold mb-3">
                3 дня бесплатно
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-white mb-2">
                Asceta Pro
              </h1>
              <p className="text-sm text-cosmic-secondary/80">
                Полный доступ ко всем функциям. Без ограничений.
              </p>
            </div>

            <ul className="space-y-3 mb-10">
              {[
                '30 минут звонков с Лирой каждый месяц',
                'Полная нумерология: квадрат Пифагора и матрица кармы',
                'Персональные дневные, месячные и годовые гороскопы',
                'Безлимитные пакты аскезы',
                'Все космические миссии и достижения',
                'Аффирмации голосом Вселенной',
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-cosmic-dark/40 backdrop-blur-sm border border-cosmic-gold/15"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-cosmic-gold/20 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-cosmic-gold" />
                  </div>
                  <span className="text-cosmic-secondary leading-relaxed text-[15px]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-center mb-6 gap-2">
              {[0, 1].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => i <= step && setStep(i)}
                  aria-label={((t.onboarding as any).stepAriaLabel || 'Step {{n}}').replace('{{n}}', String(i + 1))}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step
                      ? 'w-8 bg-cosmic-accent'
                      : i < step
                      ? 'w-4 bg-cosmic-accent/60 hover:bg-cosmic-accent cursor-pointer'
                      : 'w-4 bg-cosmic-accent/25 cursor-default'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 min-h-[44px] rounded-lg text-cosmic-secondary hover:text-cosmic-accent transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.onboarding.buttons.back || 'Назад'}
              </button>
              <CosmicButton
                onClick={handleNext}
                disabled={saving}
                className="flex-1 min-h-[52px] text-base"
              >
                {saving
                  ? '...'
                  : t.onboarding.buttons.startJourney || 'Начать путь'}
              </CosmicButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
