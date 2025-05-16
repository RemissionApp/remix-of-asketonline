
import React from 'react';
import { MeditationSlider } from '@/components/MeditationSlider';
import { Meditation } from '@/types';
import { TabsContent } from "@/components/ui/tabs";

interface MeditationTabContentProps {
  category: string;
  meditations: Meditation[];
  children?: React.ReactNode;
}

export const MeditationTabContent: React.FC<MeditationTabContentProps> = ({
  category,
  meditations,
  children
}) => {
  // Filter meditations by category
  const filteredMeditations = meditations.filter(meditation => meditation.category === category);

  return (
    <TabsContent value={category} className="w-full">
      <div className="space-y-4">
        <MeditationSlider meditations={filteredMeditations} />
        {children}
      </div>
    </TabsContent>
  );
};
