import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Loader2 } from 'lucide-react';
import { ZodiacSign } from '@/utils/zodiac';

interface DailyHoroscopeCardProps {
  zodiacSign: ZodiacSign;
  horoscope: { description: string } | null;
  loading: boolean;
  onGenerate: () => void;
  uiText: any;
}

export const DailyHoroscopeCard: React.FC<DailyHoroscopeCardProps> = ({
  zodiacSign,
  horoscope,
  loading,
  onGenerate,
  uiText,
}) => {
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5" />
          {uiText.dailyTitle} ({todayFormatted})
        </CardTitle>
        <CardDescription className="text-white/80">
          {uiText.dailyDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!horoscope && !loading && (
          <Button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={loading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {uiText.generateDailyButton}
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-300" />
              <p className="text-white/80">{uiText.loadingDaily}</p>
            </div>
          </div>
        )}

        {horoscope && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/90 leading-relaxed">
                {horoscope.description}
              </p>
            </div>
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