import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface BriefHoroscopeLoadingProps {
  language: string;
}

export const BriefHoroscopeLoading: React.FC<BriefHoroscopeLoadingProps> = ({
  language,
}) => {
  // Translations for loading text
  const loadingText =
    {
      ru: 'Соединяемся с космосом...',
      en: 'Connecting with the cosmos...',
      es: 'Conectando con el cosmos...',
    }[language] || 'Connecting with the cosmos...';

  return (
    <>
      <p className="text-cosmic-accent italic">{loadingText}</p>
      <Skeleton className="h-20 w-full bg-cosmic-accent/10 rounded-md" />
    </>
  );
};
