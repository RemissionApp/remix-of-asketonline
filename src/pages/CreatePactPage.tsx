import React, { useState, useEffect, useRef } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { Sparkles, Hourglass, Target } from 'lucide-react';
import { PactOath } from '@/components/PactOath';
import { useTranslations } from '@/hooks/useTranslations';
import MultiSelectWithCustomInput from '@/components/MultiSelectWithCustomInput';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { PageHeader } from '@/components/ui/PageHeader';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';

const CreatePactPage: React.FC = () => {
  const { addPact, setActiveScreen, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { generateAndPlaySpeech, stopSpeech } = useTextToSpeech();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [durationText, setDurationText] = useState('30');
  const [reward, setReward] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Guards against React 18 StrictMode double-effect (which caused doubled TTS playback)
  const welcomePlayedRef = useRef(false);
  const goalPlayedRef = useRef(false);

  const getWelcomePhrase = () => {
    switch (language) {
      case 'ru':
        return 'Добро пожаловать в создание аскезы. Здесь вы сможете выбрать свой путь духовного роста и заключить договор с Вселенной.';
      case 'es':
        return 'Bienvenido a la creación de ascesis. Aquí podrás elegir tu camino de crecimiento espiritual y hacer un contrato con el Universo.';
      default:
        return 'Welcome to ascesis creation. Here you can choose your path of spiritual growth and make a contract with the Universe.';
    }
  };

  const getGoalInstructionsPhrase = () => {
    switch (language) {
      case 'ru':
        return 'Теперь сформулируйте свою цель. Помните: цель должна быть сформулирована чётко и как можно подробнее. Желание может быть абсолютно любым, но Вселенная любит шутить. Поэтому, чем точнее вы опишете конечный результат, тем больше вероятность получить желаемое.';
      case 'es':
        return 'Ahora formula tu objetivo. Recuerda: el objetivo debe formularse claramente y con el mayor detalle posible. El deseo puede ser absolutamente cualquiera, pero al Universo le gusta bromear. Por lo tanto, cuanto más precisamente describas el resultado final, mayor será la probabilidad de obtener lo que deseas.';
      default:
        return 'Now formulate your goal. Remember: the goal must be formulated clearly and in as much detail as possible. The desire can be absolutely anything, but the Universe loves to joke. Therefore, the more precisely you describe the end result, the more likely you are to get what you want.';
    }
  };

  // Welcome voice — play exactly once
  useEffect(() => {
    if (welcomePlayedRef.current) return;
    welcomePlayedRef.current = true;
    try {
      stopSpeech();
      generateAndPlaySpeech(getWelcomePhrase(), {
        voice: 'Custom',
        model: 'eleven_multilingual_v2',
      });
    } catch (error) {
      console.error('Error playing welcome phrase:', error);
    }
    return () => {
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Goal-step voice — play exactly once when entering step 2
  useEffect(() => {
    if (step !== 2) return;
    if (goalPlayedRef.current) return;
    goalPlayedRef.current = true;
    try {
      stopSpeech();
      generateAndPlaySpeech(getGoalInstructionsPhrase(), {
        voice: 'Custom',
        model: 'eleven_multilingual_v2',
      });
    } catch (error) {
      console.error('Error playing goal instructions phrase:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const getDaysText = (count: number): string => {
    if (language !== 'ru') return t.main?.days || 'days';
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastDigit === 1 && lastTwoDigits !== 11) return 'день';
    if ((lastDigit === 2 || lastDigit === 3 || lastDigit === 4) &&
        !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) return 'дня';
    return 'дней';
  };

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
    }
    return [
      { value: 'sugar', label: 'Sugar' },
      { value: 'phone_after_22', label: 'Phone after 10 PM' },
      { value: 'cigarettes', label: 'Cigarettes' },
      { value: 'procrastination', label: 'Procrastination' },
      { value: 'social_media', label: 'Social Media' },
      { value: 'alcohol', label: 'Alcohol' },
      { value: 'junk_food', label: 'Junk Food' },
    ];
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const pactTitle = selectedItems.length > 0 ? selectedItems.join(', ') : title;
      addPact({ title: pactTitle, duration, reward, status: 'active' });
      setActiveScreen('main');
      navigate('/main');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else {
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

  const handleDurationTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setDurationText(text);
    const num = parseInt(text);
    if (!isNaN(num)) setDuration(Math.max(30, num));
  };

  const handleDurationBlur = () => {
    if (durationText === '' || isNaN(parseInt(durationText))) {
      setDurationText('30');
      setDuration(30);
    } else {
      const validNum = Math.max(30, parseInt(durationText));
      setDurationText(validNum.toString());
      setDuration(validNum);
    }
  };

  // Glass card wrapper used for every step
  const cardClass =
    'rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-accent/15 via-cosmic-dark/60 to-cosmic-gold/10 shadow-lg shadow-cosmic-accent/10 backdrop-blur-md p-4 sm:p-5';

  const IconBadge: React.FC<{ Icon: React.ComponentType<{ className?: string }> }> = ({ Icon }) => (
    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-gold/80 to-cosmic-accent/60 shadow-[0_0_30px_rgba(232,193,108,0.3)]">
      <Icon className="h-6 w-6 text-white" />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-fade-in w-full">
            <div className={cardClass}>
              <IconBadge Icon={Sparkles} />
              <h2 className="text-lg sm:text-xl font-serif text-white mb-4 text-center leading-tight">
                {t.createPact?.stepOneTitle || 'Choose ascesis type'}
              </h2>

              <div className="mb-4">
                <MultiSelectWithCustomInput
                  options={getRejectionOptions()}
                  value={selectedItems}
                  onChange={setSelectedItems}
                  placeholder={
                    language === 'ru'
                      ? 'Выберите или введите Ваш отказ'
                      : language === 'es'
                        ? 'Seleccione o ingrese a qué renuncia'
                        : "Select or enter what you're giving up"
                  }
                  inputPlaceholder={
                    language === 'ru'
                      ? 'Введите свой вариант...'
                      : language === 'es'
                        ? 'Ingrese su opción...'
                        : 'Enter your option...'
                  }
                />
              </div>

              {selectedItems.length === 0 && (
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={t.createPact?.placeholders?.title || 'Enter a title...'}
                  className="cosmic-input w-full mb-4 text-sm sm:text-base rounded-2xl"
                />
              )}

              <div className="text-xs sm:text-sm text-cosmic-secondary leading-relaxed border-l-2 border-cosmic-gold/40 pl-3">
                <p className="whitespace-pre-line font-sans">
                  {t.createPact?.ascesisWarning ||
                    'Ascesis is not just abstinence, but a tool for spiritual growth and self-improvement.'}
                </p>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in w-full">
            <div className={cardClass}>
              <IconBadge Icon={Hourglass} />
              <h2 className="text-lg sm:text-xl font-serif text-white mb-4 text-center leading-tight">
                {t.createPact?.stepTwoTitle || 'Choose duration'}
              </h2>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[30, 60, 90].map(days => (
                  <button
                    key={days}
                    className={`py-3 px-2 rounded-2xl border transition-all ${
                      duration === days
                        ? 'border-cosmic-accent/60 bg-cosmic-accent/15 shadow-[0_0_20px_rgba(139,92,246,0.25)] text-white'
                        : 'border-white/10 bg-cosmic-dark/40 text-cosmic-secondary'
                    }`}
                    onClick={() => {
                      setDuration(days);
                      setDurationText(days.toString());
                    }}
                  >
                    <span className="block text-base sm:text-lg font-bold">{days}</span>
                    <span className="block text-[10px] sm:text-xs">{getDaysText(days)}</span>
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <label className="block text-cosmic-secondary text-xs sm:text-sm mb-2 text-center">
                  {t.createPact?.customDays || 'Set custom days'}
                </label>
                <input
                  type="text"
                  value={durationText}
                  onChange={handleDurationTextChange}
                  onBlur={handleDurationBlur}
                  className="cosmic-input w-full text-sm sm:text-base text-center rounded-2xl"
                  placeholder={
                    language === 'ru'
                      ? 'Минимум 30 дней'
                      : language === 'es'
                        ? 'Mínimo 30 días'
                        : 'Min. 30 days'
                  }
                />
                <p className="text-[10px] sm:text-xs text-cosmic-secondary mt-1.5 text-center font-sans">
                  {t.minimumPeriod || 'Minimum ascesis period is 30 days'}
                </p>
              </div>

              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/40 shadow-[0_0_40px_rgba(139,92,246,0.35)] flex items-center justify-center border border-white/10">
                  <div className="absolute inset-1 rounded-full bg-cosmic-dark/70 flex flex-col items-center justify-center">
                    <p className="text-xl font-bold text-white leading-none">{duration}</p>
                    <p className="text-[10px] text-cosmic-gold mt-1">{getDaysText(duration)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in w-full">
            <div className={cardClass}>
              <IconBadge Icon={Target} />
              <h2 className="text-lg sm:text-xl font-serif text-white mb-2 text-center leading-tight">
                {t.createPact?.stepThreeTitle || 'Create contract'}
              </h2>

              <p className="text-xs sm:text-sm text-cosmic-secondary mb-4 text-center">
                {t.createPact?.notAsking || "I'm not asking for anything in return"}
              </p>

              <textarea
                value={reward}
                onChange={e => setReward(e.target.value)}
                placeholder={
                  t.createPact?.placeholders?.reward || 'What you will get in return...'
                }
                className="cosmic-input w-full h-28 sm:h-32 resize-none mb-4 text-sm leading-relaxed rounded-2xl"
              />

              <div className="space-y-3 text-xs sm:text-sm text-cosmic-secondary leading-relaxed">
                {language === 'ru' ? (
                  <>
                    <div className="border-l-2 border-cosmic-gold/40 pl-3">
                      <p className="text-cosmic-gold text-xs font-semibold mb-1">Цель</p>
                      <p className="font-sans">
                        Должна быть сформулирована чётко и как можно подробнее. Желание может быть
                        абсолютно любым, но Вселенная любит шутить. Чем точнее вы опишете конечный
                        результат, тем больше вероятность получить желаемое.
                      </p>
                    </div>
                    <div className="border-l-2 border-cosmic-accent/40 pl-3">
                      <p className="text-cosmic-accent text-xs font-semibold mb-1">Главное правило</p>
                      <p className="font-sans">
                        Договор нужно заключать осознанно, иначе вы только навредите себе.
                      </p>
                    </div>
                  </>
                ) : language === 'es' ? (
                  <>
                    <div className="border-l-2 border-cosmic-gold/40 pl-3">
                      <p className="text-cosmic-gold text-xs font-semibold mb-1">Objetivo</p>
                      <p className="font-sans">
                        Debe formularse claramente y con el mayor detalle posible. Cuanto más
                        precisamente describas el resultado final, mayor será la probabilidad de
                        obtenerlo.
                      </p>
                    </div>
                    <div className="border-l-2 border-cosmic-accent/40 pl-3">
                      <p className="text-cosmic-accent text-xs font-semibold mb-1">Regla principal</p>
                      <p className="font-sans">
                        El pacto debe hacerse conscientemente, de lo contrario solo te harás daño.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-l-2 border-cosmic-gold/40 pl-3">
                      <p className="text-cosmic-gold text-xs font-semibold mb-1">Goal</p>
                      <p className="font-sans">
                        It must be formulated clearly and in as much detail as possible. The more
                        precisely you describe the end result, the more likely you are to get what
                        you want.
                      </p>
                    </div>
                    <div className="border-l-2 border-cosmic-accent/40 pl-3">
                      <p className="text-cosmic-accent text-xs font-semibold mb-1">Main rule</p>
                      <p className="font-sans">
                        The covenant must be made consciously, otherwise you will only harm yourself.
                      </p>
                    </div>
                  </>
                )}
              </div>
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

  const showStandardLayout = step < 3;

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-page">
        <StarField starCount={120} />

        {showStandardLayout && (
          <>
            <PageHeader
              title={t.createPact?.title || 'Create Ascesis'}
              onBack={handleBack}
            />

            <div className="flex-1 relative z-10 px-3 pt-page sm:px-4 max-w-lg mx-auto w-full flex flex-col gap-3 sm:gap-4">
              {renderStep()}

              {/* Progress + Next */}
              <div className="mt-2 px-1">
                <div className="flex items-center gap-1.5 mb-4">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`flex-1 h-0.5 rounded-full ${
                        i <= step
                          ? 'bg-gradient-to-r from-cosmic-gold to-cosmic-accent'
                          : 'bg-white/10'
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
                    {t.createPact?.nextButton || 'Next'}
                  </CosmicButton>
                )}
              </div>
            </div>
          </>
        )}

        {!showStandardLayout && (
          <div className="relative z-10 flex-1 flex flex-col p-4 pt-page">
            {renderStep()}
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default CreatePactPage;
