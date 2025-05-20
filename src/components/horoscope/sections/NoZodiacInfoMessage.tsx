
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CosmicButton } from '@/components/CosmicButton';
import { useNavigate } from 'react-router-dom';
import { HoroscopeHeader } from './HoroscopeHeader';

interface NoZodiacInfoMessageProps {
  translations: any;
  language: string;
  userName?: string;
}

export const NoZodiacInfoMessage: React.FC<NoZodiacInfoMessageProps> = ({
  translations,
  language,
  userName
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-cosmic-accent/20 bg-cosmic-dark/50 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <HoroscopeHeader 
          zodiacInfo={null}
          translations={translations}
          language={language}
          userName={userName}
        />
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 space-y-4">
          <p className="text-cosmic-accent">
            {language === 'ru' 
              ? 'Пожалуйста, укажите дату рождения в профиле, чтобы увидеть свой гороскоп.'
              : 'Please set your birth date in your profile to see your horoscope.'}
          </p>
          <CosmicButton 
            variant="outline"
            onClick={() => navigate('/profile')}
          >
            {language === 'ru' ? 'Перейти в профиль' : 'Go to profile'}
          </CosmicButton>
        </div>
      </CardContent>
    </Card>
  );
};
