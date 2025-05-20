
import React from 'react';
import { Mission } from '@/types';
import { MissionCard } from '@/components/MissionCard';
import { NoMissions } from './NoMissions';

interface MissionsListProps {
  missions: Mission[];
}

export const MissionsList: React.FC<MissionsListProps> = ({ missions }) => {
  if (missions.length === 0) {
    return <NoMissions />;
  }
  
  return (
    <div className="space-y-6">
      {missions.map(mission => (
        <div key={mission.id} className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg overflow-hidden relative">
          {/* Background with slight gradient overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
            style={{ 
              backgroundImage: "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//mission-banner.jpg')",
              filter: 'brightness(1.3) contrast(1.2)',
            }}
          />
          
          <div className="relative z-10">
            <MissionCard 
              mission={mission}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
