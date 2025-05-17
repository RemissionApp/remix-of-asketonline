
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
    <div 
      className="cosmic-block relative overflow-hidden flex flex-col bg-cosmic-dark/70 backdrop-blur-sm border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto"
      style={{
        backgroundImage: 'url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//un1.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 bg-cosmic-dark/60 backdrop-blur-sm"></div>
      
      <div className="flex items-center z-10 mb-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cosmic-accent/20 mr-3">
          <MessageSquare size={20} className="text-cosmic-accent" />
        </div>
        <div>
          <h3 className="text-cosmic-accent text-base font-medium">
            {t.universe?.chatTitle || "Диалог со Вселенной"}
          </h3>
          <p className="text-sm text-cosmic-secondary">
            {t.universe?.chatDescription || "Задайте вопрос Вселенной"}
          </p>
        </div>
      </div>
      
      {userProfile?.isPro && userProfile?.birthDate && (
        <div className="z-10 mb-3 mt-1 px-2">
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
              <p className="text-sm text-cosmic-secondary italic">
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
      
      <CosmicButton 
        onClick={handleChatClick} 
        size="sm" 
        variant="outline" 
        className="self-end mt-2 z-10"
      >
        {t.universe?.enterChat || "Начать диалог"} 
        <ArrowRight size={16} />
      </CosmicButton>
    </div>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title="Диалог со Вселенной"
        message="Разблокируй PRO чтобы вести диалог со Вселенной"
        className="mb-6 w-full max-w-lg mx-auto"
      >
        {messageContent}
      </ProFeatureOverlay>
    );
  }
  
  return messageContent;
};
