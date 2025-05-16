
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
          <Button 
            variant="outline" 
            className="border-cosmic-accent text-cosmic-accent hover:bg-cosmic-accent/20"
            onClick={() => navigate('/profile')}
          >
            {language === 'ru' ? 'Перейти в профиль' : 'Go to profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
