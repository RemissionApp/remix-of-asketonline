import React from 'react';
import FeatureComparison from '@/components/FeatureComparison';
import { StarField } from '@/components/StarField';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
const ComparisonPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative pb-page">
      <StarField starCount={100} />

      <PageHeader title="Сравнение тарифов" />

      <div className="relative z-10 flex-1 container mx-auto px-4 pt-page py-8">
        <FeatureComparison />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ComparisonPage;
