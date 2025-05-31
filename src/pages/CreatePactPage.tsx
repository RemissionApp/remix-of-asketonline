import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft } from 'lucide-react';
import { PactOath } from '@/components/PactOath';
import { useTranslations } from '@/hooks/useTranslations';
import MultiSelectWithCustomInput from '@/components/MultiSelectWithCustomInput';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

const CreatePactPage: React.FC = () => {
  const { addPact, setActiveScreen, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { generateAndPlaySpeech } = useTextToSpeech();
  
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [durationText, setDurationText] = useState('30');
  const [reward, setReward] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Воспроизведение приветственной фразы при загрузке страницы
  useEffect(() => {
    const welcomePhrase = getWelcomePhrase();
    try {
      generateAndPlaySpeech(welcomePhrase, { 
        voice: 'Custom', 
        model: 'eleven_multilingual_v2' 
      });
    } catch (error) {
      console.error('Error playing welcome phrase:', error);
    }
  }, []);

  const getWelcomePhrase = () => {
    switch(language) {
      case 'ru': return 'Добро пожаловать в создание аскезы. Здесь вы сможете выбрать свой путь духовного роста и заключить договор с Вселенной.';
      case 'es': return 'Bienvenido a la creación de ascesis. Aquí podrás elegir tu camino de crecimiento espiritual y hacer un contrato con el Universo.';
      default: return 'Welcome to ascesis creation. Here you can choose your path of spiritual growth and make a contract with the Universe.';
    }
  };
  
  // Функция для правильного склонения в русском языке
  const getDaysText = (count: number): string => {
    if (language !== 'ru') {
      return t.main?.days || "days";
    }
    
    // Правило для русского языка
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return 'день';
    } else if (
      (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) && 
      !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
    ) {
      return 'дня';
    } else {
      return 'дней';
    }
  };
  
  // Опции для мультиселекта, переведенные на нужный язык
  const getRejectionOptions = () => {
    if (language === 'ru') {
      return [
        { value: 'sugar', label: 'Сахар' },
        { value: 'phone_after_22', label: 'Телефон после 22:00' },
        { value: 'cigarettes', label: 'Сигареты' },
        { value: 'procrastination', label: 'Прокрастинация' },
        { value: 'social_media', label: 'Социальные сети' },
        { value: 'alcohol', label: 'Алкоголь' },
        { value: 'junk_food', label: 'Фастфуд' },
      ];
    } else if (language === 'es') {
      return [
        { value: 'sugar', label: 'Azúcar' },
        { value: 'phone_after_22', label: 'Teléfono después de las 22:00' },
        { value: 'cigarettes', label: 'Cigarrillos' },
        { value: 'procrastination', label: 'Procrastinación' },
        { value: 'social_media', label: 'Redes sociales' },
        { value: 'alcohol', label: 'Alcohol' },
        { value: 'junk_food', label: 'Comida rápida' },
      ];
    } else {
      // English by default
      return [
        { value: 'sugar', label: 'Sugar' },
        { value: 'phone_after_22', label: 'Phone after 10 PM' },
        { value: 'cigarettes', label: 'Cigarettes' },
        { value: 'procrastination', label: 'Procrastination' },
        { value: 'social_media', label: 'Social Media' },
        { value: 'alcohol', label: 'Alcohol' },
        { value: 'junk_food', label: 'Junk Food' },
      ];
    }
  };
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create pact and navigate to main screen
      const pactTitle = selectedItems.length > 0 ? selectedItems.join(', ') : title;
      addPact({
        title: pactTitle,
        duration,
        reward,
        status: 'active'
      });
      setActiveScreen('main');
      navigate('/main');
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setActiveScreen('main');
      navigate('/main');
    }
  };
  
  const isNextDisabled = () => {
    if (step === 0) return !title && selectedItems.length === 0;
    if (step === 1) return !duration || duration < 30;
    if (step === 2) return !reward || reward.length < 3;
    return false;
  };
  
  // Обработчик изменения продолжительности с проверкой минимального значения
  const handleDurationChange = (value: number) => {
    const newDuration = Math.max(30, value); // Не позволяет установить значение меньше 30
    setDuration(newDuration);
    setDurationText(newDuration.toString());
  };
  
  // Обработчик для ручного ввода текста
  const handleDurationTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setDurationText(text);
    
    // Convert to number if possible
    const num = parseInt(text);
    if (!isNaN(num)) {
      const validNum = Math.max(30, num);
      setDuration(validNum);
    }
  };
  
  // Handle blur to enforce minimum value
  const handleDurationBlur = () => {
    if (durationText === '' || isNaN(parseInt(durationText))) {
      setDurationText('30');
      setDuration(30);
    } else {
      const num = parseInt(durationText);
      const validNum = Math.max(30, num);
      setDurationText(validNum.toString());
      setDuration(validNum);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-fade-in mx-auto w-full max-w-md text-center">
            <h2 className="text-3xl font-serif text-white mb-8 text-center leading-tight">
              {t.createPact?.stepOneTitle || "Choose ascesis type"}
            </h2>
            
            <div className="mb-6">
              <MultiSelectWithCustomInput 
                options={getRejectionOptions()}
                value={selectedItems}
                onChange={setSelectedItems}
                placeholder={language === 'ru' ? "Выберите или введите Ваш отказ" : 
                            language === 'es' ? "Seleccione o ingrese a qué renuncia" : 
                            "Select or enter what you're giving up"}
                inputPlaceholder={language === 'ru' ? "Введите свой вариант..." : 
                                 language === 'es' ? "Ingrese su opción..." : 
                                 "Enter your option..."}
              />
            </div>
            
            {selectedItems.length === 0 && (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.createPact?.placeholders?.title || "Enter a title..."}
                className="cosmic-input w-full mb-6 text-lg"
              />
            )}
            
            <div className="text-sm text-cosmic-secondary mb-8 text-center leading-relaxed">
              <p className="whitespace-pre-line text-justify font-sans">{t.createPact?.ascesisWarning || "Ascesis is not just abstinence, but a tool for spiritual growth and self-improvement."}</p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in mx-auto w-full max-w-md text-center">
            <h2 className="text-3xl font-serif text-white mb-8 text-center leading-tight">
              {t.createPact?.stepTwoTitle || "Choose duration"}
            </h2>
            
            <div className="flex justify-between gap-4 mb-8">
              {[30, 60, 90].map((days) => (
                <button
                  key={days}
                  className={`flex-1 py-4 px-2 rounded-lg border text-lg font-medium ${
                    duration === days
                      ? 'border-cosmic-accent bg-cosmic-accent/20 text-white'
                      : 'border-cosmic-accent/30 text-cosmic-secondary'
                  }`}
                  onClick={() => {
                    setDuration(days);
                    setDurationText(days.toString());
                  }}
                >
                  <span className="block text-xl font-bold">{days}</span>
                  <span className="block text-sm">{getDaysText(days)}</span>
                </button>
              ))}
            </div>
            
            <div className="mb-8">
              <label className="block text-cosmic-secondary text-base mb-3 text-center font-medium">
                {t.createPact?.customDays || "Set custom days"}
              </label>
              <input
                type="text"
                value={durationText}
                onChange={handleDurationTextChange}
                onBlur={handleDurationBlur}
                className="cosmic-input w-full text-lg text-center"
                placeholder={language === 'ru' ? "Введите количество дней (мин. 30)" : 
                           language === 'es' ? "Ingrese el número de días (mín. 30)" : 
                           "Enter number of days (min. 30)"}
              />
              <p className="text-sm text-cosmic-secondary mt-2 text-center font-sans">
                {t.minimumPeriod || "Minimum ascesis period is 30 days"}
              </p>
            </div>
            
            <div className="w-32 h-32 mx-auto">
              <div className="energy-circle w-32 h-32 animate-circle-expand">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{duration}</p>
                  <p className="text-sm text-cosmic-accent font-medium">{getDaysText(duration)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in mx-auto w-full max-w-md text-center">
            <h2 className="text-3xl font-serif text-white mb-6 text-center leading-tight">
              {t.createPact?.stepThreeTitle || "Create contract"}
            </h2>
            
            <p className="text-lg text-cosmic-secondary mb-8 text-center font-medium">
              {t.createPact?.notAsking || "I'm not asking for anything in return"}
            </p>
            
            <textarea
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder={t.createPact?.placeholders?.reward || "What you will get in return..."}
              className="cosmic-input w-full h-40 resize-none mb-4 text-base leading-relaxed"
            />

            <div className="text-sm text-cosmic-secondary mb-8 text-center leading-relaxed">
              {language === 'ru' ? (
                <p className="whitespace-pre-line text-justify font-sans">
                  <span className="font-semibold text-base">Цель:</span>{"\n"}
                  Должна быть сформулирована чётко и как можно подробнее. Желание может быть абсолютно любым, но Вселенная любит шутить. Поэтому, чем точнее вы мысленно опишете или проговорите конечный результат, тем больше вероятность получить желаемое.{"\n\n"}
                  <span className="font-semibold text-base">Главное правило:</span>{"\n"}
                  Договор нужно заключать осознанно, иначе вы только навредите себе.
                </p>
              ) : language === 'es' ? (
                <p className="whitespace-pre-line text-justify font-sans">
                  <span className="font-semibold text-base">Objetivo:</span>{"\n"}
                  Debe formularse claramente y con el mayor detalle posible. El deseo puede ser absolutamente cualquiera, pero al Universo le gusta bromear. Por lo tanto, cuanto más precisamente describa o articule mentalmente el resultado final, mayor será la probabilidad de obtener lo que desea.{"\n\n"}
                  <span className="font-semibold text-base">La regla principal:</span>{"\n"}
                  El pacto debe hacerse conscientemente, de lo contrario solo se hará daño a sí mismo.
                </p>
              ) : (
                <p className="whitespace-pre-line text-justify font-sans">
                  <span className="font-semibold text-base">Goal:</span>{"\n"}
                  It must be formulated clearly and in as much detail as possible. The desire can be absolutely anything, but the Universe loves to joke. Therefore, the more precisely you mentally describe or articulate the end result, the more likely you are to get what you want.{"\n\n"}
                  <span className="font-semibold text-base">The main rule:</span>{"\n"}
                  The covenant must be made consciously, otherwise you will only harm yourself.
                </p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <PactOath
            title={selectedItems.length > 0 ? selectedItems.join(', ') : title}
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
    <div className="min-h-screen flex flex-col relative pb-16">
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
              {t.createPact?.title || "Create Ascesis"}
            </h1>
          </div>
          
          {/* Main content */}
          <div className="relative z-10 flex-1 flex flex-col px-4 py-4 mx-auto w-full items-center justify-center">
            {renderStep()}
          </div>
          
          {/* Bottom */}
          <div className="relative z-10 p-4 max-w-lg mx-auto w-full text-center mb-4">
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
                {t.createPact?.nextButton || "Next"}
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
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default CreatePactPage;
