
import React, { useEffect, useState, useRef } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';

interface DetailedHoroscope {
  description: string;
  sections?: {
    work_finance: string;
    love_relationships: string;
    health_wellbeing: string;
    daily_advice: string;
  };
  lucky_number: string;
  lucky_time: string;
  color: string;
  mood: string;
}

interface TypingProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypingEffect: React.FC<TypingProps> = ({ text, speed = 30, className = "", onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (!text) return;
    
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, speed);
    
    return () => clearInterval(typingInterval);
  }, [text, speed, onComplete]);
  
  return (
    <div className={className}>
      {displayedText}
      {isTyping && <span className="typing-cursor">|</span>}
    </div>
  );
};

const DetailedHoroscopePage: React.FC = () => {
  const [horoscope, setHoroscope] = useState<DetailedHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const { userProfile, language } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get zodiac sign info
  const zodiacSign = userProfile?.birthDate ? getZodiacSign(userProfile.birthDate) : null;
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  // Translations
  const translations = {
    title: {
      ru: `${userProfile?.name || 'Искатель'}, это твой день!`,
      en: `${userProfile?.name || 'Seeker'}, this is your day!`,
      es: `${userProfile?.name || 'Buscador'}, ¡este es tu día!`
    },
    backButton: {
      ru: 'Назад',
      en: 'Back',
      es: 'Atrás'
    },
    loading: {
      ru: 'Раскрываем тайны звезд...',
      en: 'Revealing the mysteries of the stars...',
      es: 'Revelando los misterios de las estrellas...'
    },
    luckyNumber: {
      ru: 'Счастливое число',
      en: 'Lucky Number',
      es: 'Número de la Suerte'
    },
    luckyTime: {
      ru: 'Удачное время',
      en: 'Lucky Time',
      es: 'Hora de la Suerte'
    },
    color: {
      ru: 'Цвет дня',
      en: 'Color of the Day',
      es: 'Color del Día'
    },
    mood: {
      ru: 'Настроение',
      en: 'Mood',
      es: 'Estado de Ánimo'
    },
    workFinance: {
      ru: 'Работа и финансы',
      en: 'Work and Finance',
      es: 'Trabajo y Finanzas'
    },
    loveRelationships: {
      ru: 'Любовь и отношения',
      en: 'Love and Relationships',
      es: 'Amor y Relaciones'
    },
    healthWellbeing: {
      ru: 'Здоровье и самочувствие', 
      en: 'Health and Wellbeing',
      es: 'Salud y Bienestar'
    },
    dailyAdvice: {
      ru: 'Совет дня',
      en: 'Daily Advice',
      es: 'Consejo del Día'
    },
    proTitle: {
      ru: `${userProfile?.name || 'Искатель'}, это твой день!`,
      en: `${userProfile?.name || 'Seeker'}, this is your day!`,
      es: `${userProfile?.name || 'Buscador'}, ¡este es tu día!`
    },
    proMessage: {
      ru: 'Узнайте, что звезды приготовили для вас сегодня в полной версии',
      en: 'Discover what the stars have prepared for you today in the full version',
      es: 'Descubre lo que las estrellas han preparado para ti hoy en la versión completa'
    }
  };
  
  // Create a helper function to get today's date as a string
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  // Check if the horoscope is from today
  const isHoroscopeFromToday = (storedDate: string) => {
    return storedDate === getTodayDateString();
  };

  useEffect(() => {
    const fetchDetailedHoroscope = async () => {
      if (!userProfile?.isPro) {
        // For non-PRO users, just set loading to false without fetching
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Check if user has birth date to determine zodiac sign
        if (!userProfile?.birthDate || !zodiacSign) {
          setLoading(false);
          return;
        }
        
        // Try to get cached detailed horoscope for today
        const today = getTodayDateString();
        const cachedHoroscopeKey = `horoscope_${zodiacSign}_${today}_detailed`;
        const cachedHoroscopeDateKey = `horoscope_${zodiacSign}_date_detailed`;
        const cachedHoroscopeData = localStorage.getItem(cachedHoroscopeKey);
        const cachedHoroscopeDate = localStorage.getItem(cachedHoroscopeDateKey);
        
        // Use cached horoscope if it exists and is from today
        if (cachedHoroscopeData && cachedHoroscopeDate && isHoroscopeFromToday(cachedHoroscopeDate)) {
          setHoroscope(JSON.parse(cachedHoroscopeData));
          setLoading(false);
          return;
        }
        
        // Call our edge function to generate a detailed horoscope
        const { data, error } = await supabase.functions.invoke('fetch-horoscope', {
          body: { 
            sign: zodiacSign,
            language,
            detailed: true
          }
        });
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch detailed horoscope');
        }
        
        if (!data.success) {
          throw new Error('Invalid response from fetch-horoscope function');
        }
        
        // Set the horoscope data
        setHoroscope(data.data);
        
        // Cache the horoscope with today's date
        localStorage.setItem(cachedHoroscopeKey, JSON.stringify(data.data));
        localStorage.setItem(cachedHoroscopeDateKey, today);
      } catch (error) {
        console.error('Error fetching detailed horoscope:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
        
        // Generate fallback data in case of error
        generateFallbackHoroscope();
      } finally {
        setLoading(false);
      }
    };
    
    const generateFallbackHoroscope = () => {
      // Generate fallback data since the edge function is failing
      const generateHoroscopeText = (sign: string, lang: string): string => {
        const texts = {
          ru: {
            aries: 'Сегодня ваша энергия и решительность на пике. Используйте этот день для важных начинаний и активных действий. Доверьтесь своей интуиции в принятии решений. В личных отношениях проявите больше терпения и понимания. Финансовые вложения сегодня могут оказаться особенно удачными. Вечер лучше провести в спокойной обстановке, восстанавливая силы.',
            taurus: 'День благоприятен для материальных вопросов. Ваша практичность поможет решить финансовые проблемы. В работе возможны новые интересные предложения. Уделите внимание здоровью и правильному питанию. В личной жизни наступает период гармонии и понимания. Вечер хорош для общения с близкими людьми и создания уютной атмосферы.',
            gemini: 'Сегодня вам стоит сосредоточиться на общении и новых знакомствах. Возможно получение важной информации, которая изменит ваши планы. В работе проявите гибкость и адаптивность. Финансовое положение стабильно, но крупные траты лучше отложить. В личной жизни возможны приятные сюрпризы. Вечер подходит для интеллектуальных развлечений.',
            cancer: 'День подходит для домашних дел и заботы о близких. Ваша эмоциональная интуиция сейчас особенно сильна. В работе возможны небольшие трудности, но вы справитесь с ними с помощью коллег. Финансовое положение требует внимания и планирования. В личных отношениях проявите больше открытости. Вечер хорош для семейного ужина.',
            leo: 'Сегодня ваша харизма и лидерские качества особенно заметны. Используйте это для продвижения своих идей. В работе возможно признание ваших заслуг. Финансовое положение улучшается. В личной жизни вас ждут яркие эмоции и приятные моменты. Вечер подходит для творческой самореализации и развлечений.',
            virgo: 'День благоприятен для анализа и планирования. Ваше внимание к деталям поможет избежать ошибок. В работе сосредоточьтесь на завершении начатых проектов. Финансовое положение стабильно, но требует внимательного учета. В личной жизни возможны небольшие недопонимания. Вечер подходит для самообразования и чтения.',
            libra: 'Сегодня вам особенно важно поддерживать баланс во всех сферах жизни. В работе возможны интересные партнерские предложения. Финансовое положение улучшается благодаря вашей дипломатии. В личной жизни гармония и взаимопонимание. Вечер хорош для культурных мероприятий и общения с друзьями.',
            scorpio: 'День наполнен глубокими эмоциями и интуитивными озарениями. В работе вы можете раскрыть тайны или найти скрытые возможности. Финансовое положение требует осторожности в инвестициях. В личной жизни возможны страстные проявления чувств. Вечер подходит для медитации и самопознания.',
            sagittarius: 'Сегодня ваш оптимизм и энтузиазм заразительны. Используйте это для расширения своих горизонтов. В работе возможны новые перспективы и путешествия. Финансовое положение стабильно, но требует планирования. В личной жизни приключения и новые впечатления. Вечер хорош для философских бесед и планирования будущего.',
            capricorn: 'День благоприятен для карьерных достижений и профессионального роста. Ваша дисциплина и ответственность приносят плоды. Финансовое положение улучшается благодаря правильным решениям. В личной жизни стабильность и поддержка. Вечер подходит для планирования долгосрочных целей.',
            aquarius: 'Сегодня ваша оригинальность и нестандартное мышление особенно ценны. В работе возможны инновационные решения и неожиданные повороты. Финансовое положение связано с коллективными проектами. В личной жизни стремление к свободе и независимости. Вечер хорош для общения с единомышленниками и планирования будущего.',
            pisces: 'День наполнен творческим вдохновением и эмпатией. В работе используйте свою интуицию для решения сложных задач. Финансовое положение нестабильно, требует внимания. В личной жизни глубокая эмоциональная связь с близкими. Вечер подходит для искусства, музыки и духовных практик.'
          },
          en: { /* ... keep existing code (English translations) */ },
          es: { /* ... keep existing code (Spanish translations) */ }
        };

        const baseText = zodiacSign && lang in texts && zodiacSign in texts[lang] 
            ? texts[lang][zodiacSign]
            : 'Звезды сегодня особенно благосклонны к вам. Воспользуйтесь этой энергией для достижения своих целей и мечтаний.';
        
        // Generate structured sections
        return baseText;
      };

      const baseText = generateHoroscopeText(zodiacSign || 'aries', language);
      
      // Generate fallback horoscope with sections
      const fallbackHoroscope: DetailedHoroscope = {
        description: baseText,
        sections: {
          work_finance: `💼 ${translations.workFinance[language] || translations.workFinance.en}: Сегодня благоприятный день для профессиональных начинаний. Доверяйте своей интуиции в финансовых вопросах.`,
          love_relationships: `❤️ ${translations.loveRelationships[language] || translations.loveRelationships.en}: Проявите больше внимания к партнеру. Одиноким звезды сулят интересное знакомство.`,
          health_wellbeing: `🌿 ${translations.healthWellbeing[language] || translations.healthWellbeing.en}: Уделите время своему физическому и эмоциональному благополучию. Прогулка на природе принесет вдохновение.`,
          daily_advice: `✨ ${translations.dailyAdvice[language] || translations.dailyAdvice.en}: Доверьтесь потоку. То, что кажется препятствием, может оказаться дверью к новым возможностям.`,
        },
        lucky_number: Math.floor(Math.random() * 100).toString(),
        lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        color: ['красный', 'синий', 'зеленый', 'фиолетовый', 'оранжевый', 'розовый', 'золотой'][Math.floor(Math.random() * 7)],
        mood: ['радостный', 'задумчивый', 'спокойный', 'энергичный', 'вдохновленный'][Math.floor(Math.random() * 5)]
      };
      
      setHoroscope(fallbackHoroscope);
    };
    
    fetchDetailedHoroscope();
  }, [userProfile?.birthDate, userProfile?.isPro, zodiacSign, language, toast, translations]);
  
  const handleSectionComplete = () => {
    if (activeSection < 3) {
      setTimeout(() => {
        setActiveSection(activeSection + 1);
      }, 500);
    }
  };
  
  const renderDetailedHoroscope = () => {
    if (!userProfile?.isPro) {
      return (
        <ProFeatureOverlay
          title={translations.proTitle[language] || translations.proTitle.en}
          message={translations.proMessage[language] || translations.proMessage.en}
        >
          <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-cosmic-gold" size={20} />
                {translations.title[language] || translations.title.en}
              </CardTitle>
              <CardDescription>
                {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </ProFeatureOverlay>
      );
    }
    
    if (loading || !horoscope) {
      return (
        <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-cosmic-gold" size={20} />
              {translations.title[language] || translations.title.en}
            </CardTitle>
            <CardDescription>
              {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-cosmic-accent/70 italic text-center">
              {translations.loading[language] || translations.loading.en}
            </p>
            <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-cosmic-gold" size={20} />
            {translations.title[language] || translations.title.en}
          </CardTitle>
          <CardDescription>
            {zodiacInfo?.symbol} {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sectioned horoscope with typing effect */}
          <div className="space-y-4">
            {horoscope.sections && (
              <>
                {activeSection >= 0 && (
                  <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
                    <TypingEffect 
                      text={horoscope.sections.work_finance}
                      className="cosmic-gradient-text font-serif"
                      onComplete={handleSectionComplete}
                    />
                  </div>
                )}
                
                {activeSection >= 1 && (
                  <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
                    <TypingEffect 
                      text={horoscope.sections.love_relationships}
                      className="cosmic-gradient-text font-serif"
                      onComplete={handleSectionComplete}
                    />
                  </div>
                )}
                
                {activeSection >= 2 && (
                  <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
                    <TypingEffect 
                      text={horoscope.sections.health_wellbeing}
                      className="cosmic-gradient-text font-serif"
                      onComplete={handleSectionComplete}
                    />
                  </div>
                )}
                
                {activeSection >= 3 && (
                  <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
                    <TypingEffect 
                      text={horoscope.sections.daily_advice}
                      className="cosmic-gradient-text font-serif"
                    />
                  </div>
                )}
              </>
            )}
            
            {!horoscope.sections && (
              <div className="cosmic-gradient-text text-base font-serif leading-relaxed whitespace-pre-wrap">
                <TypingEffect text={horoscope.description} />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mt-6 text-cosmic-accent">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.luckyNumber[language] || translations.luckyNumber.en}:
              </span>
              <span>{horoscope.lucky_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.luckyTime[language] || translations.luckyTime.en}:
              </span>
              <span>{horoscope.lucky_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.color[language] || translations.color.en}:
              </span>
              <span>{horoscope.color}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.mood[language] || translations.mood.en}:
              </span>
              <span>{horoscope.mood}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={150} />
      <TopBar />
      
      <Button
        variant="ghost"
        className="absolute top-20 left-4 z-20 text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20"
        onClick={() => navigate('/main')}
      >
        <ArrowLeft size={16} className="mr-2" />
        {translations.backButton[language] || translations.backButton.en}
      </Button>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 mt-16">
        <div className="w-full max-w-lg">
          {renderDetailedHoroscope()}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default DetailedHoroscopePage;
