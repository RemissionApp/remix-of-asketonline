
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';

interface PactOathProps {
  title: string;
  duration: number;
  reward: string;
  onConfirm: () => void;
  onBack: () => void;
}

export const PactOath: React.FC<PactOathProps> = ({
  title,
  duration,
  reward,
  onConfirm,
  onBack
}) => {
  const [isReady, setIsReady] = useState(false);
  const { t } = useTranslations();
  const { language, user } = useAppStore();
  const userName = user?.name || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Функция для правильного склонения в русском языке
  const getDaysText = (count: number): string => {
    if (language !== 'ru') {
      return t.pactOath.days;
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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <StarField starCount={150} />
      
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/90" />
      </div>
      
      <div className="relative z-10 w-full max-w-lg p-4">
        <button
          className="absolute top-4 left-4 p-2 text-cosmic-accent"
          onClick={onBack}
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className={`text-center transition-all duration-1000 ${
          isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-3xl font-serif text-white mb-3 cosmic-gradient-text">
            {t.pactOath.title}
          </h1>
          
          <p className="text-cosmic-secondary mb-12">
            {t.pactOath.subtitle}
          </p>
          
          <div className="cosmic-card backdrop-blur-md bg-cosmic-dark/40 mb-6">
            <p className="text-white text-lg mb-6 whitespace-pre-line">
              {language === 'ru' ? (
                `Я, ${userName}, заявляю перед Вселенной, Землёй и Небом о своём намерении взять аскезу от ${title} на ${duration} ${getDaysText(duration)}.

Я осознанно отказываюсь от временного, чтобы открыть путь вечному.

Всю освободившуюся энергию и плоды моей аскезы я направляю на исполнение моего желания (${reward}).

Во благо себе, во благо миру. Да будет так. Благодарю. Благодарю. Благодарю.`
              ) : language === 'es' ? (
                `Yo, ${userName}, declaro ante el Universo, la Tierra y el Cielo mi intención de tomar ascesis de ${title} durante ${duration} ${t.pactOath.days}.

Renuncio conscientemente a lo temporal para abrir el camino a lo eterno.

Dirijo toda la energía liberada y los frutos de mi ascesis hacia el cumplimiento de mi deseo (${reward}).

Por mi bien, por el bien del mundo. Que así sea. Gracias. Gracias. Gracias.`
              ) : (
                `I, ${userName}, declare before the Universe, Earth, and Sky my intention to take ascesis from ${title} for ${duration} ${t.pactOath.days}.

I consciously reject the temporary to open the path to the eternal.

I direct all the freed energy and fruits of my ascesis toward the fulfillment of my desire (${reward}).

For my good, for the good of the world. So be it. Thank you. Thank you. Thank you.`
              )}
            </p>
          </div>
          
          <CosmicButton onClick={onConfirm} className="w-full">
            {t.pactOath.confirmButton}
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};
