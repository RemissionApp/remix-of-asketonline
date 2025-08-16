import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { DetailedHoroscope, HoroscopeTranslations } from '@/types/horoscope';
import { ZodiacInfo } from '@/utils/zodiac';
import { HoroscopeHeader } from './HoroscopeHeader';
import { HoroscopeContent } from './HoroscopeContent';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { createLogger } from '@/utils/loggerUtils';

interface HoroscopeDisplayProps {
  horoscope: DetailedHoroscope;
  translations: HoroscopeTranslations;
  language: string;
  zodiacInfo: ZodiacInfo;
  userName?: string;
  onRegenerate?: () => void;
}

export const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({
  horoscope,
  translations,
  language,
  zodiacInfo,
  userName,
  onRegenerate,
}) => {
  const logger = createLogger('HoroscopeDisplay');

  // Enhanced debugging logs
  logger.debug('Component rendering', {
    horoscopeExists: !!horoscope,
    sections: horoscope?.sections ? Object.keys(horoscope.sections) : [],
    sectionValues: horoscope?.sections
      ? Object.entries(horoscope.sections).map(
          ([key, value]) =>
            `${key}: ${value ? value.substring(0, 30) + '...' : 'missing'}`
        )
      : [],
    generalAtmosphere: horoscope?.sections?.general_atmosphere
      ? horoscope.sections.general_atmosphere.substring(0, 30) + '...'
      : 'No general_atmosphere',
  });

  const handleRegenerate = () => {
    logger.info('Regenerate button clicked');
    if (onRegenerate) {
      logger.info('Calling onRegenerate function');
      onRegenerate();
    } else {
      logger.warn('No onRegenerate function provided');
    }
  };

  return (
    <Card className="border-cosmic-accent/20 bg-cosmic-dark/50 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <HoroscopeHeader
          zodiacInfo={zodiacInfo}
          translations={translations}
          language={language}
          userName={userName}
        />

        {/* Developer regenerate button with enhanced click handler */}
        {onRegenerate && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
            >
              <RefreshCw size={16} className="mr-1" />
              {language === 'ru' ? 'Пересоздать' : 'Regenerate'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6 pb-6">
        <HoroscopeContent
          horoscope={horoscope}
          translations={translations}
          language={language}
        />
      </CardContent>
    </Card>
  );
};
