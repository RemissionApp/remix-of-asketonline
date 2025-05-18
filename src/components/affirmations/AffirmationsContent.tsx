
import React, { useEffect, useState } from 'react';
import { AffirmationCard } from '@/components/AffirmationCard';
import { useAffirmations } from '@/hooks/useAffirmations';
import { Loader2 } from 'lucide-react';

interface AffirmationsContentProps {
  selectedCategory: string;
  language: string;
}

export const AffirmationsContent: React.FC<AffirmationsContentProps> = ({ selectedCategory, language }) => {
  const affirmations = useAffirmations(language);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Добавляем небольшую задержку для лучшего UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [affirmations]);
  
  const filteredAffirmations = selectedCategory === "all" 
    ? affirmations
    : affirmations.filter(aff => aff.categories.includes(selectedCategory));

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-cosmic-accent animate-spin mb-2" />
        <p className="text-white/80">
          {language === 'ru' ? 'Загрузка аффирмаций...' : 
           language === 'es' ? 'Cargando afirmaciones...' : 
           'Loading affirmations...'}
        </p>
      </div>
    );
  }

  // Если нет аффирмаций для выбранной категории
  if (filteredAffirmations.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-white/80">
          {language === 'ru' ? 'Нет доступных аффирмаций для этой категории.' : 
           language === 'es' ? 'No hay afirmaciones disponibles para esta categoría.' : 
           'No affirmations available for this category.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full grid gap-4 md:grid-cols-2">
      {filteredAffirmations.map((affirmation) => (
        <AffirmationCard 
          key={affirmation.id}
          affirmation={affirmation}
          language={language}
        />
      ))}
    </div>
  );
};
