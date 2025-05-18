
import React from 'react';

interface AffirmationsIntroProps {
  language: string;
}

export const AffirmationsIntro: React.FC<AffirmationsIntroProps> = ({ language }) => {
  const introText = language === 'ru' 
    ? 'Выберите аффирмацию, медитируйте над ней и повторяйте ежедневно для трансформирующего эффекта.'
    : language === 'es'
      ? 'Selecciona una afirmación, medita sobre ella y repítela diariamente para un efecto transformador.'
      : 'Choose an affirmation, meditate on it, and repeat it daily for transformative effect.';
  
  return (
    <p className="text-white/80 text-center mb-8 backdrop-blur-sm bg-cosmic-dark/30 p-4 rounded-lg border border-cosmic-accent/20 max-w-2xl mx-auto">
      {introText}
    </p>
  );
};
