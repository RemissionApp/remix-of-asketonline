
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ZodiacSign, getZodiacSign, zodiacData } from '@/utils/zodiac';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Loader, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { translateSection } from '@/utils/zodiacTranslations';
import { formatDateLong } from '@/utils/dateFormatUtils';

interface FullHoroscopeData {
  personalityAnalysis: string;
  yearForecast: string;
  careerPath: string;
  relationshipForecast: string;
  healthGuidance: string;
  personalGrowth: string;
}

export default function FullHoroscopePage() {
  const { user, userProfile, language } = useAppStore();
  const [horoscope, setHoroscope] = useState<FullHoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get current year for the header display
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Determine zodiac sign from birth date
    if (userProfile?.birthDate) {
      const birthDate = new Date(userProfile.birthDate);
      const sign = getZodiacSign(birthDate);
      setZodiacSign(sign);
      console.log("Set zodiac sign:", sign, "from birthDate:", userProfile.birthDate);
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

  // Get UI translations for different languages
  const getUIText = () => {
    if (language === 'ru') {
      return {
        pageTitle: `Полный анализ на ${currentYear} год`,
        backButton: 'Назад',
        setBirthDateTitle: 'Укажите дату рождения',
        setBirthDateDescription: 'Чтобы сгенерировать полный анализ гороскопа, пожалуйста, добавьте дату рождения в вашем профиле.',
        goToProfileButton: 'Перейти в профиль',
        errorTitle: 'Ошибка',
        tryAgainButton: 'Попробовать снова',
        generateDescription: 'Сгенерируйте ваш полный космический профиль с анализом вашей личности, отношений, карьерного пути и многого другого, основанный на вашем знаке зодиака.',
        generateButton: 'Сгенерировать полный гороскоп',
        loadingTitle: 'Консультация со звездами и планетами для вашего полного космического профиля...',
        loadingDescription: 'Это может занять некоторое время, пока мы анализируем ваши космические закономерности',
        regenerateButton: 'Пересоздать гороскоп',
        userInfoPrefix: 'Персональный гороскоп для:'
      };
    } else if (language === 'es') {
      return {
        pageTitle: `Análisis completo para el año ${currentYear}`,
        backButton: 'Atrás',
        setBirthDateTitle: 'Establece tu fecha de nacimiento',
        setBirthDateDescription: 'Para generar tu análisis completo del horóscopo, por favor agrega tu fecha de nacimiento en tu perfil.',
        goToProfileButton: 'Ir al perfil',
        errorTitle: 'Error',
        tryAgainButton: 'Intentar de nuevo',
        generateDescription: 'Genera tu perfil cósmico completo con información sobre tu personalidad, relaciones, trayectoria profesional y más basado en tu signo zodiacal.',
        generateButton: 'Generar horóscopo completo',
        loadingTitle: 'Consultando a las estrellas y planetas para tu perfil cósmico completo...',
        loadingDescription: 'Esto puede tardar un momento mientras analizamos tus patrones celestiales',
        regenerateButton: 'Regenerar horóscopo',
        userInfoPrefix: 'Horóscopo personal para:'
      };
    } else {
      return {
        pageTitle: `Full Analysis for ${currentYear}`,
        backButton: 'Back',
        setBirthDateTitle: 'Set Your Birth Date',
        setBirthDateDescription: 'To generate your full horoscope analysis, please add your birth date in your profile.',
        goToProfileButton: 'Go to Profile',
        errorTitle: 'Error',
        tryAgainButton: 'Try Again',
        generateDescription: 'Generate your complete cosmic profile with insights into your personality, relationships, career path, and more based on your zodiac sign.',
        generateButton: 'Generate Full Horoscope',
        loadingTitle: 'Consulting the stars and planets for your complete cosmic profile...',
        loadingDescription: 'This may take a moment as we analyze your celestial patterns',
        regenerateButton: 'Regenerate Horoscope',
        userInfoPrefix: 'Personal horoscope for:'
      };
    }
  };

  const uiText = getUIText();

  // Format birthdate according to the selected language
  const formattedBirthDate = userProfile?.birthDate 
    ? formatDateLong(userProfile.birthDate, language as any) 
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-400">{uiText.pageTitle}</h1>
            {userProfile && zodiacSign && (
              <p className="text-gray-300 mt-1">
                {uiText.userInfoPrefix} {userProfile.name}, {formattedBirthDate}, 
                <span className="ml-1 text-amber-300">
                  {zodiacData[zodiacSign].symbol} {language === 'ru' 
                    ? zodiacData[zodiacSign].name.ru 
                    : language === 'es' 
                      ? zodiacData[zodiacSign].name.es
                      : zodiacData[zodiacSign].name.en
                  }
                </span>
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="border-amber-400 text-amber-400 hover:bg-amber-400/10"
          >
            {uiText.backButton}
          </Button>
        </div>

        {!zodiacSign && (
          <Card className="p-6 mb-8 bg-slate-800 border-amber-500/30">
            <h2 className="text-xl font-semibold mb-4 text-amber-300">{uiText.setBirthDateTitle}</h2>
            <p className="mb-4">{uiText.setBirthDateDescription}</p>
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              {uiText.goToProfileButton}
            </Button>
          </Card>
        )}

        {error && (
          <Card className="p-6 mb-8 bg-slate-800 border-red-500/30">
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <AlertCircle size={20} />
              <h2 className="text-xl font-semibold">{uiText.errorTitle}</h2>
            </div>
            <p className="mb-4">{error}</p>
            <Button 
              onClick={() => {
                setError(null);
                generateFullHoroscope();
              }}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              {uiText.tryAgainButton}
            </Button>
          </Card>
        )}

        {zodiacSign && !horoscope && !loading && !error && (
          <Card className="p-6 mb-8 bg-slate-800 border-amber-500/30">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{zodiacData[zodiacSign].symbol}</span>
              <div>
                <h2 className="text-xl font-semibold text-amber-300">
                  {language === 'ru' ? zodiacData[zodiacSign].name.ru :
                   language === 'es' ? zodiacData[zodiacSign].name.es :
                   zodiacData[zodiacSign].name.en}
                </h2>
                <p className="text-gray-400">{zodiacData[zodiacSign].dates}</p>
              </div>
            </div>
            <p className="mb-6">{uiText.generateDescription}</p>
            <Button 
              onClick={generateFullHoroscope}
              className="bg-amber-500 hover:bg-amber-600 text-black"
              disabled={loading}
            >
              {uiText.generateButton}
            </Button>
          </Card>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin mb-4">
              <Loader className="h-12 w-12 text-amber-400" />
            </div>
            <p className="text-amber-300 text-lg">{uiText.loadingTitle}</p>
            <p className="text-gray-400 mt-2">{uiText.loadingDescription}</p>
          </div>
        )}

        {horoscope && (
          <div className="space-y-8">
            {Object.entries(horoscope).map(([key, content]) => (
              <section key={key}>
                <h2 className="text-2xl font-bold mb-4 text-amber-400">{translateSection(key, language as any)}</h2>
                <Card className="p-6 bg-slate-800 border-amber-500/30">
                  <p className="whitespace-pre-line">{content}</p>
                </Card>
                {key !== 'personalGrowth' && <Separator className="bg-amber-500/30 mt-8" />}
              </section>
            ))}

            <div className="flex justify-center pt-8 pb-12">
              <Button 
                onClick={generateFullHoroscope}
                className="bg-amber-500 hover:bg-amber-600 text-black"
                disabled={loading}
              >
                {uiText.regenerateButton}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
