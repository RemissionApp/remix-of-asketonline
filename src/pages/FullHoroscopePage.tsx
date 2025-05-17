
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ZodiacSign, getZodiacSign, zodiacData } from '@/utils/zodiac';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface FullHoroscopeData {
  personalityAnalysis: string;
  yearForecast: string;
  careerPath: string;
  relationshipForecast: string;
  healthGuidance: string;
  personalGrowth: string;
}

export default function FullHoroscopePage() {
  const { user, userProfile } = useAppStore();
  const [horoscope, setHoroscope] = useState<FullHoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Determine zodiac sign from birth date
    if (userProfile?.birthDate) {
      const birthDate = new Date(userProfile.birthDate);
      const sign = getZodiacSign(birthDate);
      setZodiacSign(sign);
    }
  }, [userProfile?.birthDate]);

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
      // Call the edge function to generate the full horoscope
      const { data, error } = await supabase.functions.invoke('generate-full-horoscope', {
        body: { 
          userId: user.id,
          zodiacSign,
          birthDate: userProfile?.birthDate || null
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate full horoscope');
      }

      setHoroscope(data);
    } catch (error: any) {
      console.error('Error generating full horoscope:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate full horoscope',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400">Full Horoscope Analysis</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="border-amber-400 text-amber-400 hover:bg-amber-400/10"
          >
            Back
          </Button>
        </div>

        {!zodiacSign && (
          <Card className="p-6 mb-8 bg-slate-800 border-amber-500/30">
            <h2 className="text-xl font-semibold mb-4 text-amber-300">Set Your Birth Date</h2>
            <p className="mb-4">To generate your full horoscope analysis, please add your birth date in your profile.</p>
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              Go to Profile
            </Button>
          </Card>
        )}

        {zodiacSign && !horoscope && !loading && (
          <Card className="p-6 mb-8 bg-slate-800 border-amber-500/30">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{zodiacData[zodiacSign].symbol}</span>
              <div>
                <h2 className="text-xl font-semibold text-amber-300">{zodiacData[zodiacSign].name.en}</h2>
                <p className="text-gray-400">{zodiacData[zodiacSign].dates}</p>
              </div>
            </div>
            <p className="mb-6">Generate your complete cosmic profile with insights into your personality, relationships, career path, and more based on your zodiac sign.</p>
            <Button 
              onClick={generateFullHoroscope}
              className="bg-amber-500 hover:bg-amber-600 text-black"
              disabled={loading}
            >
              Generate Full Horoscope
            </Button>
          </Card>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin mb-4">
              <Loader className="h-12 w-12 text-amber-400" />
            </div>
            <p className="text-amber-300 text-lg">Consulting the stars and planets for your complete cosmic profile...</p>
            <p className="text-gray-400 mt-2">This may take a moment as we analyze your celestial patterns</p>
          </div>
        )}

        {horoscope && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-amber-400">Personality Analysis</h2>
              <Card className="p-6 bg-slate-800 border-amber-500/30">
                <p className="whitespace-pre-line">{horoscope.personalityAnalysis}</p>
              </Card>
            </section>

            <Separator className="bg-amber-500/30" />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-amber-400">Year Ahead Forecast</h2>
              <Card className="p-6 bg-slate-800 border-amber-500/30">
                <p className="whitespace-pre-line">{horoscope.yearForecast}</p>
              </Card>
            </section>

            <Separator className="bg-amber-500/30" />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-amber-400">Career Path</h2>
              <Card className="p-6 bg-slate-800 border-amber-500/30">
                <p className="whitespace-pre-line">{horoscope.careerPath}</p>
              </Card>
            </section>

            <Separator className="bg-amber-500/30" />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-amber-400">Relationship Forecast</h2>
              <Card className="p-6 bg-slate-800 border-amber-500/30">
                <p className="whitespace-pre-line">{horoscope.relationshipForecast}</p>
              </Card>
            </section>

            <Separator className="bg-amber-500/30" />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-amber-400">Health & Wellbeing</h2>
              <Card className="p-6 bg-slate-800 border-amber-500/30">
                <p className="whitespace-pre-line">{horoscope.healthGuidance}</p>
              </Card>
            </section>

            <Separator className="bg-amber-500/30" />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-amber-400">Personal Growth</h2>
              <Card className="p-6 bg-slate-800 border-amber-500/30">
                <p className="whitespace-pre-line">{horoscope.personalGrowth}</p>
              </Card>
            </section>

            <div className="flex justify-center pt-8 pb-12">
              <Button 
                onClick={generateFullHoroscope}
                className="bg-amber-500 hover:bg-amber-600 text-black"
                disabled={loading}
              >
                Regenerate Horoscope
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
