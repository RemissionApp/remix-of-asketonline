import React, { useState, useEffect } from 'react';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const OnboardingPage: React.FC = () => {
  const { updateUserProfile, userProfile, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [userName, setUserName] = useState(userProfile?.name || '');
  const [goal, setGoal] = useState(userProfile?.goal || '');
  
  // Check if onboardingComplete is already true
  useEffect(() => {
    if (userProfile?.onboardingComplete) {
      // If onboarding is already completed, redirect to main
      setActiveScreen('main');
      navigate('/main');
    }
  }, [userProfile, setActiveScreen, navigate]);
  
  // Handle onboarding completion
  const handleFinish = async () => {
    // Update user profile
    await updateUserProfile({
      name: userName,
      birthDate,
      goal,
      onboardingComplete: true
    });
    
    // Navigate to main page
    setActiveScreen('main');
    navigate('/main');
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-fade-in mx-auto w-full max-w-md text-center">
            <h2 className="text-2xl font-serif text-white mb-8 text-center">
              {t.onboarding?.stepOneTitle || "Welcome, Seeker!"}
            </h2>
            
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t.onboarding?.placeholders?.name || "Enter your name..."}
              className="cosmic-input w-full mb-6"
            />
            
            <DatePicker
              selected={birthDate}
              onChange={(date: Date) => setBirthDate(date)}
              placeholderText={t.onboarding?.placeholders?.birthDate || "Select your birth date..."}
              className="cosmic-input w-full mb-6"
              dateFormat="yyyy-MM-dd"
            />
            
            <p className="text-sm text-cosmic-secondary mb-8 text-center">
              {t.onboarding?.stepOneDescription || "We need this information to personalize your experience."}
            </p>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in mx-auto w-full max-w-md text-center">
            <h2 className="text-2xl font-serif text-white mb-8 text-center">
              {t.onboarding?.stepTwoTitle || "What is your goal?"}
            </h2>
            
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={t.onboarding?.placeholders?.goal || "Enter your main goal..."}
              className="cosmic-input w-full h-40 resize-none mb-4"
            />
            
            <p className="text-sm text-cosmic-secondary mb-8 text-center">
              {t.onboarding?.stepTwoDescription || "This will help us guide you on your journey."}
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  const handleNext = () => {
    if (step < 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const isNextDisabled = () => {
    if (step === 0) return !userName;
    if (step === 1) return !goal;
    return false;
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {renderStep()}
      </div>
      
      {/* Bottom Navigation */}
      <div className="relative z-10 p-4 max-w-lg mx-auto w-full text-center">
        <div className="flex justify-between items-center mb-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full mx-1 ${
                i <= step ? 'bg-cosmic-accent' : 'bg-cosmic-accent/30'
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-between">
          <CosmicButton 
            variant="secondary"
            onClick={handleBack}
            disabled={step === 0}
          >
            {t.onboarding?.backButton || "Back"}
          </CosmicButton>
          
          <CosmicButton 
            onClick={handleNext} 
            disabled={isNextDisabled()}
          >
            {step < 1 ? (
              t.onboarding?.nextButton || "Next"
            ) : (
              t.onboarding?.finishButton || "Finish"
            )}
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
