
import React from 'react';
import FeatureComparison from '@/components/FeatureComparison';
import { StarField } from '@/components/StarField';

const ComparisonPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      <div className="relative z-10 flex-1 container mx-auto px-4 py-8">
        <FeatureComparison />
      </div>
    </div>
  );
};

export default ComparisonPage;
