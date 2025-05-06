
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft } from 'lucide-react';

const CreatePactPage: React.FC = () => {
  const { addPact, setActiveScreen } = useAppStore();
  
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(21);
  const [reward, setReward] = useState('');
  
  const handleNext = () => {
    if (step < 2) {
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
              От чего ты отказываешься?
            </h2>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Сахар, Соцсети, Алкоголь..."
              className="cosmic-input w-full mb-6"
            />
            
            <div className="text-sm text-cosmic-secondary mb-8">
              <p>Примеры:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Сахар</li>
                <li>Телефон после 22:00</li>
                <li>Сигареты</li>
                <li>Прокрастинация</li>
                <li>Социальные сети</li>
              </ul>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-serif text-white mb-8">
              Срок испытания
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
                  {days} дней
                </button>
              ))}
            </div>
            
            <div className="mb-8">
              <label className="block text-cosmic-secondary text-sm mb-2">
                Или укажите своё количество дней:
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
                  <p className="text-xs text-cosmic-accent">дней</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-serif text-white mb-4">
              Что ты хочешь получить?
            </h2>
            
            <p className="text-cosmic-secondary mb-8">
              Ты не просишь. Ты настраиваешь реальность.
            </p>
            
            <textarea
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="Например: Крепкое здоровье, Ясность мышления, Финансовую стабильность..."
              className="cosmic-input w-full h-40 resize-none mb-8"
            />
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      {/* Header */}
      <div className="relative z-10 px-4 py-4 flex items-center">
        <button
          className="p-2 text-cosmic-accent"
          onClick={handleBack}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
          Создание Аскезы
        </h1>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
        {renderStep()}
      </div>
      
      {/* Bottom */}
      <div className="relative z-10 p-4 max-w-lg mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full mx-1 ${
                i <= step ? 'bg-cosmic-accent' : 'bg-cosmic-accent/30'
              }`}
            />
          ))}
        </div>
        
        <CosmicButton 
          onClick={handleNext} 
          className="w-full"
          disabled={isNextDisabled()}
        >
          {step === 2 ? 'Заключить' : 'Далее'}
        </CosmicButton>
      </div>
    </div>
  );
};

export default CreatePactPage;
