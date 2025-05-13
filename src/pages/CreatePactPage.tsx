
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft } from 'lucide-react';
import { PactOath } from '@/components/PactOath';
import { useTranslations } from '@/hooks/useTranslations';

const CreatePactPage: React.FC = () => {
  const { addPact, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(21);
  const [reward, setReward] = useState('');
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create pact and navigate to main screen
      addPact({
        title,
        duration,
        reward,
        status: 'active'
      });
      setActiveScreen('main');
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setActiveScreen('main');
    }
  };
  
  const isNextDisabled = () => {
    if (step === 0) return !title || title.length < 3;
    if (step === 1) return !duration || duration < 1;
    if (step === 2) return !reward || reward.length < 3;
    return false;
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-serif text-white mb-8">
              {t.createPact.stepOneTitle}
            </h2>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.createPact.placeholders.rejection}
              className="cosmic-input w-full mb-6"
            />
            
            <div className="text-sm text-cosmic-secondary mb-8">
              <p>{t.createPact.whatRejecting}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.createPact.examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-serif text-white mb-8">
              {t.createPact.stepTwoTitle}
            </h2>
            
            <div className="flex justify-between gap-4 mb-8">
              {[7, 21, 30, 90].map((days) => (
                <button
                  key={days}
                  className={`flex-1 py-3 px-1 rounded-lg border ${
                    duration === days
                      ? 'border-cosmic-accent bg-cosmic-accent/20 text-white'
                      : 'border-cosmic-accent/30 text-cosmic-secondary'
                  }`}
                  onClick={() => setDuration(days)}
                >
                  {days} {t.main.days}
                </button>
              ))}
            </div>
            
            <div className="mb-8">
              <label className="block text-cosmic-secondary text-sm mb-2">
                {t.createPact.customDays}
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                className="cosmic-input w-full"
              />
            </div>
            
            <div className="w-32 h-32 mx-auto">
              <div className="energy-circle w-32 h-32 animate-circle-expand">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{duration}</p>
                  <p className="text-xs text-cosmic-accent">{t.main.days}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-serif text-white mb-4">
              {t.createPact.stepThreeTitle}
            </h2>
            
            <p className="text-cosmic-secondary mb-8">
              {t.createPact.notAsking}
            </p>
            
            <textarea
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder={t.createPact.placeholders.reward}
              className="cosmic-input w-full h-40 resize-none mb-8"
            />
          </div>
        );
      case 3:
        return (
          <PactOath
            title={title}
            duration={duration}
            reward={reward}
            onConfirm={handleNext}
            onBack={handleBack}
          />
        );
    }
  };
  
  // Don't show the standard UI for the oath screen
  const showStandardLayout = step < 3;
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      {showStandardLayout && (
        <>
          {/* Header */}
          <div className="relative z-10 px-4 py-4 flex items-center">
            <button
              className="p-2 text-cosmic-accent"
              onClick={handleBack}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
              {t.createPact.title}
            </h1>
          </div>
          
          {/* Main content */}
          <div className="relative z-10 flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
            {renderStep()}
          </div>
          
          {/* Bottom */}
          <div className="relative z-10 p-4 max-w-lg mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full mx-1 ${
                    i <= step ? 'bg-cosmic-accent' : 'bg-cosmic-accent/30'
                  }`}
                />
              ))}
            </div>
            
            {step < 3 && (
              <CosmicButton 
                onClick={handleNext} 
                className="w-full"
                disabled={isNextDisabled()}
              >
                {step === 2 ? t.createPact.nextButton : t.createPact.nextButton}
              </CosmicButton>
            )}
          </div>
        </>
      )}
      
      {!showStandardLayout && (
        <div className="relative z-10 flex-1 flex flex-col p-4">
          {renderStep()}
        </div>
      )}
    </div>
  );
};

export default CreatePactPage;
