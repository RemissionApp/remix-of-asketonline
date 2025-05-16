
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { DetailedHoroscope } from '@/types/horoscope';
import { getZodiacSign } from '@/utils/zodiac';
import { getTodayDateString, isHoroscopeFromToday, generateFallbackHoroscope } from '@/utils/horoscopeUtils';
import { useAppStore } from '@/store/useAppStore';

interface UseHoroscopeDataProps {
  userProfile: any;
  language: string;
  translations: any;
  isPro: boolean;
  shouldFetchHoroscope?: boolean;
}

export const useHoroscopeData = ({ 
  userProfile, 
  language, 
  translations, 
  isPro,
  shouldFetchHoroscope = false
}: UseHoroscopeDataProps) => {
  const [horoscope, setHoroscope] = useState<DetailedHoroscope | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAppStore();
  
  // Get zodiac sign info - fixing the issue by properly converting birthDate string to Date object
  const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  const zodiacSign = birthDate ? getZodiacSign(birthDate) : null;
  
  useEffect(() => {
    // Only fetch data when explicitly requested via shouldFetchHoroscope
    if (!shouldFetchHoroscope) {
      console.log("Not fetching horoscope data - waiting for user to request it");
      return;
    }
    
    console.log("Fetching horoscope data with:", { zodiacSign, shouldFetchHoroscope });
    
    const fetchDetailedHoroscope = async () => {
      try {
        setLoading(true);
        
        // Check if user has birth date to determine zodiac sign
        if (!userProfile?.birthDate || !zodiacSign) {
          console.log("No birth date or zodiac sign found:", { 
            birthDate: userProfile?.birthDate, 
            zodiacSign,
            userProfile 
          });
          setLoading(false);
          return;
        }
        
        // Try to get cached detailed horoscope for today
        const today = getTodayDateString();
        const cachedHoroscopeKey = `horoscope_${zodiacSign}_${today}_detailed`;
        const cachedHoroscopeDateKey = `horoscope_${zodiacSign}_date_detailed`;
        const cachedHoroscopeData = localStorage.getItem(cachedHoroscopeKey);
        const cachedHoroscopeDate = localStorage.getItem(cachedHoroscopeDateKey);
        
        console.log("Checking cached horoscope:", { 
          zodiacSign, 
          today, 
          hasCachedData: !!cachedHoroscopeData,
          cachedDate: cachedHoroscopeDate,
          isFromToday: cachedHoroscopeDate && isHoroscopeFromToday(cachedHoroscopeDate) 
        });
        
        // Use cached horoscope if it exists and is from today
        if (cachedHoroscopeData && cachedHoroscopeDate && isHoroscopeFromToday(cachedHoroscopeDate)) {
          console.log("Using cached horoscope data");
          try {
            const parsedData = JSON.parse(cachedHoroscopeData);
            setHoroscope(parsedData);
            setLoading(false);
            return;
          } catch (parseError) {
            console.error("Error parsing cached horoscope:", parseError);
            // If parsing fails, continue to fetch new data
          }
        }
        
        // First try to fetch from the database
        if (user) {
          console.log("Fetching horoscope from database for user:", user.id);
          const { data: dbHoroscope, error: dbError } = await supabase
            .from('detailed_horoscopes')
            .select('content')
            .eq('user_id', user.id)
            .eq('zodiac_sign', zodiacSign)
            .eq('date', today)
            .single();
            
          if (!dbError && dbHoroscope) {
            console.log("Found horoscope in database:", dbHoroscope);
            setHoroscope(dbHoroscope.content);
            
            // Also cache the horoscope locally
            localStorage.setItem(cachedHoroscopeKey, JSON.stringify(dbHoroscope.content));
            localStorage.setItem(cachedHoroscopeDateKey, today);
            
            setLoading(false);
            return;
          } else if (dbError) {
            console.log("Database error:", dbError);
          }
        }
        
        console.log("Calling edge function to generate detailed horoscope", {
          sign: zodiacSign,
          language,
          detailed: true,
          birthDate: userProfile.birthDate
        });
        
        // If not in database, call our edge function to generate a detailed horoscope
        const { data, error } = await supabase.functions.invoke('generate-horoscope', {
          body: { 
            sign: zodiacSign,
            language,
            detailed: true,
            birthDate: userProfile.birthDate
          }
        });
        
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(error.message || 'Failed to fetch detailed horoscope');
        }
        
        if (!data || !data.success) {
          console.error("Invalid response from edge function:", data);
          throw new Error('Invalid response from fetch-horoscope function');
        }
        
        console.log("Detailed horoscope data received:", data);
        
        // Safety check to ensure data.data exists and has the expected structure
        if (!data.data || typeof data.data !== 'object') {
          throw new Error('Invalid horoscope data format received');
        }
        
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
        if (zodiacSign) {
          const fallbackHoroscope = generateFallbackHoroscope(zodiacSign, language, translations);
          setHoroscope(fallbackHoroscope);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetailedHoroscope();
  }, [userProfile?.birthDate, zodiacSign, language, toast, translations, user, shouldFetchHoroscope]);

  return {
    horoscope,
    loading,
    zodiacSign
  };
};
