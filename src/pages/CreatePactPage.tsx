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
import { useOptimizedTextToSpeech } from '@/hooks/useOptimizedTextToSpeech';
import { PageHeader } from '@/components/PageHeader';

const CreatePactPage: React.FC = () => {
  const { addPact, setActiveScreen, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { generateAndPlaySpeech, stopSpeech } = useOptimizedTextToSpeech();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [durationText, setDurationText] = useState('30');
  const [reward, setReward] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Универсальное воспроизведение звука для каждого шага
  useEffect(() => {
    const playStepAudio = async () => {
      // Останавливаем предыдущий звук
      stopSpeech();
      
      // Небольшая задержка для плавности
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        const stepPhrase = getStepPhrase(step);
        if (stepPhrase) {
          generateAndPlaySpeech(stepPhrase, {
            voice: 'Custom',
            model: 'eleven_multilingual_v2',
          });
        }
      } catch (error) {
        console.error(`Error playing audio for step ${step}:`, error);
      }
    };

    playStepAudio();
  }, [step, generateAndPlaySpeech, stopSpeech]);

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

  const getStepPhrase = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return getWelcomePhrase();
      case 1:
        return getDurationPhrase();
      case 2:
        return getGoalInstructionsPhrase();
      case 3:
        return getOathPhrase();
      default:
        return null;
    }
  };

  const getDurationPhrase = () => {
    switch (language) {
      case 'ru':
        return 'Выберите продолжительность вашей аскезы. Помните: минимальный период составляет 30 дней. Чем дольше период, тем сильнее изменения в вашей жизни. Выбирайте осознанно.';
      case 'es':
        return 'Elige la duración de tu ascesis. Recuerda: el período mínimo es de 30 días. Cuanto más largo sea el período, más fuertes serán los cambios en tu vida. Elige conscientemente.';
      default:
        return 'Choose the duration of your ascesis. Remember: the minimum period is 30 days. The longer the period, the stronger the changes in your life. Choose consciously.';
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

  const getOathPhrase = () => {
    switch (language) {
      case 'ru':
        return 'Повторите клятву за мной. Я буду читать с паузами, а вы повторяйте каждую фразу. Это важный момент - ваш договор с Вселенной должен быть заключен осознанно и искренне.';
      case 'es':
        return 'Repite el juramento después de mí. Leeré con pausas, y tú repites cada frase. Este es un momento importante: tu contrato con el Universo debe hacerse consciente y sinceramente.';
      default:
        return 'Repeat the oath after me. I will read with pauses, and you repeat each phrase. This is an important moment - your contract with the Universe must be made consciously and sincerely.';
    }
  };

  // Функция для правильного склонения в русском языке
  const getDaysText = (count: number): string => {
    if (language !== 'ru') {
      return t.main?.days || 'days';
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

  const handleNext = async () => {
    // Останавливаем текущий звук
    stopSpeech();
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create pact and navigate to main screen
      const pactTitle =
        selectedItems.length > 0 ? selectedItems.join(', ') : title;
      addPact({
        title: pactTitle,
        duration,
        reward,
        status: 'active',
      });
      setActiveScreen('main');
      navigate('/main');
    }
  };

  const handleBack = async () => {
    // Останавливаем текущий звук
    stopSpeech();
    
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
              {t.createPact?.stepOneTitle || 'Choose ascesis type'}
            </h2>

            <div className="mb-6">
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
                placeholder={
                  t.createPact?.placeholders?.title || 'Enter a title...'
                }
                className="cosmic-input w-full mb-6 text-lg"
              />
            )}

            <div className="text-sm text-cosmic-secondary mb-8 text-center leading-relaxed">
              <p className="whitespace-pre-line text-justify font-sans">
                {t.createPact?.ascesisWarning ||
                  'Ascesis is not just abstinence, but a tool for spiritual growth and self-improvement.'}
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in mx-auto w-full max-w-md text-center">
            <h2 className="text-3xl font-serif text-white mb-8 text-center leading-tight">
              {t.createPact?.stepTwoTitle || 'Choose duration'}
            </h2>

            <div className="flex justify-between gap-4 mb-8">
              {[30, 60, 90].map(days => (
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
                {t.createPact?.customDays || 'Set custom days'}
              </label>
              <input
                type="text"
                value={durationText}
                onChange={handleDurationTextChange}
                onBlur={handleDurationBlur}
                className="cosmic-input w-full text-lg text-center"
                placeholder={
                  language === 'ru'
                    ? 'Введите количество дней (мин. 30)'
                    : language === 'es'
                      ? 'Ingrese el número de días (mín. 30)'
                      : 'Enter number of days (min. 30)'
                }
              />
              <p className="text-sm text-cosmic-secondary mt-2 text-center font-sans">
                {t.minimumPeriod || 'Minimum ascesis period is 30 days'}
              </p>
            </div>

            <div className="w-32 h-32 mx-auto">
              <div className="energy-circle w-32 h-32 animate-circle-expand">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{duration}</p>
                  <p className="text-sm text-cosmic-accent font-medium">
                    {getDaysText(duration)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in mx-auto w-full max-w-md text-center">
            <h2 className="text-3xl font-serif text-white mb-6 text-center leading-tight">
              {t.createPact?.stepThreeTitle || 'Create contract'}
            </h2>

            <p className="text-lg text-cosmic-secondary mb-8 text-center font-medium">
              {t.createPact?.notAsking ||
                "I'm not asking for anything in return"}
            </p>

            <textarea
              value={reward}
              onChange={e => setReward(e.target.value)}
              placeholder={
                t.createPact?.placeholders?.reward ||
                'What you will get in return...'
              }
              className="cosmic-input w-full h-40 resize-none mb-4 text-base leading-relaxed"
            />

            <div className="text-sm text-cosmic-secondary mb-8 text-center leading-relaxed">
              {language === 'ru' ? (
                <p className="whitespace-pre-line text-justify font-sans">
                  <span className="font-semibold text-base">Цель:</span>
                  {'\n'}
                  Должна быть сформулирована чётко и как можно подробнее.
                  Желание может быть абсолютно любым, но Вселенная любит шутить.
                  Поэтому, чем точнее вы мысленно опишете или проговорите
                  конечный результат, тем больше вероятность получить желаемое.
                  {'\n\n'}
                  <span className="font-semibold text-base">
                    Главное правило:
                  </span>
                  {'\n'}
                  Договор нужно заключать осознанно, иначе вы только навредите
                  себе.
                </p>
              ) : language === 'es' ? (
                <p className="whitespace-pre-line text-justify font-sans">
                  <span className="font-semibold text-base">Objetivo:</span>
                  {'\n'}
                  Debe formularse claramente y con el mayor detalle posible. El
                  deseo puede ser absolutamente cualquiera, pero al Universo le
                  gusta bromear. Por lo tanto, cuanto más precisamente describa
                  o articule mentalmente el resultado final, mayor será la
                  probabilidad de obtener lo que desea.{'\n\n'}
                  <span className="font-semibold text-base">
                    La regla principal:
                  </span>
                  {'\n'}
                  El pacto debe hacerse conscientemente, de lo contrario solo se
                  hará daño a sí mismo.
                </p>
              ) : (
                <p className="whitespace-pre-line text-justify font-sans">
                  <span className="font-semibold text-base">Goal:</span>
                  {'\n'}
                  It must be formulated clearly and in as much detail as
                  possible. The desire can be absolutely anything, but the
                  Universe loves to joke. Therefore, the more precisely you
                  mentally describe or articulate the end result, the more
                  likely you are to get what you want.{'\n\n'}
                  <span className="font-semibold text-base">
                    The main rule:
                  </span>
                  {'\n'}
                  The covenant must be made consciously, otherwise you will only
                  harm yourself.
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
    <div className="min-h-screen flex flex-col relative pb-20">
      <StarField starCount={100} />

      {showStandardLayout && (
        <>
          <PageHeader
            title={t.createPact?.title || 'Create Ascesis'}
            onBackClick={handleBack}
          />

          {/* Main content */}
          <div className="relative z-10 flex-1 flex flex-col px-4 pt-20 py-4 mx-auto w-full items-center justify-center">
            {renderStep()}
          </div>

          {/* Bottom */}
          <div className="relative z-10 p-4 max-w-lg mx-auto w-full text-center mb-4">
            <div className="flex justify-between items-center mb-6">
              {[0, 1, 2, 3].map(i => (
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
                {t.createPact?.nextButton || 'Next'}
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
