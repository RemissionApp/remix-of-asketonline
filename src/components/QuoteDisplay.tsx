
import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { formatDateLong } from '@/utils/dateFormatUtils';

interface QuoteDisplayProps {
  quote: string;
  className?: string;
}

interface HoroscopeData {
  date_range: string;
  current_date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, className }) => {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const { userProfile, language } = useAppStore();
  
  // Format current date based on user language
  useEffect(() => {
    const now = new Date();
    const formattedDate = formatDateLong(now, language);
    setCurrentDate(formattedDate);
  }, [language]);
  
  // Generate or fetch horoscope
  useEffect(() => {
    const fetchHoroscopeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check for cached horoscope in localStorage
        const storedHoroscope = localStorage.getItem('dailyHoroscope');
        const storedDate = localStorage.getItem('horoscopeDate');
        const today = new Date().toDateString();
        
        if (storedHoroscope && storedDate === today) {
          setHoroscope(JSON.parse(storedHoroscope));
          setLoading(false);
          return;
        }
        
        // Get user zodiac sign if available
        if (!userProfile?.birthDate) {
          throw new Error('Birth date not available');
        }
        
        // Determine zodiac sign based on birth date
        const birthDate = new Date(userProfile.birthDate);
        const sign = getZodiacSign(birthDate);
        
        if (!sign) {
          throw new Error('Could not determine zodiac sign');
        }
        
        // Generate fallback data as the API seems to be failing
        const fallbackData = {
          date_range: zodiacData[sign]?.dates || "",
          current_date: new Date().toLocaleDateString(),
          description: getRandomHoroscopeText(language),
          compatibility: "",
          mood: language === 'ru' ? 'задумчивый' : language === 'es' ? 'pensativo' : 'reflective',
          color: language === 'ru' ? 'фиолетовый' : language === 'es' ? 'púrpura' : 'purple',
          lucky_number: Math.floor(Math.random() * 100).toString(),
          lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        };
        
        setHoroscope(fallbackData);
        // Save to localStorage
        localStorage.setItem('dailyHoroscope', JSON.stringify(fallbackData));
        localStorage.setItem('horoscopeDate', today);
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        setError(error.message);
        // Fallback to default quote
      } finally {
        setLoading(false);
      }
    };
    
    fetchHoroscopeData();
  }, [quote, language, userProfile?.birthDate]);
  
  const userName = userProfile?.name || 'Искатель';
  const greeting = language === 'ru' ? 'Приветствую тебя' : 
                  language === 'es' ? '¡Te saludo' : 
                  'Greetings';
  
  // Date prefix based on language
  const datePrefix = language === 'ru' ? 'Сегодня' : 
                    language === 'es' ? 'Hoy es' : 
                    'Today is';
                   
  // Get zodiac sign symbol and name if available
  const zodiacSign = userProfile?.birthDate ? getZodiacSign(new Date(userProfile.birthDate)) : null;
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  const renderHoroscope = () => {
    if (loading) {
      return <p className="italic text-cosmic-accent/70">Loading your cosmic message...</p>;
    }
    
    if (error) {
      return <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">{quote}</p>;
    }
    
    if (!horoscope) {
      return <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">{quote}</p>;
    }
    
    return (
      <div className="space-y-3">
        {zodiacInfo && (
          <p className="text-lg font-medium">
            {zodiacInfo.symbol} {zodiacInfo.name[language] || zodiacInfo.name.en} — {horoscope.current_date}
          </p>
        )}
        
        <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">
          ✨ {horoscope.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm mt-3 text-cosmic-accent">
          <p>💫 {language === 'ru' ? 'Настроение' : language === 'es' ? 'Estado de ánimo' : 'Mood'}: {horoscope.mood}</p>
          <p>🎨 {language === 'ru' ? 'Цвет дня' : language === 'es' ? 'Color del día' : 'Color'}: {horoscope.color}</p>
          <p>🎲 {language === 'ru' ? 'Счастливое число' : language === 'es' ? 'Número de la suerte' : 'Lucky number'}: {horoscope.lucky_number}</p>
          <p>🕒 {language === 'ru' ? 'Время удачи' : language === 'es' ? 'Hora de la suerte' : 'Lucky time'}: {horoscope.lucky_time}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`text-center p-6 max-w-lg mx-auto ${className}`}>
      <div className="mb-4">
        <p className="text-cosmic-gold text-lg font-serif">
          {greeting}, {userName}!
        </p>
        <p className="text-cosmic-accent text-sm mt-1">
          {datePrefix} {currentDate}
        </p>
      </div>
      {renderHoroscope()}
    </div>
  );
};

// Helper function to get random horoscope text when API fails
function getRandomHoroscopeText(language: string = 'en'): string {
  const texts = {
    ru: [
      'Звезды благоволят смелым решениям. Прислушайтесь к интуиции, она ведет вас по верному пути.',
      'Сегодня благоприятный день для начинаний. Вселенная открывает перед вами новые горизонты.',
      'Время перемен наступило. Отпустите старое, чтобы освободить место для нового.',
      'Космические энергии поддерживают вас. Двигайтесь вперед с уверенностью и благода��ностью.',
      'Внутренний голос подскажет решение. Найдите тихий момент для глубокого размышления.'
    ],
    en: [
      'The stars favor bold decisions today. Listen to your intuition, it guides you on the right path.',
      'Today is favorable for new beginnings. The universe is opening new horizons before you.',
      'The time for change has come. Let go of the old to make room for the new.',
      'Cosmic energies support you now. Move forward with confidence and gratitude.',
      'Your inner voice will suggest the solution. Find a quiet moment for deep reflection.'
    ],
    es: [
      'Las estrellas favorecen decisiones audaces hoy. Escucha tu intuición, te guía por el camino correcto.',
      'Hoy es favorable para nuevos comienzos. El universo está abriendo nuevos horizontes ante ti.',
      'Ha llegado el momento del cambio. Deja ir lo viejo para dar espacio a lo nuevo.',
      'Las energías cósmicas te apoyan ahora. Avanza con confianza y gratitud.',
      'Tu voz interior te sugerirá la solución. Encuentra un momento tranquilo para una reflexión profunda.'
    ]
  };
  
  const defaultTexts = texts.en;
  const selectedTexts = texts[language] || defaultTexts;
  
  return selectedTexts[Math.floor(Math.random() * selectedTexts.length)];
}
