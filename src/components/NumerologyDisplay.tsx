import React from 'react';
import { Calculator } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { NumerologyContent } from '@/components/numerology/NumerologyContent';
import { useRevenueCat } from '@/hooks/useRevenueCat';

export const NumerologyDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const { hasActiveSubscription } = useRevenueCat();

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
  const numerologyContent = (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <Calculator size={20} className="text-cosmic-accent" />
          </div>
          <div>
            <h3
              className={
                language === 'en'
                  ? 'font-serif font-medium'
                  : 'font-sans font-medium'
              }
            >
              {numerologyText}
            </h3>
          </div>
        </div>
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
  );

  // If user is not PRO, wrap with ProFeatureOverlay
  if (!hasActiveSubscription) {
    const proUnlockText =
      language === 'ru'
        ? 'Открой функции PRO'
        : language === 'es'
          ? 'Desbloquea funciones PRO'
          : 'Unlock PRO functions';

    return (
      <ProFeatureOverlay
        title={numerologyText}
        message={
          language === 'ru'
            ? 'Разблокируй PRO чтобы получить полный доступ к нумерологии'
            : language === 'es'
              ? 'Desbloquea PRO para obtener acceso completo a la numerología'
              : 'Unlock PRO to get full access to numerology'
        }
        className="mb-6 w-full"
        showPaywall={true}
        showUnlockPrompt={true}
        unlockText={proUnlockText}
      >
        {numerologyContent}
      </ProFeatureOverlay>
    );
  }

  return numerologyContent;
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
