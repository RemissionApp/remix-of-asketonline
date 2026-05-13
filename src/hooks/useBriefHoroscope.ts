import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign } from '@/utils/zodiac';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  getTodayDateString,
  isHoroscopeFromToday,
  getDefaultMessage,
} from '@/utils/horoscopeUtils';

interface BriefHoroscope {
  description: string;
}

export const useBriefHoroscope = () => {
  const [horoscope, setHoroscope] = useState<BriefHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { userProfile, language, user } = useAppStore();
  const { toast } = useToast();
  const typingSpeedRef = useRef(30); // milliseconds per character
  const lastFetchedDateRef = useRef<string | null>(null);

  // Typing effect — restarts cleanly whenever horoscope changes.
  useEffect(() => {
    const text = horoscope?.description ?? '';
    setDisplayedText('');
    if (!text) {
      setIsTyping(false);
      return;
    }
    setIsTyping(true);
    let index = 0;
    const typingInterval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typingSpeedRef.current);
    return () => {
      clearInterval(typingInterval);
    };
  }, [horoscope]);

  const fetchHoroscope = useCallback(
    async (force = false) => {
      try {
        setLoading(true);

        // Check if user has birth date to determine zodiac sign
        if (!userProfile?.birthDate) {
          setHoroscope({ description: getDefaultMessage(language) });
          setLoading(false);
          return;
        }

        // Get zodiac sign based on birth date
        const sign = getZodiacSign(userProfile.birthDate);
        if (!sign) {
          throw new Error('Could not determine zodiac sign');
        }

        // Try to get cached horoscope for today
        const today = getTodayDateString();
        const cachedHoroscopeKey = `horoscope_${sign}_${today}_brief`;
        const cachedHoroscopeData = localStorage.getItem(cachedHoroscopeKey);
        const cachedHoroscopeDateKey = `horoscope_${sign}_date_brief`;
        const cachedHoroscopeDate = localStorage.getItem(
          cachedHoroscopeDateKey
        );

        // Use cached horoscope if it exists and is from today
        if (
          !force &&
          cachedHoroscopeData &&
          cachedHoroscopeDate &&
          isHoroscopeFromToday(cachedHoroscopeDate)
        ) {
          setHoroscope(JSON.parse(cachedHoroscopeData));
          lastFetchedDateRef.current = today;
          setLoading(false);
          return;
        }

        // Call our edge function to generate a horoscope
        const { data, error } = await supabase.functions.invoke(
          'fetch-horoscope',
          {
            body: {
              sign,
              language,
              detailed: false,
            },
          }
        );

        if (error) {
          throw new Error(error.message || 'Failed to fetch horoscope');
        }

        if (!data.success) {
          throw new Error('Invalid response from fetch-horoscope function');
        }

        // Set the horoscope with just the description — only update if changed
        const briefHoroscope = { description: data.data.description };
        setHoroscope(prev =>
          prev?.description === briefHoroscope.description ? prev : briefHoroscope
        );

        // Cache the horoscope with today's date
        localStorage.setItem(
          cachedHoroscopeKey,
          JSON.stringify(briefHoroscope)
        );
        localStorage.setItem(cachedHoroscopeDateKey, today);
        lastFetchedDateRef.current = today;
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        const fallback = getDefaultMessage(language);
        setHoroscope(prev =>
          prev?.description === fallback ? prev : { description: fallback }
        );
      } finally {
        setLoading(false);
      }
    },
    [userProfile?.birthDate, language]
  );

  useEffect(() => {
    // Only fetch horoscope when user is logged in and we have their profile
    if (user && userProfile?.birthDate) {
      fetchHoroscope();
    } else {
      const fallback = getDefaultMessage(language);
      setHoroscope(prev =>
        prev?.description === fallback ? prev : { description: fallback }
      );
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, userProfile?.birthDate, language]);

  // Auto-refresh once per day: when tab becomes visible or window focuses,
  // if cached date != today → refetch.
  useEffect(() => {
    const checkAndRefresh = () => {
      if (!user || !userProfile?.birthDate) return;
      const today = getTodayDateString();
      if (lastFetchedDateRef.current && lastFetchedDateRef.current !== today) {
        fetchHoroscope(true);
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkAndRefresh();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', checkAndRefresh);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', checkAndRefresh);
    };
  }, [user, userProfile?.birthDate, fetchHoroscope]);

  return {
    horoscope,
    loading,
    displayedText,
    isTyping,
  };
};
