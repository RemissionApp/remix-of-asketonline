
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
  
  console.log("useHoroscopeData INITIALIZATION:", { 
    zodiacSign, 
    birthDate: birthDate?.toISOString(),
    shouldFetchHoroscope, 
    isPro,
    language
  });
  
  useEffect(() => {
    // Only fetch data when explicitly requested via shouldFetchHoroscope
    if (!shouldFetchHoroscope) {
      console.log("Not fetching horoscope data - waiting for user to request it");
      return;
    }
    
    console.log("Starting horoscope fetch with:", { zodiacSign, shouldFetchHoroscope });
    
    const fetchDetailedHoroscope = async () => {
      try {
        setLoading(true);
        console.log("Fetch started: Loading state set to true");
        
        // Check if user has birth date to determine zodiac sign
        if (!userProfile?.birthDate || !zodiacSign) {
          console.log("ERROR: No birth date or zodiac sign found:", { 
            birthDate: userProfile?.birthDate, 
            zodiacSign,
            userProfile: JSON.stringify(userProfile)
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
            console.log("Cached data parsed successfully, sections:", Object.keys(parsedData.sections || {}).join(', '));
            setHoroscope(parsedData);
            setLoading(false);
            return;
          } catch (parseError) {
            console.error("Error parsing cached horoscope:", parseError);
            // If parsing fails, continue to fetch new data
          }
        }
        
        console.log("Calling generate-horoscope edge function with params:", {
          sign: zodiacSign,
          language,
          detailed: true,
          birthDate: userProfile.birthDate
        });
        
        // Force a new call to the edge function (do not attempt to retrieve from database first)
        const result = await supabase.functions.invoke('generate-horoscope', {
          body: { 
            sign: zodiacSign,
            language,
            detailed: true,
            birthDate: userProfile.birthDate
          }
        });
        
        console.log("Edge function response:", JSON.stringify(result));
        
        if (result.error) {
          console.error("Edge function error:", result.error);
          throw new Error(result.error.message || 'Failed to fetch detailed horoscope');
        }
        
        const { data, error } = result;
        
        if (error || !data || !data.success) {
          console.error("Invalid response from edge function:", data, error);
          throw new Error('Invalid response from generate-horoscope function');
        }
        
        console.log("Detailed horoscope data received with sections:", 
          data.data?.sections ? Object.keys(data.data.sections).join(', ') : 'No sections'
        );
        
        // Safety check to ensure data.data exists and has the expected structure
        if (!data.data || typeof data.data !== 'object') {
          console.error("Invalid horoscope data format received:", data);
          throw new Error('Invalid horoscope data format received');
        }
        
        // Store the horoscope in the database if user is logged in
        if (user) {
          try {
            const { error: insertError } = await supabase
              .from('detailed_horoscopes')
              .upsert({
                user_id: user.id,
                zodiac_sign: zodiacSign,
                date: today,
                content: data.data
              });
              
            if (insertError) {
              console.error("Error storing horoscope in database:", insertError);
            } else {
              console.log("Horoscope stored in database successfully");
            }
          } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue even if database storage fails
          }
        }
        
        // Set the horoscope data
        console.log("Setting horoscope state with data:", 
          data.data?.sections ? Object.keys(data.data.sections).join(', ') : 'No sections'
        );
        setHoroscope(data.data);
        
        // Cache the horoscope with today's date
        localStorage.setItem(cachedHoroscopeKey, JSON.stringify(data.data));
        localStorage.setItem(cachedHoroscopeDateKey, today);
        
        console.log("Horoscope data successfully cached and set");
      } catch (error: any) {
        console.error('Error fetching detailed horoscope:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
        
        // Generate fallback data in case of error
        if (zodiacSign) {
          console.log("Generating fallback horoscope for:", zodiacSign);
          const fallbackHoroscope = generateFallbackHoroscope(zodiacSign, language, translations);
          setHoroscope(fallbackHoroscope);
        }
      } finally {
        setLoading(false);
        console.log("Fetch completed: Loading state set to false");
      }
    };
    
    fetchDetailedHoroscope();
  }, [userProfile?.birthDate, zodiacSign, language, toast, translations, user, shouldFetchHoroscope]);

  // Add additional logging of current state
  useEffect(() => {
    console.log("useHoroscopeData current state:", {
      horoscopeAvailable: !!horoscope,
      horoscopeSections: horoscope?.sections ? Object.keys(horoscope.sections).join(', ') : 'No sections',
      loading,
      zodiacSign,
      shouldFetchHoroscope
    });
  }, [horoscope, loading, zodiacSign, shouldFetchHoroscope]);

  return {
    horoscope,
    loading,
    zodiacSign
  };
};
