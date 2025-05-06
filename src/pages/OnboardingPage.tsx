
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const { setOnboardingComplete, setActiveScreen } = useAppStore();
  
  const steps = [
    {
      title: "Портал Пробуждения",
      content: "Ты чувствуешь зов. Он зовёт тебя вглубь себя"
    },
    {
      title: "Что такое Аскеза",
      content: "Аскеза — это священный договор с Вселенной. Каждый день отказа от чего-то низкого повышает твою вибрацию и раскрывает внутреннюю силу."
    },
    {
      title: "Почему она работает",
      content: "Отказываясь от искушения, ты усиливаешь свою волю и настраиваешься на высшие энергии. Вселенная видит твои усилия и отвечает взаимностью."
    },
    {
      title: "Кем ты станешь",
      content: "Человеком, чьи желания подчинены воле. Тем, кто способен формировать реальность через осознанный отказ и притяжение высшего. Властелином своей судьбы."
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
              {steps[step].title}
            </h1>
            
            <p className="text-xl text-cosmic-secondary mb-8">
              {steps[step].content}
            </p>
            
            <CosmicButton onClick={handleNext}>
              Войти
            </CosmicButton>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <h1 className="text-3xl font-serif text-white mb-6">
              {steps[step].title}
            </h1>
            
            <p className="text-xl text-cosmic-secondary mb-8">
              {steps[step].content}
            </p>
            
            <div className="flex justify-center mb-8">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 mx-1 rounded-full ${i === step ? 'bg-cosmic-accent' : 'bg-cosmic-accent/30'}`}
                />
              ))}
            </div>
            
            <CosmicButton onClick={handleNext}>
              {step < steps.length - 1 ? 'Далее' : 'Начать путь'}
            </CosmicButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
