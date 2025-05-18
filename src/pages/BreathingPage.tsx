
import React from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';

const BreathingPage: React.FC = () => {
  return (
    <MeditationLayout title="Breathing Exercises">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Breathing Exercises</h2>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          {/* Здесь будут упражнения для дыхания */}
        </div>
      </div>
    </MeditationLayout>
  );
};

export default BreathingPage;
