
import React from 'react';
import { AffirmationCard } from '@/components/AffirmationCard';
import { useAffirmations } from '@/hooks/useAffirmations';

interface AffirmationsContentProps {
  selectedCategory: string;
  language: string;
}

export const AffirmationsContent: React.FC<AffirmationsContentProps> = ({ selectedCategory, language }) => {
  const affirmations = useAffirmations(language);
  
  const filteredAffirmations = selectedCategory === "all" 
    ? affirmations
    : affirmations.filter(aff => aff.categories.includes(selectedCategory));

  return (
    <>
      {filteredAffirmations.map((affirmation) => (
        <AffirmationCard 
          key={affirmation.id}
          affirmation={affirmation}
          language={language}
        />
      ))}
    </>
  );
};
