
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { DetailedHoroscope } from '@/types/horoscope';
import { getZodiacSign } from '@/utils/zodiac';
import { getTodayDateString, isHoroscopeFromToday, generateFallbackHoroscope } from '@/utils/horoscopeUtils';

interface UseHoroscopeDataProps {
  userProfile: any;
  language: string;
  translations: any;
  isPro: boolean;
}

export const useHoroscopeData = ({ userProfile, language, translations, isPro }: UseHoroscopeDataProps) => {
  const [horoscope, setHoroscope] = useState<DetailedHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Get zodiac sign info
  const zodiacSign = userProfile?.birthDate ? getZodiacSign(new Date(userProfile.birthDate)) : null;
  
  useEffect(() => {
    const fetchDetailedHoroscope = async () => {
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
        
        if (!data || !data.success) {
          throw new Error('Invalid response from fetch-horoscope function');
        }
        
        console.log("Detailed horoscope data:", data);
        
        // Set the horoscope data
        setHoroscope(data.data);
        
        // Cache the horoscope with today's date
        localStorage.setItem(cachedHoroscopeKey, JSON.stringify(data.data));
        localStorage.setItem(cachedHoroscopeDateKey, today);
      } catch (error: any) {
        console.error('Error fetching detailed horoscope:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
        
        // Generate fallback data in case of error
        const fallbackHoroscope = generateFallbackHoroscope(zodiacSign, language, translations);
        setHoroscope(fallbackHoroscope);
      } finally {
        setLoading(false);
      }
    };
    
    // Always fetch horoscope when component mounts, regardless of PRO status
    // This way it will work for all users while showing a PRO overlay for non-PRO users
    fetchDetailedHoroscope();
  }, [userProfile?.birthDate, zodiacSign, language, toast, translations]);

  return {
    horoscope,
    loading,
    zodiacSign
  };
};
