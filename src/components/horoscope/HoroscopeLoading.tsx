import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CardHeader, CardContent } from '@/components/ui/card';
import { HoroscopeHeader } from './sections/HoroscopeHeader';

interface HoroscopeLoadingProps {
  zodiacInfo: any;
  translations: any;
  language: string;
}

export const HoroscopeLoading: React.FC<HoroscopeLoadingProps> = ({
  zodiacInfo,
  translations,
  language,
}) => {
  return (
    <>
      <CardHeader>
        <HoroscopeHeader
          zodiacInfo={zodiacInfo}
          translations={translations}
          language={language}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-cosmic-accent/70 italic text-center">
          {translations.loading[language] || translations.loading.en}
        </p>
        <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
          <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
          <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
          <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
        </div>
      </CardContent>
    </>
  );
};
