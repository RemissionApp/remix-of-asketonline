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
  zodiacInfo,
}) => {
  console.log('Rendering ProOverlay for zodiacInfo:', zodiacInfo);

  return (
    <ProFeatureOverlay
      title={translations.proTitle[language] || translations.proTitle.en}
      message={translations.proMessage[language] || translations.proMessage.en}
    >
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="text-cosmic-gold" size={20} />
            <h3 className="text-lg font-medium">
              {translations.title[language] || translations.title.en}
            </h3>
          </div>
          <div className="text-sm text-muted-foreground">
            {zodiacInfo?.symbol}{' '}
            {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
          </div>
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
