
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { WorkSection, LoveSection, HealthSection, AdviceSection, parseHoroscopeSections } from './HoroscopeSections';
import { toast } from "sonner";

interface DetailedHoroscopeDisplayProps {
  className?: string;
}

export const DetailedHoroscopeDisplay: React.FC<DetailedHoroscopeDisplayProps> = ({ className }) => {
  const { userProfile, language } = useAppStore();
  const [horoscope, setHoroscope] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [horoscopeSections, setHoroscopeSections] = useState<{
    work: string;
    love: string;
    health: string;
    advice: string;
  }>({
    work: '',
    love: '',
    health: '',
    advice: ''
  });
  const [additionalInfo, setAdditionalInfo] = useState<{
    lucky_number: string;
    lucky_time: string;
    color: string;
    mood: string;
  }>({
    lucky_number: '',
    lucky_time: '',
    color: '',
    mood: ''
  });
  
  // Get user's name or use default
  const userName = userProfile?.name || 'Искатель';
  
  // Format current date based on language
  const currentDate = new Date().toLocaleDateString(
    language === 'ru' ? 'ru-RU' : 
    language === 'es' ? 'es-ES' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
  
  // Get user zodiac sign
  const zodiacSign = getZodiacSign(userProfile?.birthDate || null);
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      
      try {
        // Check for cached detailed horoscope in localStorage
        const storedHoroscope = localStorage.getItem('detailedHoroscope');
        const storedDate = localStorage.getItem('detailedHoroscopeDate');
        const today = new Date().toDateString();
        
        if (storedHoroscope && storedDate === today) {
          const parsedData = JSON.parse(storedHoroscope);
          setHoroscope(parsedData.description || '');
          setHoroscopeSections(parseHoroscopeSections(parsedData.description || ''));
          
          if (parsedData.lucky_number) {
            setAdditionalInfo({
              lucky_number: parsedData.lucky_number,
              lucky_time: parsedData.lucky_time,
              color: parsedData.color,
              mood: parsedData.mood
            });
          }
          
          setLoading(false);
          return;
        }
        
        // Get user zodiac sign if available
        if (!zodiacSign) {
          throw new Error('Zodiac sign not available');
        }
        
        // Try to fetch from edge function
        try {
          const response = await fetch('/api/generate-horoscope', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              sign: zodiacSign,
              language: language,
              detailed: true
            })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch from API: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success && data.data) {
            setHoroscope(data.data.description || '');
            setHoroscopeSections(parseHoroscopeSections(data.data.description || ''));
            
            // Set additional info
            setAdditionalInfo({
              lucky_number: data.data.lucky_number || '',
              lucky_time: data.data.lucky_time || '',
              color: data.data.color || '',
              mood: data.data.mood || ''
            });
            
            // Cache the response
            localStorage.setItem('detailedHoroscope', JSON.stringify(data.data));
            localStorage.setItem('detailedHoroscopeDate', today);
            
            setLoading(false);
            return;
          }
          
          throw new Error('Invalid response from API');
        } catch (error) {
          console.error('Error fetching horoscope from API:', error);
          // Continue to fallback method
        }
        
        // Generate fallback horoscope
        const fallbackHoroscope = generateFallbackHoroscope(zodiacSign, language);
        setHoroscope(fallbackHoroscope.description);
        setHoroscopeSections(parseHoroscopeSections(fallbackHoroscope.description));
        
        setAdditionalInfo({
          lucky_number: fallbackHoroscope.lucky_number,
          lucky_time: fallbackHoroscope.lucky_time,
          color: fallbackHoroscope.color,
          mood: fallbackHoroscope.mood
        });
        
        // Cache the fallback horoscope
        localStorage.setItem('detailedHoroscope', JSON.stringify(fallbackHoroscope));
        localStorage.setItem('detailedHoroscopeDate', today);
        
      } catch (error) {
        console.error('Error in horoscope generation:', error);
        toast.error("Произошла ошибка при получении гороскопа");
        
        // Set default content if everything fails
        const defaultSections = {
          work: 'Сегодня благоприятный день для деловых начинаний. Доверяйте своей интуиции при принятии финансовых решений.',
          love: 'Проявите внимание к партнеру. Одиноким звезды советуют быть более открытыми для новых знакомств.',
          health: 'Следите за своим эмоциональным состоянием. Небольшая прогулка на свежем воздухе поможет восстановить силы.',
          advice: 'Сегодня хороший день для планирования будущего. Запишите свои цели и мечты.'
        };
        
        setHoroscopeSections(defaultSections);
        setAdditionalInfo({
          lucky_number: String(Math.floor(Math.random() * 100)),
          lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
          color: language === 'ru' ? ['красный', 'синий', 'зеленый', 'желтый', 'фиолетовый'][Math.floor(Math.random() * 5)] : 
                 ['red', 'blue', 'green', 'yellow', 'purple'][Math.floor(Math.random() * 5)],
          mood: language === 'ru' ? ['спокойный', 'энергичный', 'задумчивый', 'творческий'][Math.floor(Math.random() * 4)] :
                ['calm', 'energetic', 'reflective', 'creative'][Math.floor(Math.random() * 4)]
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (userProfile?.birthDate) {
      fetchHoroscope();
    } else {
      // No birth date set
      setLoading(false);
      toast.error("Дата рождения не указана. Пожалуйста, заполните профиль.");
    }
  }, [userProfile?.birthDate, language, zodiacSign]);
  
  if (loading) {
    return (
      <div className={`text-center p-6 ${className}`}>
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-6 bg-cosmic-accent/20 rounded w-3/4"></div>
          <div className="space-y-2 w-full">
            <div className="h-4 bg-cosmic-accent/20 rounded w-5/6"></div>
            <div className="h-4 bg-cosmic-accent/20 rounded w-full"></div>
            <div className="h-4 bg-cosmic-accent/20 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // If no birth date is set
  if (!userProfile?.birthDate) {
    return (
      <div className={`text-center p-6 ${className}`}>
        <h3 className="text-cosmic-gold mb-2">Необходимо указать дату рождения</h3>
        <p className="text-cosmic-secondary">
          Пожалуйста, укажите дату рождения в профиле, чтобы получить персональный гороскоп.
        </p>
      </div>
    );
  }
  
  return (
    <div className={`p-4 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-xl text-cosmic-gold font-serif mb-1">
          {userName}, это твой день!
        </h2>
        <p className="text-cosmic-accent text-sm">
          {currentDate}
        </p>
      </div>
      
      {/* Zodiac sign display */}
      {zodiacInfo && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-cosmic-accent/10 px-4 py-2 rounded-full">
            <span className="text-2xl">{zodiacInfo.symbol}</span>
            <span className="text-white">{zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en}</span>
          </div>
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
      <div className="mt-8 bg-cosmic-accent/5 rounded-lg p-4 border border-cosmic-accent/20">
        <h3 className="text-cosmic-gold text-center mb-3">
          {language === 'ru' ? 'Дополнительно' : language === 'es' ? 'Adicional' : 'Additional'}
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-cosmic-accent">🎲</span>
            <span className="text-cosmic-secondary">
              {language === 'ru' ? 'Счастливое число:' : language === 'es' ? 'Número de la suerte:' : 'Lucky number:'}
            </span>
            <span className="text-white">{additionalInfo.lucky_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cosmic-accent">🕒</span>
            <span className="text-cosmic-secondary">
              {language === 'ru' ? 'Время удачи:' : language === 'es' ? 'Hora de la suerte:' : 'Lucky time:'}
            </span>
            <span className="text-white">{additionalInfo.lucky_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cosmic-accent">🎨</span>
            <span className="text-cosmic-secondary">
              {language === 'ru' ? 'Цвет дня:' : language === 'es' ? 'Color del día:' : 'Color of the day:'}
            </span>
            <span className="text-white">{additionalInfo.color}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cosmic-accent">💫</span>
            <span className="text-cosmic-secondary">
              {language === 'ru' ? 'Настроение:' : language === 'es' ? 'Estado de ánimo:' : 'Mood:'}
            </span>
            <span className="text-white">{additionalInfo.mood}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-cosmic-accent text-sm italic">
        <p>
          {language === 'ru' ? 'Пусть твой день будет продуктивным и гармоничным!' : 
           language === 'es' ? '¡Que tu día sea productivo y armonioso!' : 
           'May your day be productive and harmonious!'}
        </p>
      </div>
    </div>
  );
};

// Helper function to generate a fallback horoscope
function generateFallbackHoroscope(sign: string, language: string) {
  // Structured data for different zodiac signs
  const fallbackData: Record<string, any> = {
    aries: {
      ru: {
        work: '💼 Работа и финансы\nСегодня вам стоит сосредоточиться на завершении текущих проектов, не начиная новых. Возможны неожиданные финансовые поступления или выгодные предложения. Будьте внимательны при подписании документов.',
        love: '💖 Любовь и отношения\nВ личной жизни наступает период гармонии. Если вы в отношениях, уделите время партнеру. Одиноким Овнам звезды советуют быть более открытыми — возможна судьбоносная встреча.',
        health: '🧘‍♂️ Здоровье и самочувствие\nЭнергетический потенциал высокий, но не перенапрягайтесь. Обратите внимание на режим питания и сон. Полезны будут умеренные физические нагрузки и прогулки на свежем воздухе.',
        advice: '🌟 Совет дня\nДоверьтесь своей интуиции в принятии важных решений. Сегодня ваше шестое чувство особенно обострено и поможет сделать правильный выбор.'
      },
      en: {
        work: '💼 Work and Finance\nToday you should focus on completing ongoing projects rather than starting new ones. There may be unexpected financial income or advantageous offers. Be careful when signing documents.',
        love: '💖 Love and Relationships\nA period of harmony begins in your personal life. If you\'re in a relationship, spend time with your partner. Single Aries are advised by the stars to be more open — a fateful meeting is possible.',
        health: '🧘‍♂️ Health and Well-being\nYour energy potential is high, but don\'t overexert yourself. Pay attention to your diet and sleep. Moderate physical activity and walks in the fresh air will be beneficial.',
        advice: '🌟 Advice of the Day\nTrust your intuition when making important decisions. Today your sixth sense is especially acute and will help you make the right choice.'
      },
      es: {
        work: '💼 Trabajo y Finanzas\nHoy debes centrarte en completar proyectos en curso en lugar de comenzar otros nuevos. Pueden surgir ingresos financieros inesperados u ofertas ventajosas. Ten cuidado al firmar documentos.',
        love: '💖 Amor y Relaciones\nUn período de armonía comienza en tu vida personal. Si estás en una relación, dedica tiempo a tu pareja. A los Aries solteros, las estrellas les aconsejan ser más abiertos — es posible un encuentro fatídico.',
        health: '🧘‍♂️ Salud y Bienestar\nTu potencial energético es alto, pero no te sobreesfuerces. Presta atención a tu dieta y sueño. La actividad física moderada y los paseos al aire libre serán beneficiosos.',
        advice: '🌟 Consejo del Día\nConfía en tu intuición al tomar decisiones importantes. Hoy tu sexto sentido está especialmente agudo y te ayudará a tomar la decisión correcta.'
      }
    }
  };
  
  // Default sections if specific sign data isn't available
  const defaultSections = {
    ru: {
      work: '💼 Работа и финансы\nСегодня благоприятный день для деловых начинаний. Доверяйте своей интуиции при принятии финансовых решений. Возможны интересные предложения о сотрудничестве.',
      love: '💖 Любовь и отношения\nПроявите внимание к своему партнеру, это укрепит ваши отношения. Одиноким звезды советуют быть более открытыми для новых знакомств и не бояться проявлять инициативу.',
      health: '🧘‍♂️ Здоровье и самочувствие\nСледите за своим эмоциональным состоянием. Небольшая прогулка на свежем воздухе или медитация поможет восстановить внутренний баланс и энергию.',
      advice: '🌟 Совет дня\nФокусируйтесь на позитивных аспектах жизни и избегайте негативных мыслей. То, на что вы обращаете внимание, имеет тенденцию расти и развиваться.'
    },
    en: {
      work: '💼 Work and Finance\nToday is a favorable day for business initiatives. Trust your intuition when making financial decisions. Interesting cooperation offers may come your way.',
      love: '💖 Love and Relationships\nShow attention to your partner, it will strengthen your relationship. Singles are advised by the stars to be more open to new acquaintances and not afraid to take initiative.',
      health: '🧘‍♂️ Health and Well-being\nMonitor your emotional state. A short walk in the fresh air or meditation will help restore inner balance and energy.',
      advice: '🌟 Advice of the Day\nFocus on the positive aspects of life and avoid negative thoughts. What you pay attention to tends to grow and develop.'
    },
    es: {
      work: '💼 Trabajo y Finanzas\nHoy es un día favorable para iniciativas comerciales. Confía en tu intuición al tomar decisiones financieras. Pueden surgir ofertas de cooperación interesantes.',
      love: '💖 Amor y Relaciones\nMuestra atención a tu pareja, fortalecerá tu relación. A los solteros, las estrellas les aconsejan estar más abiertos a nuevos conocidos y no tener miedo de tomar la iniciativa.',
      health: '🧘‍♂️ Salud y Bienestar\nVigila tu estado emocional. Un paseo corto al aire libre o la meditación ayudarán a restaurar el equilibrio interno y la energía.',
      advice: '🌟 Consejo del Día\nCéntrate en los aspectos positivos de la vida y evita pensamientos negativos. Aquello a lo que prestas atención tiende a crecer y desarrollarse.'
    }
  };
  
  // Get sections for the specific sign or use defaults
  const sections = fallbackData[sign]?.[language] || defaultSections[language as keyof typeof defaultSections] || defaultSections.en;
  
  // Combine sections into a single description
  const description = `${sections.work}\n\n${sections.love}\n\n${sections.health}\n\n${sections.advice}`;
  
  // Generate random values for additional info
  const colors = {
    ru: ['красный', 'синий', 'зеленый', 'желтый', 'фиолетовый', 'оранжевый', 'голубой', 'розовый'],
    en: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'pink'],
    es: ['rojo', 'azul', 'verde', 'amarillo', 'púrpura', 'naranja', 'cian', 'rosa']
  };
  
  const moods = {
    ru: ['спокойный', 'энергичный', 'задумчивый', 'творческий', 'вдохновленный', 'сосредоточенный'],
    en: ['calm', 'energetic', 'reflective', 'creative', 'inspired', 'focused'],
    es: ['tranquilo', 'enérgico', 'reflexivo', 'creativo', 'inspirado', 'enfocado']
  };
  
  const languageKey = (language in colors) ? language : 'en';
  
  return {
    description,
    lucky_number: String(Math.floor(Math.random() * 100)),
    lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    color: colors[languageKey as keyof typeof colors][Math.floor(Math.random() * colors[languageKey as keyof typeof colors].length)],
    mood: moods[languageKey as keyof typeof moods][Math.floor(Math.random() * moods[languageKey as keyof typeof moods].length)]
  };
}
