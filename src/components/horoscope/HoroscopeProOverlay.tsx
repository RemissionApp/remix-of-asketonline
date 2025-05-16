
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { Star } from 'lucide-react';

interface HoroscopeProOverlayProps {
  translations: any;
  language: string;
  zodiacInfo: any;
}

export const HoroscopeProOverlay: React.FC<HoroscopeProOverlayProps> = ({
  translations,
  language,
  zodiacInfo
}) => {
  return (
    <ProFeatureOverlay
      title={translations.proTitle[language] || translations.proTitle.en}
      message={translations.proMessage[language] || translations.proMessage.en}
    >
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
        <CardHeader>
          <CardHeader className="flex items-center gap-2">
            <Star className="text-cosmic-gold" size={20} />
            {translations.title[language] || translations.title.en}
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
          </CardContent>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </ProFeatureOverlay>
  );
};
