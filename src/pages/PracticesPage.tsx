
import React from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';

const PracticesPage: React.FC = () => {
  return (
    <MeditationLayout title="Practices">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Available Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Здесь можно добавить карточки практик */}
        </div>
      </div>
    </MeditationLayout>
  );
};

export default PracticesPage;
