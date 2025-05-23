
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useHoroscopeData } from './useHoroscopeData';

export const useBriefHoroscope = () => {
  const { userProfile } = useAppStore();
  const horoscopeResult = useHoroscopeData();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (horoscopeResult?.horoscope?.description) {
      setIsTyping(true);
      setDisplayedText('');
      
      // Simulate typing effect
      const text = horoscopeResult.horoscope.description;
      let i = 0;
      const typingSpeed = 50;
      
      const typeWriter = () => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1));
          i++;
          setTimeout(typeWriter, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      typeWriter();
    }
  }, [horoscopeResult?.horoscope?.description]);

  return {
    horoscope: horoscopeResult?.horoscope,
    loading: horoscopeResult?.loading || false,
    displayedText,
    isTyping,
    error: null,
    refetch: () => {} // Placeholder function
  };
};
