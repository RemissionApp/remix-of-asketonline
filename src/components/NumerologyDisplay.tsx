import React from 'react';
import { Calculator } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { NumerologyContent } from '@/components/numerology/NumerologyContent';

export const NumerologyDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();

  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    return null;
  }

  // Calculate numerology numbers based on birth date
  const birthDate = new Date(userProfile.birthDate);
  const birthDateString = birthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

  // Calculate Life Path Number
  const lifePathNumber = calculateLifePathNumber(birthDateString);

  // Calculate Expression Number (based on full name)
  const expressionNumber = calculateExpressionNumber(userProfile.name || '');

  // Calculate Personality Number (based on consonants in name)
  const personalityNumber = calculatePersonalityNumber(userProfile.name || '');

  // Get appropriate title and description based on language
  const title =
    language === 'ru'
      ? 'Нумерологический анализ'
      : language === 'es'
        ? 'Análisis numerológico'
        : 'Numerological Analysis';

  const description =
    language === 'ru'
      ? 'Откройте тайны чисел и их влияние на вашу жизнь'
      : language === 'es'
        ? 'Descubre los secretos de los números y su influencia en tu vida'
        : 'Discover the secrets of numbers and their influence on your life';

  // Get appropriate text for "Numerology" and "Life Path" based on language
  const numerologyText =
    language === 'ru'
      ? 'Нумерология'
      : language === 'es'
        ? 'Numerología'
        : 'Numerology';
  const lifePathText =
    language === 'ru'
      ? 'Путь жизни'
      : language === 'es'
        ? 'Sendero de vida'
        : 'Life Path';
  const expressionText =
    language === 'ru'
      ? 'Число выражения'
      : language === 'es'
        ? 'Número de expresión'
        : 'Expression Number';
  const personalityText =
    language === 'ru'
      ? 'Число личности'
      : language === 'es'
        ? 'Número de personalidad'
        : 'Personality Number';
  const moreDetailsText =
    language === 'ru'
      ? 'Подробнее'
      : language === 'es'
        ? 'Más detalles'
        : 'More details';

  // Create the numerology content component
  return (
    <div className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-accent/20 via-cosmic-dark/60 to-cosmic-indigo/25 p-5 shadow-lg shadow-cosmic-accent/10">
      <div className="flex items-start gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent/80 to-cosmic-indigo/70 shadow-[0_0_30px_rgba(139,92,246,0.25)]">
          <Calculator size={26} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h3
              className={`text-base sm:text-xl font-medium text-white ${
                language === 'en' ? 'font-serif' : 'font-display'
              }`}
            >
              {numerologyText}
            </h3>
            <p className="mt-0.5 text-xs text-cosmic-secondary">{description}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <NumerologyContent
              lifePathNumber={lifePathNumber}
              expressionNumber={expressionNumber}
              personalityNumber={personalityNumber}
              title={title}
              description={description}
              lifePathText={lifePathText}
              expressionText={expressionText}
              personalityText={personalityText}
              moreDetailsText={moreDetailsText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for numerology calculations
function calculateLifePathNumber(birthDate: string): number {
  const numbers = birthDate.replace(/-/g, '').split('').map(Number);
  let sum = numbers.reduce((acc, num) => acc + num, 0);

  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((acc, num) => acc + num, 0);
  }

  return sum;
}

function calculateExpressionNumber(name: string): number {
  const letterValues: { [key: string]: number } = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 1,
    k: 2,
    l: 3,
    m: 4,
    n: 5,
    o: 6,
    p: 7,
    q: 8,
    r: 9,
    s: 1,
    t: 2,
    u: 3,
    v: 4,
    w: 5,
    x: 6,
    y: 7,
    z: 8,
  };

  const letters = name
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('');
  let sum = letters.reduce(
    (acc, letter) => acc + (letterValues[letter] || 0),
    0
  );

  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((acc, num) => acc + num, 0);
  }

  return sum;
}

function calculatePersonalityNumber(name: string): number {
  const consonantValues: { [key: string]: number } = {
    b: 2,
    c: 3,
    d: 4,
    f: 6,
    g: 7,
    h: 8,
    j: 1,
    k: 2,
    l: 3,
    m: 4,
    n: 5,
    p: 7,
    q: 8,
    r: 9,
    s: 1,
    t: 2,
    v: 4,
    w: 5,
    x: 6,
    z: 8,
  };

  const consonants = name
    .toLowerCase()
    .replace(/[^bcdfghjklmnpqrstvwxz]/g, '')
    .split('');
  let sum = consonants.reduce(
    (acc, consonant) => acc + (consonantValues[consonant] || 0),
    0
  );

  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((acc, num) => acc + num, 0);
  }

  return sum;
}
