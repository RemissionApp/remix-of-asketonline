
import React from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';

const MeditationsPage: React.FC = () => {
  return (
    <MeditationLayout title="Meditations">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Meditations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Здесь можно добавить карточки медитаций */}
        </div>
      </div>
    </MeditationLayout>
  );
};

export default MeditationsPage;
