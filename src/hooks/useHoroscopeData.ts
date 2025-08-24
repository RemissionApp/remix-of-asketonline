import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { DetailedHoroscope } from '@/types/horoscope';
import { getZodiacSign } from '@/utils/zodiac';
import {
  getTodayDateString,
  isHoroscopeFromToday,
  generateFallbackHoroscope,
} from '@/utils/horoscopeUtils';
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
  shouldFetchHoroscope = false,
}: UseHoroscopeDataProps) => {
  const [horoscope, setHoroscope] = useState<DetailedHoroscope | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAppStore();

  // Get zodiac sign info - fixing the issue by properly converting birthDate string to Date object
  const birthDate = userProfile?.birthDate
    ? new Date(userProfile.birthDate)
    : null;
  const zodiacSign = birthDate ? getZodiacSign(birthDate) : null;


  useEffect(() => {
    // Only fetch data when explicitly requested via shouldFetchHoroscope
    if (!shouldFetchHoroscope) {
      return;
    }

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
        const cachedHoroscopeDate = localStorage.getItem(
          cachedHoroscopeDateKey
        );


        // Use cached horoscope if it exists and is from today
        if (
          cachedHoroscopeData &&
          cachedHoroscopeDate &&
          isHoroscopeFromToday(cachedHoroscopeDate)
        ) {
          try {
            const parsedData = JSON.parse(cachedHoroscopeData);

            // Validate that the parsed data has the required structure
            if (
              !parsedData.sections ||
              !parsedData.sections.general_atmosphere
            ) {
              throw new Error('Invalid cached data structure');
            }

            setHoroscope(parsedData);
            setLoading(false);
            return;
          } catch (parseError) {
            // If parsing fails, continue to fetch new data
          }
        }

        // Force a new call to the edge function (do not attempt to retrieve from database first)
        const result = await supabase.functions.invoke('generate-horoscope', {
          body: {
            sign: zodiacSign,
            language,
            detailed: true,
            birthDate: userProfile.birthDate,
          },
        });

        if (result.error) {
          throw new Error(
            result.error.message || 'Failed to fetch detailed horoscope'
          );
        }

        const { data, error } = result;

        if (error || !data || !data.success) {
          throw new Error('Invalid response from generate-horoscope function');
        }

        // Safety check to ensure data.data exists and has the expected structure
        if (!data.data || typeof data.data !== 'object') {
          throw new Error('Invalid horoscope data format received');
        }

        // Verify that all required sections are present
        if (!data.data.sections || !data.data.sections.general_atmosphere) {
          // Try to fix missing sections
          if (!data.data.sections) {
            data.data.sections = {};
          }

          const requiredSections = [
            'general_atmosphere',
            'work_finance',
            'love_relationships',
            'health_wellbeing',
            'daily_advice',
          ];

          requiredSections.forEach(section => {
            if (!data.data.sections[section]) {
              const fallbackHoroscope = generateFallbackHoroscope(
                zodiacSign,
                language,
                translations
              );
              data.data.sections[section] = fallbackHoroscope.sections[section];
            }
          });
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
                content: data.data,
              });

          } catch (dbError) {
            // Continue even if database storage fails
          }
        }

        setHoroscope(data.data);

        // Cache the horoscope with today's date
        localStorage.setItem(cachedHoroscopeKey, JSON.stringify(data.data));
        localStorage.setItem(cachedHoroscopeDateKey, today);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });

        // Generate fallback data in case of error
        if (zodiacSign) {
          const fallbackHoroscope = generateFallbackHoroscope(
            zodiacSign,
            language,
            translations
          );
          setHoroscope(fallbackHoroscope);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedHoroscope();
  }, [
    userProfile?.birthDate,
    zodiacSign,
    language,
    toast,
    translations,
    user,
    shouldFetchHoroscope,
  ]);


  return {
    horoscope,
    loading,
    zodiacSign,
  };
};
