import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ZodiacSign, getZodiacSign } from '@/utils/zodiac';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import { createLogger } from '@/utils/loggerUtils';

interface FullHoroscopeData {
  personalityAnalysis: string;
  yearForecast: string;
  careerPath: string;
  relationshipForecast: string;
  healthGuidance: string;
  personalGrowth: string;
}

export function useFullHoroscope() {
  const logger = createLogger('useFullHoroscope');
  const { user, userProfile, language } = useAppStore();
  const [horoscope, setHoroscope] = useState<FullHoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign | null>(null);
  const { toast } = useToast();

  // Get current year for the header display
  const currentYear = new Date().getFullYear();

  // Determine zodiac sign from birth date when userProfile changes
  useEffect(() => {
    if (userProfile?.birthDate) {
      const birthDate = new Date(userProfile.birthDate);
      const sign = getZodiacSign(birthDate);
      setZodiacSign(sign);
      logger.debug('Set zodiac sign', {
        sign,
        birthDate: userProfile.birthDate,
      });
    }
  }, [userProfile?.birthDate]);

  // Check for existing horoscope on component mount
  useEffect(() => {
    if (user && zodiacSign) {
      fetchExistingHoroscope();
    }
  }, [user?.id, zodiacSign, language]);

  // Fetch existing horoscope from Supabase
  const fetchExistingHoroscope = async () => {
    if (!user || !zodiacSign) return;

    try {
      setLoading(true);
      setError(null);

      logger.debug('Checking for existing horoscope', {
        userId: user.id,
        zodiacSign,
      });

      // Query the full_horoscopes table
      const { data, error } = await supabase
        .from('full_horoscopes')
        .select('*')
        .eq('user_id', user.id)
        .eq('zodiac_sign', zodiacSign)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching horoscope', error);
        throw new Error(error.message || 'Failed to fetch existing horoscope');
      }

      if (data) {
        // Existing horoscope found
        logger.info('Found existing horoscope', { horoscopeId: data.id });
        setHoroscope(data.content);
      } else {
        // No records found
        logger.debug('No existing horoscope found');
        setHoroscope(null);
      }
    } catch (error: any) {
      logger.error('Error in fetchExistingHoroscope', error);
      setError(
        error.message || 'An error occurred while retrieving your horoscope'
      );
    } finally {
      setLoading(false);
    }
  };

  const generateFullHoroscope = async () => {
    if (!user || !zodiacSign) {
      toast({
        title: 'Cannot generate horoscope',
        description:
          'Please log in and set your birth date to generate a horoscope.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      logger.info('Calling generateFullHoroscope edge function', {
        userId: user.id,
        zodiacSign,
        birthDate: userProfile?.birthDate || null,
        language,
      });

      // Call the edge function to generate the full horoscope
      const { data, error } = await supabase.functions.invoke(
        'generate-full-horoscope',
        {
          body: {
            userId: user.id,
            zodiacSign,
            birthDate: userProfile?.birthDate || null,
            language, // Pass current app language
          },
        }
      );

      if (error) {
        logger.error('Edge function error', error);
        throw new Error(error.message || 'Failed to generate full horoscope');
      }

      logger.info('Received horoscope data', {
        dataKeys: Object.keys(data || {}),
      });
      setHoroscope(data);

      toast({
        title: 'Success',
        description: 'Your comprehensive horoscope has been generated!',
        variant: 'default',
      });
    } catch (error: any) {
      logger.error('Error generating full horoscope', error);
      setError(
        error.message || 'Failed to generate horoscope. Please try again later.'
      );
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate full horoscope',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    horoscope,
    loading,
    error,
    zodiacSign,
    generateFullHoroscope,
    currentYear,
  };
}
