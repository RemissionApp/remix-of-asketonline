import React, { useState } from 'react';
import { MeditationCard } from './MeditationCard';
import { MeditationPlayer } from './MeditationPlayer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Meditation } from '@/types';

interface MeditationSliderProps {
  meditations: Meditation[];
  onMeditationClick?: (meditation: Meditation) => void;
}

export const MeditationSlider: React.FC<MeditationSliderProps> = ({
  meditations,
  onMeditationClick,
}) => {
  const [activeMeditationId, setActiveMeditationId] = useState<string | null>(
    null
  );
  const activeMeditation = meditations.find(m => m.id === activeMeditationId);

  const handlePlayMeditation = (id: string) => {
    const meditation = meditations.find(m => m.id === id);
    if (meditation && onMeditationClick) {
      onMeditationClick(meditation);
    } else {
      setActiveMeditationId(id);
    }
  };

  const handleNextMeditation = () => {
    if (activeMeditationId) {
      const currentIndex = meditations.findIndex(
        m => m.id === activeMeditationId
      );
      if (currentIndex < meditations.length - 1) {
        setActiveMeditationId(meditations[currentIndex + 1].id);
      }
    }
  };

  const handlePreviousMeditation = () => {
    if (activeMeditationId) {
      const currentIndex = meditations.findIndex(
        m => m.id === activeMeditationId
      );
      if (currentIndex > 0) {
        setActiveMeditationId(meditations[currentIndex - 1].id);
      }
    }
  };

  return (
    <div className="w-full">
      {activeMeditation ? (
        <div className="mb-8">
          <MeditationPlayer
            audioSrc={activeMeditation.audioSrc || '/meditations/demo.mp3'}
            title={activeMeditation.title}
            coverImage={activeMeditation.image}
            onNext={handleNextMeditation}
            onPrevious={handlePreviousMeditation}
            onFinish={() => {}}
          />
        </div>
      ) : null}

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {meditations.map(meditation => (
            <CarouselItem
              key={meditation.id}
              className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3"
            >
              <MeditationCard
                title={meditation.title}
                description={meditation.description}
                duration={meditation.duration}
                image={meditation.image}
                locked={meditation.locked}
                requiresPro={meditation.requiresPro}
                onPlay={() => handlePlayMeditation(meditation.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static transform-none mx-0" />
          <CarouselNext className="static transform-none mx-0" />
        </div>
      </Carousel>
    </div>
  );
};
