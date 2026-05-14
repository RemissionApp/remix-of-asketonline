import React from 'react';
import FeatureComparison from '@/components/FeatureComparison';
import { StarField } from '@/components/StarField';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { isWebPlatform } from '@/utils/platform';
import { Smartphone } from 'lucide-react';

const ComparisonPage: React.FC = () => {
  const web = isWebPlatform();
  return (
    <div className="min-h-screen flex flex-col relative pb-page">
      <StarField starCount={100} />

      <PageHeader title="Сравнение тарифов" />

      <div className="relative z-10 flex-1 container mx-auto px-4 pt-page py-8">
        {web && (
          <div className="max-w-3xl mx-auto mb-6 rounded-2xl border border-cosmic-gold/30 bg-cosmic-dark/60 backdrop-blur-md p-4 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-cosmic-gold shrink-0 mt-0.5" />
            <div className="text-sm text-cosmic-secondary leading-snug">
              <p className="text-foreground font-medium mb-1">
                Подписка через App Store / Google Play
              </p>
              <p>
                Для оформления оплаты с автопродлением скачайте приложение Asceta
                на iOS или Android. Покупки восстанавливаются на всех ваших
                устройствах под одним аккаунтом.
              </p>
            </div>
          </div>
        )}
        <FeatureComparison />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ComparisonPage;
