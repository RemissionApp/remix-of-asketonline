import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    setOnboardingComplete,
    setActiveScreen,
    user,
    checkOnboardingStatus,
  } = useAppStore();
  const { t } = useTranslations();
  const [step, setStep] = useState(0);

  // Check if user has already completed onboarding
  useEffect(() => {
    const isOnboardingComplete = checkOnboardingStatus();

    if (isOnboardingComplete) {
      console.log('Onboarding previously completed, redirecting to main');
      navigate('/main');
    }
  }, [checkOnboardingStatus, navigate]);

  const handleNext = () => {
    if (step < 2) {
      // Just use a hardcoded number for steps (0, 1, 2)
      setStep(step + 1);
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const completeOnboarding = () => {
    console.log('Completing onboarding');

    // Set onboarding complete and navigate to main screen
    setOnboardingComplete(true);
    setActiveScreen('main');

    // Navigate to main page (remove localStorage usage)
    navigate('/main');
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

      {/* Skip link */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={completeOnboarding}
          className="text-cosmic-secondary/70 hover:text-cosmic-accent transition-colors text-sm"
        >
          {t.onboarding.buttons.skip || 'Пропустить'}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-lg px-4">
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

            <h1 className="text-4xl font-serif text-white mb-6">
              {t.onboarding.title}
            </h1>

            <div className="mb-8">
              <p className="text-xl text-cosmic-secondary mb-4">
                {t.onboarding.description}
              </p>
            </div>

            <CosmicButton onClick={handleNext}>
              {t.onboarding.buttons.enter || 'Войти'}
            </CosmicButton>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <h1 className="text-3xl font-serif text-white mb-6">
              {step === 1
                ? t.onboarding.steps.features
                : t.onboarding.steps.proFeatures}
            </h1>

            <div className="mb-6">
              {step === 1
                ? renderFeatureList(t.onboarding.freeFeatures)
                : renderFeatureList(t.onboarding.proFeatures)}
            </div>

            <div className="flex justify-center mb-8">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => i <= step && setStep(i)}
                  aria-label={`Шаг ${i + 1}`}
                  className={`w-3 h-3 mx-1 rounded-full transition-colors ${
                    i === step
                      ? 'bg-cosmic-accent'
                      : i < step
                      ? 'bg-cosmic-accent/60 hover:bg-cosmic-accent cursor-pointer'
                      : 'bg-cosmic-accent/30 cursor-default'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 px-4 py-2 rounded-md text-cosmic-secondary hover:text-cosmic-accent transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.onboarding.buttons.back || 'Назад'}
              </button>
              <CosmicButton onClick={handleNext}>
                {step < 2
                  ? t.onboarding.buttons.next
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
