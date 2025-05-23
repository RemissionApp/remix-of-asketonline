
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useHoroscopeData } from './useHoroscopeData';

export const useBriefHoroscope = () => {
  const { userProfile } = useAppStore();
  const { horoscope, isLoading, error, refetch } = useHoroscopeData();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (horoscope?.description) {
      setIsTyping(true);
      setDisplayedText('');
      
      // Simulate typing effect
      const text = horoscope.description;
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
  }, [horoscope?.description]);

  return {
    horoscope,
    loading: isLoading,
    displayedText,
    isTyping,
    error,
    refetch
  };
};
