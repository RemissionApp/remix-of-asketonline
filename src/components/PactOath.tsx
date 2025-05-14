import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import type { SupportedLanguage } from '@/i18n/translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [readConfirmed, setReadConfirmed] = useState(false);
  const { t } = useTranslations();
  const { language, userProfile } = useAppStore();
  const { toast } = useToast();
  const userName = userProfile?.name || '';

  const getOathText = () => {
    if (language === 'ru') {
      return `Я, ${userName}, заявляю перед Вселенной, Землёй и Небом о своём намерении взять аскезу от ${formatRejection(title)} на ${duration} ${getDaysText(duration)}.

Я осознанно отказываюсь от временного, чтобы открыть путь вечному.

Всю освободившуюся энергию и плоды моей аскезы я направляю на исполнение моего желания ${formatReward(reward)}.

Во благо себе, во благо миру. Да будет так. Благодарю. Благодарю. Благодарю.`;
    } else if (language === 'es') {
      return `Yo, ${userName}, declaro ante el Universo, la Tierra y el Cielo mi intención de tomar ascesis de ${formatRejection(title)} durante ${duration} ${t.pactOath.days}.

Renuncio conscientemente a lo temporal para abrir el camino a lo eterno.

Dirijo toda la energía liberada y los frutos de mi ascesis hacia el cumplimiento de mi deseo ${formatReward(reward)}.

Por mi bien, por el bien del mundo. Que así sea. Gracias. Gracias. Gracias.`;
    } else {
      return `I, ${userName}, declare before the Universe, Earth, and Sky my intention to take ascesis from ${formatRejection(title)} for ${duration} ${t.pactOath.days}.

I consciously reject the temporary to open the path to the eternal.

I direct all the freed energy and fruits of my ascesis toward the fulfillment of my desire ${formatReward(reward)}.

For my good, for the good of the world. So be it. Thank you. Thank you. Thank you.`;
    }
  };

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
  
  // Функция для правильного отображени�� отказа пользователя с учетом языка
  const formatRejection = (rejection: string): string => {
    // Проверяем, является ли строка предустановленным значением из списка
    const predefinedOptions: Record<string, Record<string, string>> = {
      ru: {
        'sugar': 'сахара',
        'phone_after_22': 'телефона после 22:00',
        'cigarettes': 'сигарет',
        'procrastination': 'прокрастинации',
        'social_media': 'социальных сетей',
        'alcohol': 'алкоголя',
        'junk_food': 'фастфуда'
      },
      en: {
        'sugar': 'sugar',
        'phone_after_22': 'phone after 10 PM',
        'cigarettes': 'cigarettes',
        'procrastination': 'procrastination',
        'social_media': 'social media',
        'alcohol': 'alcohol',
        'junk_food': 'junk food'
      },
      es: {
        'sugar': 'azúcar',
        'phone_after_22': 'teléfono después de las 22:00',
        'cigarettes': 'cigarrillos',
        'procrastination': 'procrastinación',
        'social_media': 'redes sociales',
        'alcohol': 'alcohol',
        'junk_food': 'comida rápida'
      }
    };
    
    // Если отказ содержит разделители, значит это несколько отказов
    if (rejection.includes(',')) {
      const items = rejection.split(',').map(item => item.trim());
      
      const translatedItems = items.map(item => {
        const translations = predefinedOptions[language as SupportedLanguage];
        return translations[item] || item;
      });
      
      // Соединяем переведенные элементы по правилам языка
      if (language === 'ru') {
        return translatedItems.join(', ');
      } else {
        return translatedItems.join(', ');
      }
    } else {
      // Это одиночный отказ
      const translations = predefinedOptions[language as SupportedLanguage];
      return translations[rejection] || rejection;
    }
  };
  
  // Функция для правильного отображения желания пользователя с учетом языка и склонения
  const formatReward = (rewardText: string): string => {
    // Для русского языка нужно проверить, начинается ли текст с прописной буквы
    // и нужно ли добавлять скобки
    if (language === 'ru') {
      let formattedReward = rewardText.trim();
      
      // Если текст не начинается со скобки, добавляем скобки
      if (!formattedReward.startsWith('(') && !formattedReward.endsWith(')')) {
        formattedReward = `(${formattedReward})`;
      }
      
      return formattedReward;
    } else {
      // Для других языков просто возвращаем в скобках
      return `(${rewardText})`;
    }
  };

  const handleReadAloud = () => {
    setDialogOpen(true);
    setReadConfirmed(false); // Reset the confirmation when dialog opens
  };

  const handleConfirmReading = () => {
    setReadConfirmed(true);
  };

  const handleSignContract = () => {
    setDialogOpen(false);
    toast({
      title: language === 'ru' ? 'Договор подписан' : language === 'es' ? 'Pacto firmado' : 'Covenant signed',
      description: language === 'ru' ? 'Ваша аскеза начинается сейчас' : language === 'es' ? 'Tu ascesis comienza ahora' : 'Your ascesis begins now',
    });
    onConfirm();
  };

  const getDialogInstructions = () => {
    if (language === 'ru') {
      return "Прочтите свой обет аскезы вслух. Произнося эти слова, вы заключаете священный договор с Вселенной.";
    } else if (language === 'es') {
      return "Lee tu voto de ascesis en voz alta. Al pronunciar estas palabras, estás haciendo un pacto sagrado con el Universo.";
    } else {
      return "Read your ascesis vow aloud. By speaking these words, you are making a sacred covenant with the Universe.";
    }
  };

  const getConfirmButtonText = () => {
    if (language === 'ru') {
      return "Я прочитал(а) вслух и подтверждаю";
    } else if (language === 'es') {
      return "He leído en voz alta y confirmo";
    } else {
      return "I have read aloud and confirm";
    }
  };

  const getSignButtonText = () => {
    if (language === 'ru') {
      return "Подписать договор";
    } else if (language === 'es') {
      return "Firmar contrato";
    } else {
      return "Sign Contract";
    }
  };

  const getReadAloudButtonText = () => {
    if (language === 'ru') {
      return "Прочитать вслух";
    } else if (language === 'es') {
      return "Leer en voz alta";
    } else {
      return "Read Aloud";
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
              {getOathText()}
            </p>
          </div>
          
          <CosmicButton onClick={handleReadAloud} className="w-full">
            {getReadAloudButtonText()}
          </CosmicButton>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="bg-cosmic-dark border-cosmic-accent text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="cosmic-gradient-text text-xl">
                  {t.pactOath.title}
                </DialogTitle>
                <DialogDescription className="text-cosmic-secondary">
                  {getDialogInstructions()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4 p-4 bg-cosmic-dark/50 border border-cosmic-accent/30 rounded-md max-h-60 overflow-y-auto">
                <p className="whitespace-pre-line">
                  {getOathText()}
                </p>
              </div>
              
              <div className="flex flex-col gap-4 mt-4 w-full">
                <Button 
                  onClick={!readConfirmed ? handleConfirmReading : undefined} 
                  className={`w-full py-3 ${readConfirmed ? "bg-green-600 hover:bg-green-600" : "bg-green-600 hover:bg-green-700"} text-white`}
                  disabled={readConfirmed}
                >
                  {getConfirmButtonText()}
                </Button>
                
                {readConfirmed && (
                  <Button 
                    onClick={handleSignContract} 
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {getSignButtonText()}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
