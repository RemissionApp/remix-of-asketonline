import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ZodiacSign } from '@/utils/zodiac';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import { createLogger } from '@/utils/logger';

interface MonthlyHoroscopeData {
  generalForecast: string;
  careerFinance: string;
  loveRelationships: string;
  healthWellbeing: string;
  fullText: string;
}

export function useMonthlyHoroscope() {
  const logger = createLogger('useMonthlyHoroscope');
  const { user, language } = useAppStore();
  const [horoscope, setHoroscope] = useState<MonthlyHoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMonthlyHoroscope = async (zodiacSign: ZodiacSign) => {
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

      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      logger.info('Calling generate-monthly-horoscope edge function', {
        userId: user.id,
        zodiacSign,
        month,
        year,
        language,
      });

      // Call the edge function to generate the monthly horoscope
      const { data, error } = await supabase.functions.invoke(
        'generate-monthly-horoscope',
        {
          body: {
            userId: user.id,
            zodiacSign,
            month,
            year,
            language,
          },
        }
      );

      if (error) {
        logger.error('Edge function error', error);
        throw new Error(error.message || 'Failed to generate monthly horoscope');
      }

      logger.info('Received monthly horoscope data', data);
      setHoroscope(data);

      toast({
        title: 'Success',
        description: 'Your monthly horoscope has been generated!',
        variant: 'default',
      });
    } catch (error: any) {
      logger.error('Error generating monthly horoscope', error);
      setError(
        error.message || 'Failed to generate horoscope. Please try again later.'
      );
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate monthly horoscope',
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
    generateMonthlyHoroscope,
  };
}