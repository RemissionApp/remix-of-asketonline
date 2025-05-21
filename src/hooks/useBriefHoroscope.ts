
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

// Change the function to handle string or Date type
const getFormattedDate = (date: Date | string | null): string => {
  if (!date) return '';
  
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  return format(dateObject, 'yyyy-MM-dd');
};

interface HoroscopeData {
  current_date: string;
  compatibility: string;
  mood: string;
  lucky_time: string;
  lucky_number: string;
  color: string;
  date_range: string;
  description: string;
}

const useBriefHoroscope = () => {
  const { userProfile } = useAppStore();
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const zodiacSign = userProfile?.zodiacSign || '';
  const birthDate = userProfile?.birthDate;
  
  const formattedDate = getFormattedDate(birthDate);
  
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['briefHoroscope', zodiacSign, formattedDate],
    queryFn: async () => {
      if (!zodiacSign || !formattedDate) {
        return null;
      }
      
      const { data, error } = await supabase
        .functions.invoke('horoscope', {
          body: {
            sign: zodiacSign,
            day: formattedDate
          }
        });
      
      if (error) {
        console.error('Error fetching horoscope:', error);
        throw new Error(error.message);
      }
      
      return data as HoroscopeData;
    },
    enabled: !!zodiacSign && !!formattedDate,
    retry: false
  });
  
  useEffect(() => {
    if (data) {
      setHoroscope(data);
    }
  }, [data]);
  
  return { horoscope, isLoading, error, refetch };
};

export default useBriefHoroscope;
export { useBriefHoroscope };
