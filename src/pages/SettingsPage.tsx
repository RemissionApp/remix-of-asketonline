
import React from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';

const SettingsPage: React.FC = () => {
  return (
    <MeditationLayout title="Settings">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Settings</h2>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          {/* Здесь будут настройки приложения */}
        </div>
      </div>
    </MeditationLayout>
  );
};

export default SettingsPage;
