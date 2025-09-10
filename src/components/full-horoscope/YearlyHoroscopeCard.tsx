import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Loader2, Star, Briefcase, Heart, Shield, Target, Lightbulb } from 'lucide-react';
import { ZodiacSign } from '@/utils/zodiac';
import { translateSection } from '@/utils/zodiacTranslations';

interface YearlyHoroscopeCardProps {
  zodiacSign: ZodiacSign;
  horoscope: any | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
  language: string;
  currentYear: number;
  uiText: any;
}

const getSectionIcon = (sectionKey: string) => {
  switch (sectionKey) {
    case 'overallForecast':
      return Star;
    case 'careerFinance':
      return Briefcase;
    case 'loveRelationships':
      return Heart;
    case 'healthWellbeing':
      return Shield;
    case 'spiritualGrowth':
      return Target;
    case 'personalGrowth':
      return Lightbulb;
    default:
      return Star;
  }
};

export const YearlyHoroscopeCard: React.FC<YearlyHoroscopeCardProps> = ({
  zodiacSign,
  horoscope,
  loading,
  error,
  onGenerate,
  language,
  currentYear,
  uiText,
}) => {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5" />
          {uiText.yearlyTitle} {currentYear}
        </CardTitle>
        <CardDescription className="text-white/80">
          {uiText.yearlyDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {!horoscope && !loading && !error && (
          <Button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-300" />
              <p className="text-white/80">{uiText.loadingTitle}</p>
              <p className="text-white/60 text-sm">{uiText.loadingDescription}</p>
            </div>
          </div>
        )}

        {horoscope && (
          <div className="space-y-6">
            {Object.entries(horoscope).map(([key, content]) => {
              const Icon = getSectionIcon(key);
              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-purple-300" />
                    <h3 className="text-lg font-semibold text-white">
                      {translateSection(key, language as any)}
                    </h3>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 leading-relaxed whitespace-pre-line">
                      {content as string}
                    </p>
                  </div>
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