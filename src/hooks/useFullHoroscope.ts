import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ZodiacSign, getZodiacSign } from '@/utils/zodiac';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';

interface FullHoroscopeData {
  personalityAnalysis: string;
  yearForecast: string;
  careerPath: string;
  relationshipForecast: string;
  healthGuidance: string;
  personalGrowth: string;
}

export function useFullHoroscope() {
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
      console.log("Set zodiac sign:", sign, "from birthDate:", userProfile.birthDate);
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

      console.log("Checking for existing horoscope for user", user.id, "with zodiac sign", zodiacSign);
      
      // Query the full_horoscopes table
      const { data, error } = await supabase
        .from('full_horoscopes')
        .select('*')
        .eq('user_id', user.id)
        .eq('zodiac_sign', zodiacSign)
        .eq('language', language)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching horoscope:", error);
        throw new Error(error.message || 'Failed to fetch existing horoscope');
      } 
      
      if (data) {
        // Existing horoscope found
        console.log("Found existing horoscope:", data);
        setHoroscope(data.content);
      } else {
        // No records found
        console.log("No existing horoscope found");
        setHoroscope(null);
      }
    } catch (error: any) {
      console.error("Error in fetchExistingHoroscope:", error);
      setError(error.message || "An error occurred while retrieving your horoscope");
    } finally {
      setLoading(false);
    }
  };

  const generateFullHoroscope = async () => {
    if (!user || !zodiacSign) {
      toast({
        title: "Cannot generate horoscope",
        description: "Please log in and set your birth date to generate a horoscope.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Calling generateFullHoroscope edge function with params:", { 
        userId: user.id,
        zodiacSign,
        birthDate: userProfile?.birthDate || null,
        language
      });
      
      // Call the edge function to generate the full horoscope
      const { data, error } = await supabase.functions.invoke('generate-full-horoscope', {
        body: { 
          userId: user.id,
          zodiacSign,
          birthDate: userProfile?.birthDate || null,
          language // Pass current app language
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || 'Failed to generate full horoscope');
      }

      console.log("Received horoscope data:", data);
      setHoroscope(data);
      
      toast({
        title: 'Success',
        description: 'Your comprehensive horoscope has been generated!',
        variant: 'default'
      });
    } catch (error: any) {
      console.error('Error generating full horoscope:', error);
      setError(error.message || "Failed to generate horoscope. Please try again later.");
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate full horoscope',
        variant: 'destructive'
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
    currentYear
  };
}
