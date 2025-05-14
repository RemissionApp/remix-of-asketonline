
import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { WorkSection, LoveSection, HealthSection, AdviceSection } from './HoroscopeSections';
import { useHoroscopeFetcher } from './horoscope/useHoroscopeFetcher';
import { HoroscopeHeader } from './horoscope/HoroscopeHeader';
import { AdditionalInfo } from './horoscope/AdditionalInfo';
import { HoroscopeSkeleton } from './horoscope/HoroscopeSkeleton';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface DetailedHoroscopeDisplayProps {
  className?: string;
}

export const DetailedHoroscopeDisplay: React.FC<DetailedHoroscopeDisplayProps> = ({ className }) => {
  const { userProfile, language, isDeveloperMode } = useAppStore();
  const { toast } = useToast();
  const [generatingCustom, setGeneratingCustom] = useState(false);
  
  const { 
    horoscopeSections, 
    additionalInfo, 
    loading, 
    refreshing, 
    handleRefresh,
    zodiacSign,
    fetchCustomHoroscope
  } = useHoroscopeFetcher();
  
  const userName = userProfile?.name || 'Искатель';
  const currentDate = new Date().toLocaleDateString(
    language === 'ru' ? 'ru-RU' : 
    language === 'es' ? 'es-ES' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
  
  const handleGenerateCustomRussian = async () => {
    if (!zodiacSign) return;
    
    setGeneratingCustom(true);
    
    const customPrompt = `Ты - опытный астролог в известном астрологическом издании AstroZodiac. Твоя задача - составить структурированный гороскоп на сегодня в заботливом, но реалистичном тоне.

Разбей гороскоп на следующие блоки:

1. 💼 Работа и финансы — опиши, какие тенденции ждут в деловой сфере, нужно ли быть активным, чего избегать, возможны ли поступления или задержки.
2. 💖 Любовь и отношения — дай советы для тех, кто в паре, и для одиноких. Отрази возможные эмоциональные моменты.
3. 🧘‍♂️ Здоровье и самочувствие — оцени состояние, уровень энергии, необходимость отдыха.
4. 🌟 Совет дня — короткая мудрая рекомендация или настрой, полезный на весь день.

Тон — заботливый, реалистичный, как от опытного астролога. Можно использовать эмодзи в заголовках.`;
    
    try {
      await fetchCustomHoroscope(customPrompt);
      toast({
        title: "Гороскоп сгенерирован",
        description: "Новый гороскоп успешно сгенерирован с использованием заданного промпта",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать гороскоп по заданному промпту",
        variant: "destructive"
      });
    } finally {
      setGeneratingCustom(false);
    }
  };
  
  if (loading) {
    return <HoroscopeSkeleton className={className} />;
  }
  
  const isPro = userProfile?.isPro || false;
  
  return (
    <div className={`p-4 ${className}`}>
      <HoroscopeHeader 
        userName={userName}
        currentDate={currentDate}
        zodiacSign={zodiacSign}
        isPro={isPro}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
        language={language}
      />
      
      {/* Developer mode button */}
      {isDeveloperMode && (
        <div className="mb-4 bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md">
          <p className="text-xs mb-2">Developer Mode</p>
          <Button 
            onClick={handleGenerateCustomRussian}
            disabled={generatingCustom || refreshing} 
            size="sm"
            variant="outline"
            className="w-full text-xs"
          >
            {generatingCustom ? 'Генерация...' : 'Генерировать гороскоп по промпту AstroZodiac'}
          </Button>
        </div>
      )}
      
      {/* Horoscope sections */}
      <div className="space-y-6">
        <WorkSection content={horoscopeSections.work} />
        <LoveSection content={horoscopeSections.love} />
        <HealthSection content={horoscopeSections.health} />
        <AdviceSection content={horoscopeSections.advice} />
      </div>
      
      {/* Additional info */}
      <AdditionalInfo additionalInfo={additionalInfo} />
      
      <div className="mt-6 text-center text-cosmic-accent text-sm italic">
        <p>Пусть твой день будет продуктивным и гармоничным!</p>
      </div>
    </div>
  );
};
