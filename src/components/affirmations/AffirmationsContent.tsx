
import React, { useEffect, useState } from 'react';
import { AffirmationCard } from '@/components/AffirmationCard';
import { useAffirmations } from '@/hooks/useAffirmations';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AffirmationsContentProps {
  selectedCategory: string;
  language: string;
}

export const AffirmationsContent: React.FC<AffirmationsContentProps> = ({ selectedCategory, language }) => {
  const affirmations = useAffirmations(language);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingImagesCount, setLoadingImagesCount] = useState(0);
  
  useEffect(() => {
    // Добавляем небольшую задержку для лучшего UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [affirmations]);
  
  const filteredAffirmations = selectedCategory === "all" 
    ? affirmations
    : affirmations.filter(aff => aff.categories.includes(selectedCategory));

  if (isLoading) {
    return (
      <div className="w-full grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full bg-cosmic-dark/80 border border-cosmic-accent/30 rounded-md overflow-hidden">
            <Skeleton className="h-40 w-full bg-gray-800/50" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2 bg-gray-800/50" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-800/50" />
              <Skeleton className="h-4 w-2/3 bg-gray-800/50" />
            </div>
          </div>
        ))}
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
