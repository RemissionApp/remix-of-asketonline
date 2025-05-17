
import React, { useEffect, useState } from 'react';
import { MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { CosmicButton } from '@/components/CosmicButton';
import { getZodiacSign } from '@/utils/zodiac';
import { generateUniverseAnswer } from '@/utils/universeMessages';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Component that displays a daily universe message (horoscope) and provides
 * an entry point to the Universe Chat feature
 */
export const UniverseMessageBlock: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [dailyHoroscope, setDailyHoroscope] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Only fetch horoscope if user is PRO and has birthdate
    if (userProfile?.isPro && userProfile?.birthDate) {
      const fetchDailyHoroscope = async () => {
        setIsLoading(true);
        try {
          // Get zodiac sign
          const sign = getZodiacSign(new Date(userProfile.birthDate!));
          if (!sign) {
            throw new Error("Could not determine zodiac sign");
          }
          
          // Try to get cached horoscope
          const today = new Date().toISOString().split('T')[0];
          const cachedHoroscope = localStorage.getItem(`daily_horoscope_${sign}_${today}_${language}`);
          
          if (cachedHoroscope) {
            setDailyHoroscope(cachedHoroscope);
            setIsLoading(false);
            return;
          }
          
          // Generate horoscope
          const horoscope = await generateUniverseAnswer(
            language === 'ru' ? 
              `Дай мне краткий гороскоп на сегодня для знака ${sign}` :
              language === 'es' ?
              `Dame un breve horóscopo para hoy para el signo ${sign}` :
              `Give me a brief horoscope for today for ${sign}`
          );
          
          setDailyHoroscope(horoscope);
          localStorage.setItem(`daily_horoscope_${sign}_${today}_${language}`, horoscope);
        } catch (error) {
          console.error("Error fetching horoscope:", error);
          // Use placeholder text if error
          setDailyHoroscope(
            language === 'ru' ? 
              'Звезды сегодня благоволят тебе. Нажми, чтобы узнать больше...' :
              language === 'es' ?
              'Las estrellas te favorecen hoy. Haz clic para saber más...' :
              'The stars favor you today. Click to learn more...'
          );
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDailyHoroscope();
    }
  }, [userProfile?.isPro, userProfile?.birthDate, language]);
  
  const handleChatClick = () => {
    navigate('/universe-chat');
  };
  
  const messageContent = (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6">
      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <MessageSquare size={20} className="text-cosmic-accent" />
          </div>
          <div>
            <h3 className={language === 'en' ? "font-serif font-medium" : "font-sans font-medium"}>
              {t.universe?.chatTitle || "Диалог со Вселенной"}
            </h3>
          </div>
        </div>
        
        {userProfile?.isPro && (
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-20 w-full bg-cosmic-accent/10 rounded-md" />
            ) : (
              <>
                <div className="flex items-center mb-2">
                  <Sparkles size={16} className="text-cosmic-gold mr-2" />
                  <h4 className="text-cosmic-gold text-xs">
                    {language === 'ru' ? 'ПОСЛАНИЕ ВСЕЛЕННОЙ' : 
                     language === 'es' ? 'MENSAJE DEL UNIVERSO' : 'UNIVERSE MESSAGE'}
                  </h4>
                </div>
                <p className="text-white text-base font-sans leading-relaxed">
                  {dailyHoroscope || (
                    language === 'ru' ? 'Загрузка послания...' : 
                    language === 'es' ? 'Cargando mensaje...' : 
                    'Loading message...'
                  )}
                </p>
              </>
            )}
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <CosmicButton 
            onClick={handleChatClick} 
            size="sm" 
            variant="outline"
          >
            {t.universe?.enterChat || "Начать диалог"} 
            <ArrowRight size={16} className="ml-2" />
          </CosmicButton>
        </div>
      </div>
    </div>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title={t.universe?.chatProTitle || "Диалог со Вселенной"}
        message={t.universe?.chatProMessage || "Разблокируй PRO чтобы вести диалог со Вселенной"}
        className="mb-6 w-full max-w-lg mx-auto"
      >
        {messageContent}
      </ProFeatureOverlay>
    );
  }
  
  return messageContent;
};
