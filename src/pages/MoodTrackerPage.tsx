
import React from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';

const MoodTrackerPage: React.FC = () => {
  return (
    <MeditationLayout title="Mood Tracker">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Track Your Mood</h2>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          {/* Здесь будет содержимое трекера настроения */}
        </div>
      </div>
    </MeditationLayout>
  );
};

export default MoodTrackerPage;
