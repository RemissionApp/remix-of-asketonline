
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const { setOnboardingComplete, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  
  const handleNext = () => {
    if (step < t.onboarding.steps.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };
  
  const completeOnboarding = () => {
    // Set onboarding complete and navigate to main screen
    setOnboardingComplete(true);
    setActiveScreen('main');
  };
  
  // Function to split text by newlines and render paragraphs
  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph ? <p key={index} className="text-xl text-cosmic-secondary mb-4">{paragraph}</p> : <br key={index} />
    ));
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
          {t.onboarding.buttons.skip || "Пропустить"}
        </button>
      </div>
      
      <div className="relative z-10 w-full max-w-lg px-4">
        {step === 0 ? (
          <div className="animate-fade-in text-center">
            <div className="w-56 h-56 mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full bg-cosmic-accent/10 animate-pulse-slow"></div>
              <div className="absolute inset-4 rounded-full bg-cosmic-accent/20 animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 rounded-full bg-cosmic-accent/30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-12 rounded-full bg-cosmic-accent/40 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute inset-16 rounded-full bg-cosmic-accent/50 animate-circle-expand"></div>
            </div>
            
            <h1 className="text-4xl font-serif text-white mb-6">
              {t.onboarding.steps[0].title}
            </h1>
            
            <div className="mb-8">
              {renderContent(t.onboarding.steps[0].content)}
            </div>
            
            <CosmicButton onClick={handleNext}>
              {t.onboarding.buttons.enter}
            </CosmicButton>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <h1 className="text-3xl font-serif text-white mb-6">
              {t.onboarding.steps[step].title}
            </h1>
            
            <div className="mb-8">
              {renderContent(t.onboarding.steps[step].content)}
            </div>
            
            <div className="flex justify-center mb-8">
              {t.onboarding.steps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 mx-1 rounded-full ${i === step ? 'bg-cosmic-accent' : 'bg-cosmic-accent/30'}`}
                />
              ))}
            </div>
            
            <CosmicButton onClick={handleNext}>
              {step < t.onboarding.steps.length - 1 ? t.onboarding.buttons.next : t.onboarding.buttons.startJourney}
            </CosmicButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
