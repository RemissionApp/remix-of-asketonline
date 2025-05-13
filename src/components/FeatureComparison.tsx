
import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

const FeatureComparison: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">{t.comparison.title}</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className="border-2">
          <CardHeader className="text-center bg-muted/20 pb-4">
            <CardTitle className="text-xl">ASKET</CardTitle>
            <p className="text-muted-foreground">{t.comparison.freePlan}</p>
            <p className="text-2xl font-bold mt-2">{t.comparison.free}</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {t.comparison.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 py-2 border-b">
                <div className="w-8">
                  {feature.free ? (
                    <CheckIcon className="text-green-500 h-5 w-5" />
                  ) : (
                    <XIcon className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
                <div>
                  <p>{feature.name}</p>
                  <p className="text-sm text-muted-foreground">{feature.freeDescription}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-primary">
          <CardHeader className="text-center bg-primary/10 pb-4">
            <CardTitle className="text-xl">ASKET PRO</CardTitle>
            <p className="text-muted-foreground">{t.comparison.proPlan}</p>
            <p className="text-2xl font-bold mt-2">{t.comparison.pricing}</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {t.comparison.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 py-2 border-b">
                <div className="w-8">
                  {feature.pro ? (
                    <CheckIcon className="text-green-500 h-5 w-5" />
                  ) : (
                    <XIcon className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
                <div>
                  <p>{feature.name}</p>
                  <p className="text-sm text-muted-foreground">{feature.proDescription || feature.freeDescription}</p>
                </div>
              </div>
            ))}
            <Button className="w-full mt-4">{t.comparison.upgradeButton}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureComparison;
