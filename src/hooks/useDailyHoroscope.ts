import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ZodiacSign } from '@/utils/zodiac';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import { createLogger } from '@/utils/logger';

interface DailyHoroscopeData {
  description: string;
}

export function useDailyHoroscope() {
  const logger = createLogger('useDailyHoroscope');
  const { user, language } = useAppStore();
  const [horoscope, setHoroscope] = useState<DailyHoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateDailyHoroscope = async (zodiacSign: ZodiacSign) => {
    if (!user || !zodiacSign) {
      toast({
        title: 'Cannot generate horoscope',
        description: 'Please log in and set your birth date to generate a horoscope.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      logger.info('Calling fetch-horoscope edge function for daily horoscope', {
        userId: user.id,
        zodiacSign,
        language,
      });

      // Call the edge function to generate the daily horoscope
      const { data, error } = await supabase.functions.invoke('fetch-horoscope', {
        body: {
          sign: zodiacSign,
          language,
          detailed: false,
        },
      });

      if (error) {
        logger.error('Edge function error', error);
        throw new Error(error.message || 'Failed to generate daily horoscope');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate daily horoscope');
      }

      logger.info('Received daily horoscope data', data.data);
      setHoroscope(data.data);

      toast({
        title: 'Success',
        description: 'Your daily horoscope has been generated!',
        variant: 'default',
      });
    } catch (error: any) {
      logger.error('Error generating daily horoscope', error);
      setError(
        error.message || 'Failed to generate horoscope. Please try again later.'
      );
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate daily horoscope',
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
    generateDailyHoroscope,
  };
}