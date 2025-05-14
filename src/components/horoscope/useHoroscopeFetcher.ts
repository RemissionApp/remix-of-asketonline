
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign } from '@/utils/zodiac';
import { parseHoroscopeSections } from '../HoroscopeSections';
import { useToast } from '@/hooks/use-toast';

interface HoroscopeData {
  description: string;
  lucky_number: string;
  lucky_time: string;
  color: string;
  mood: string;
}

interface UseHoroscopeFetcherResult {
  horoscope: string;
  horoscopeSections: {
    work: string;
    love: string;
    health: string;
    advice: string;
  };
  additionalInfo: {
    lucky_number: string;
    lucky_time: string;
    color: string;
    mood: string;
  };
  loading: boolean;
  refreshing: boolean;
  handleRefresh: () => void;
  zodiacSign: string | null;
  fetchCustomHoroscope: (customPrompt: string) => Promise<void>;
}

export const useHoroscopeFetcher = (): UseHoroscopeFetcherResult => {
  const { userProfile, language } = useAppStore();
  const [horoscope, setHoroscope] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { toast } = useToast();
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

  // Get user zodiac sign
  const zodiacSign = getZodiacSign(userProfile?.birthDate || null);
  
  // Function to fetch horoscope
  const fetchHoroscope = async (forceRefresh = false, customPrompt = null) => {
    if (forceRefresh || customPrompt) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Skip cache check if forceRefresh or customPrompt is true
      if (!forceRefresh && !customPrompt) {
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
            detailed: true,
            forceRefresh: forceRefresh, // Pass the force refresh flag
            customPrompt: customPrompt // Pass the custom prompt if available
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch from API');
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
          
          // Only cache if not a custom prompt
          if (!customPrompt) {
            // Cache the response
            localStorage.setItem('detailedHoroscope', JSON.stringify(data.data));
            localStorage.setItem('detailedHoroscopeDate', new Date().toDateString());
          }
          
          if (forceRefresh && !customPrompt) {
            toast({
              title: language === 'ru' ? 'Гороскоп обновлен' : 
                    language === 'es' ? 'Horóscopo actualizado' : 
                    'Horoscope updated',
              description: language === 'ru' ? 'Звезды рассказали что-то новое' : 
                          language === 'es' ? 'Las estrellas han revelado algo nuevo' : 
                          'The stars have revealed something new',
              variant: "default",
              duration: 3000
            });
          }
          
          return;
        }
        
        throw new Error('Invalid response from API');
      } catch (error) {
        console.error('Error fetching horoscope from API:', error);
        // Continue to fallback method
        
        if (forceRefresh && !customPrompt) {
          toast({
            title: language === 'ru' ? 'Ошибка обновления' : 
                  language === 'es' ? 'Error de actualización' : 
                  'Update error',
            description: language === 'ru' ? 'Не удалось получить новый гороскоп' : 
                        language === 'es' ? 'No se pudo obtener un nuevo horóscopo' : 
                        'Failed to get a new horoscope',
            variant: "destructive",
            duration: 3000
          });
        }
        
        throw error; // Rethrow for custom prompts to be handled by caller
      }
      
      // Generate fallback horoscope (only if not a custom prompt request)
      if (!customPrompt) {
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
        localStorage.setItem('detailedHoroscopeDate', new Date().toDateString());
      }
      
    } catch (error) {
      console.error('Error in horoscope generation:', error);
      
      // We'll rethrow the error for custom prompts so the calling component can handle it
      if (customPrompt) {
        throw error;
      }
      
      // Set some default content if everything fails
      const sections = {
        work: 'Сегодня благоприятный день для деловых начинаний. Доверяйте своей интуиции при принятии финансовых решений.',
        love: 'Проявите внимание к партнеру. Одиноким звезды советуют быть более открытыми для новых знакомств.',
        health: 'Следите за своим эмоциональным состоянием. Небольшая прогулка на свежем воздухе поможет восстановить силы.',
        advice: 'Сегодня хороший день для планирования будущего. Запишите свои цели и мечты.'
      };
      
      setHoroscopeSections(sections);
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
      setRefreshing(false);
    }
  };
  
  // Function to fetch horoscope with custom prompt
  const fetchCustomHoroscope = async (customPrompt: string) => {
    return fetchHoroscope(true, customPrompt);
  };
  
  // Initial fetch
  useEffect(() => {
    if (userProfile?.birthDate) {
      fetchHoroscope();
    }
  }, [userProfile?.birthDate, language, zodiacSign]);
  
  // Handle force refresh
  const handleRefresh = () => {
    fetchHoroscope(true);
  };

  return {
    horoscope,
    horoscopeSections,
    additionalInfo,
    loading,
    refreshing,
    handleRefresh,
    zodiacSign,
    fetchCustomHoroscope
  };
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
    }
  };
  
  // Get sections for the specific sign or use defaults
  const sections = fallbackData[sign]?.[language] || defaultSections[language as keyof typeof defaultSections] || defaultSections.en;
  
  // Combine sections into a single description
  const description = `${sections.work}\n\n${sections.love}\n\n${sections.health}\n\n${sections.advice}`;
  
  return {
    description,
    lucky_number: String(Math.floor(Math.random() * 100)),
    lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    color: language === 'ru' ? ['красный', 'синий', 'зеленый', 'желтый', 'фиолетовый'][Math.floor(Math.random() * 5)] : 
           ['red', 'blue', 'green', 'yellow', 'purple'][Math.floor(Math.random() * 5)],
    mood: language === 'ru' ? ['спокойный', 'энергичный', 'задумчивый', 'творческий'][Math.floor(Math.random() * 4)] :
          ['calm', 'energetic', 'reflective', 'creative'][Math.floor(Math.random() * 4)]
  };
}
