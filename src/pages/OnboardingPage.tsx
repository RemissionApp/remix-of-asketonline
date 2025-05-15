
import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setOnboardingComplete, 
    setActiveScreen, 
    user, 
    loading, 
    onboardingComplete, 
    userProfile,
    emailConfirmed,
    checkEmailConfirmation
  } = useAppStore();
  const { t } = useTranslations();
  const [step, setStep] = useState(0);
  
  // Check if user is logged in, email confirmed, and profile is completed
  useEffect(() => {
    // Added console log to debug onboarding flow
    console.log("Onboarding: user status", { 
      user, 
      loading, 
      onboardingComplete, 
      userProfile,
      emailConfirmed
    });
    
    const checkAuth = async () => {
      if (loading) return;
      
      // If no user is logged in, redirect to login
      if (!user && !loading) {
        console.log("No user found, redirecting to login");
        navigate('/login');
        return;
      }
      
      // Check if email is confirmed
      if (user && !loading) {
        const isConfirmed = await checkEmailConfirmation();
        console.log("Email confirmed status:", isConfirmed);
        
        if (!isConfirmed) {
          toast({
            title: "Подтвердите email",
            description: "Пожалуйста, подтвердите ваш email перед продолжением",
            variant: "warning"
          });
          navigate('/login');
          return;
        }
      }
      
      // If profile is not completed, redirect to profile setup
      if (user && !loading && (!userProfile || !userProfile.birthDate || userProfile.name === 'Искатель')) {
        console.log("Profile not completed, redirecting to profile setup");
        navigate('/profile-setup');
        return;
      }
      
      // If onboarding is already complete, go to main
      if (onboardingComplete && !loading) {
        console.log("Onboarding already completed, redirecting to main");
        navigate('/main');
      }
    };
    
    checkAuth();
  }, [user, loading, navigate, onboardingComplete, userProfile, emailConfirmed, checkEmailConfirmation]);
  
  const handleNext = () => {
    if (step < 2) { // Just use a hardcoded number for steps (0, 1, 2)
      setStep(step + 1);
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };
  
  const completeOnboarding = () => {
    console.log("Completing onboarding");
    
    // Set onboarding complete and navigate to main screen
    setOnboardingComplete(true);
    setActiveScreen('main');
    
    // Save onboarding completion to localStorage
    localStorage.setItem('onboarded', 'true');
    
    // Navigate to main page
    navigate('/main');
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
