import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CalendarDays, Loader2, Heart, Briefcase, Leaf, Star } from 'lucide-react';
import { ZodiacSign } from '@/utils/zodiac';

interface MonthlyHoroscopeData {
  generalForecast: string;
  careerFinance: string;
  loveRelationships: string;
  healthWellbeing: string;
  fullText: string;
}

interface MonthlyHoroscopeCardProps {
  zodiacSign: ZodiacSign;
  horoscope: MonthlyHoroscopeData | null;
  loading: boolean;
  onGenerate: () => void;
  uiText: any;
}

export const MonthlyHoroscopeCard: React.FC<MonthlyHoroscopeCardProps> = ({
  zodiacSign,
  horoscope,
  loading,
  onGenerate,
  uiText,
}) => {
  const currentMonth = new Date().toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  });

  const sections = horoscope ? [
    {
      title: uiText.generalForecast,
      content: horoscope.generalForecast,
      icon: Star,
    },
    {
      title: uiText.careerFinance,
      content: horoscope.careerFinance,
      icon: Briefcase,
    },
    {
      title: uiText.loveRelationships,
      content: horoscope.loveRelationships,
      icon: Heart,
    },
    {
      title: uiText.healthWellbeing,
      content: horoscope.healthWellbeing,
      icon: Leaf,
    },
  ] : [];

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CalendarDays className="h-5 w-5" />
          {uiText.monthlyTitle} ({currentMonth})
        </CardTitle>
        <CardDescription className="text-white/80">
          {uiText.monthlyDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!horoscope && !loading && (
          <Button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            disabled={loading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {uiText.generateMonthlyButton}
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-300" />
              <p className="text-white/80">{uiText.loadingMonthly}</p>
            </div>
          </div>
        )}

        {horoscope && (
          <div className="space-y-4">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="h-4 w-4 text-blue-300" />
                    <h4 className="font-medium text-white">{section.title}</h4>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {section.content}
                  </p>
                </div>
              );
            })}
            <Button
              onClick={onGenerate}
              variant="outline"
              className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
              disabled={loading}
            >
              {uiText.regenerateButton}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};