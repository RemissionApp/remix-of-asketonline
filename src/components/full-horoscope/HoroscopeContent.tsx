
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { translateSection } from '@/utils/zodiacTranslations';

interface HoroscopeContentProps {
  horoscope: any;
  language: string;
  onRegenerate: () => void;
  uiText: {
    regenerateButton: string;
  };
}

export const HoroscopeContent: React.FC<HoroscopeContentProps> = ({
  horoscope,
  language,
  onRegenerate,
  uiText
}) => {
  return (
    <div className="space-y-8">
      {Object.entries(horoscope).map(([key, content]) => (
        <section key={key}>
          <h2 className="text-2xl font-bold mb-4 text-amber-400 text-center">{translateSection(key, language as any)}</h2>
          <Card className="p-6 bg-slate-800/40 backdrop-blur-sm border-amber-500/30">
            <p className="whitespace-pre-line">{content as string}</p>
          </Card>
          {key !== 'personalGrowth' && <Separator className="bg-amber-500/30 mt-8" />}
        </section>
      ))}

      <div className="flex justify-center pt-8 pb-12">
        <Button 
          onClick={onRegenerate}
          className="bg-amber-500/80 hover:bg-amber-600/90 text-black backdrop-blur-sm"
        >
          {uiText.regenerateButton}
        </Button>
      </div>
    </div>
  );
};
