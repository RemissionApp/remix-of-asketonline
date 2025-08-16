import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { MeditationSlider } from './MeditationSlider';
import { useNavigate } from 'react-router-dom';
import { Meditation } from '@/types';

interface MeditationTabContentProps {
  category: string;
  meditations: Meditation[];
  children?: React.ReactNode;
}

export const MeditationTabContent: React.FC<MeditationTabContentProps> = ({
  category,
  meditations,
  children,
}) => {
  const navigate = useNavigate();

  const categoryMeditations = meditations.filter(m => m.category === category);

  const handleMeditationClick = (meditation: Meditation) => {
    navigate('/meditation/session');
  };

  return (
    <TabsContent value={category} className="space-y-6">
      <MeditationSlider
        meditations={categoryMeditations}
        onMeditationClick={handleMeditationClick}
      />
      {children}
    </TabsContent>
  );
};
