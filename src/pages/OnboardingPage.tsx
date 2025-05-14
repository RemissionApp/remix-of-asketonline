import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const { setOnboardingComplete, setActiveScreen, user, userProfile, updateUserProfile } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  // Check if user is logged in and redirect if necessary
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // If user has already completed onboarding, redirect to main page
    if (userProfile?.onboardingComplete) {
      navigate('/main');
    }
  }, [user, userProfile, navigate]);
  
  const handleNext = () => {
    if (step < 2) { // Just use a hardcoded number for steps (0, 1, 2)
      setStep(step + 1);
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };
  
  const completeOnboarding = async () => {
    // Set onboarding complete in local state and in backend
    setOnboardingComplete(true);
    await updateUserProfile({ onboardingComplete: true });
    
    // Set active screen and navigate to main
    setActiveScreen('main');
    navigate('/main');
  };
  
  // Function to skip onboarding
  const skipOnboarding = async () => {
    await completeOnboarding();
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
          onClick={skipOnboarding}
          className="text-cosmic-secondary/70 hover:text-cosmic-accent transition-colors text-sm"
        >
          {t.onboarding?.buttons?.skip || "Пропустить"}
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
              {t.onboarding.title}
            </h1>
            
            <div className="mb-8">
              <p className="text-xl text-cosmic-secondary mb-4">{t.onboarding.description}</p>
            </div>
            
            <CosmicButton onClick={handleNext}>
              {t.onboarding.buttons.enter || "Войти"}
            </CosmicButton>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <h1 className="text-3xl font-serif text-white mb-6">
              {step === 1 ? t.onboarding.steps.goal : t.onboarding.steps.complete}
            </h1>
            
            <div className="mb-8">
              <p className="text-xl text-cosmic-secondary mb-4">
                {step === 1 ? t.onboarding.description : t.onboarding.description}
              </p>
            </div>
            
            <div className="flex justify-center mb-8">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 mx-1 rounded-full ${i === step ? 'bg-cosmic-accent' : 'bg-cosmic-accent/30'}`}
                />
              ))}
            </div>
            
            <CosmicButton onClick={handleNext}>
              {step < 2 ? t.onboarding.buttons.next : (t.onboarding.buttons.startJourney || "Начать путь")}
            </CosmicButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
