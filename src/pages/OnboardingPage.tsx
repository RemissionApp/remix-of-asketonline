
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const { setOnboardingComplete, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  
  // Create steps array from structure
  const steps = [
    {
      title: t.onboarding?.steps?.[0]?.title || t.onboarding?.step1?.title,
      content: t.onboarding?.steps?.[0]?.content || t.onboarding?.step1?.description
    },
    {
      title: t.onboarding?.steps?.[1]?.title || t.onboarding?.step2?.title,
      content: t.onboarding?.steps?.[1]?.content || t.onboarding?.step2?.description
    },
    {
      title: t.onboarding?.steps?.[2]?.title || t.onboarding?.step3?.title,
      content: t.onboarding?.steps?.[2]?.content || t.onboarding?.step3?.description
    }
  ];
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      setOnboardingComplete(true);
      setActiveScreen('main');
    }
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
              {t.onboarding.title}
            </h1>
            
            <div className="mb-8">
              {renderContent(steps[0].content)}
            </div>
            
            <CosmicButton onClick={handleNext}>
              {t.onboarding?.buttons?.enter || t.onboarding?.startButton}
            </CosmicButton>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <h1 className="text-3xl font-serif text-white mb-6">
              {steps[step].title}
            </h1>
            
            <div className="mb-8">
              {renderContent(steps[step].content)}
            </div>
            
            <div className="flex justify-center mb-8">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 mx-1 rounded-full ${i === step ? 'bg-cosmic-accent' : 'bg-cosmic-accent/30'}`}
                />
              ))}
            </div>
            
            <CosmicButton onClick={handleNext}>
              {step < steps.length - 1 ? 
                (t.onboarding?.buttons?.next || "Next") : 
                (t.onboarding?.buttons?.startJourney || t.onboarding?.startButton)}
            </CosmicButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
