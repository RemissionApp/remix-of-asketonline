
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { zodiacData } from '@/utils/zodiac';
import { formatDateLong } from '@/utils/dateFormatUtils';

interface PageHeaderProps {
  currentYear: number;
  userName?: string;
  birthDate?: string | Date | null;
  zodiacSign?: string | null;
  language: string;
  uiText: {
    pageTitle: string;
    backButton: string;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  currentYear,
  userName,
  birthDate,
  zodiacSign,
  language,
  uiText
}) => {
  const navigate = useNavigate();
  
  // Format birthdate according to the selected language
  const formattedBirthDate = birthDate 
    ? formatDateLong(birthDate, language as any) 
    : '';
  
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-3xl font-bold text-amber-400">{uiText.pageTitle}</h1>
        {userName && zodiacSign && (
          <p className="text-gray-300 mt-1">
            {userName}, {formattedBirthDate}, 
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
  );
};
