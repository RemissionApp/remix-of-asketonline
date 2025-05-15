
import React from 'react';
import { UniverseChatPreview } from './UniverseChatPreview';
import { NumerologyPreview } from './NumerologyPreview';

export const ProFeaturesSection: React.FC = () => {
  return (
    <div className="space-y-6 mt-6 px-4 w-full max-w-md mx-auto">
      <UniverseChatPreview />
      <NumerologyPreview />
    </div>
  );
};
