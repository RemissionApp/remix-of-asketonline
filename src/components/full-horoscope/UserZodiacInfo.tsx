import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { zodiacData, ZodiacSign } from '@/utils/zodiac';
import { Star, Calendar } from 'lucide-react';

interface UserZodiacInfoProps {
  zodiacSign: ZodiacSign;
  birthDate: string;
  userName: string | null;
  language: string;
  uiText: any;
}

export const UserZodiacInfo: React.FC<UserZodiacInfoProps> = ({
  zodiacSign,
  birthDate,
  userName,
  language,
  uiText,
}) => {
  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName = zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en;
  
  const formattedDate = new Date(birthDate).toLocaleDateString(
    language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  );

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="text-4xl" title={zodiacName}>
              {zodiacInfo.symbol}
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">
                {userName ? `${userName} — ${zodiacName}` : zodiacName}
              </h2>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formattedDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-white/70">
            <Star className="h-4 w-4" />
            <span className="text-sm">{uiText.personalizedReading}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};