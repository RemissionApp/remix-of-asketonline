
import React from 'react';

interface AffirmationsFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  language: string;
}

export const AffirmationsFilter: React.FC<AffirmationsFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  language
}) => {
  const categories = [
    { id: "all", name: language === 'ru' ? 'Все' : language === 'es' ? 'Todos' : 'All' },
    { id: "success", name: language === 'ru' ? 'Успех' : language === 'es' ? 'Éxito' : 'Success' },
    { id: "confidence", name: language === 'ru' ? 'Уверенность' : language === 'es' ? 'Confianza' : 'Confidence' },
    { id: "wellbeing", name: language === 'ru' ? 'Благополучие' : language === 'es' ? 'Bienestar' : 'Well-being' },
    { id: "love", name: language === 'ru' ? 'Любовь' : language === 'es' ? 'Amor' : 'Love' },
    { id: "abundance", name: language === 'ru' ? 'Изобилие' : language === 'es' ? 'Abundancia' : 'Abundance' },
  ];

  return (
    <div className="w-full max-w-2xl mb-6 overflow-x-auto">
      <div className="flex space-x-2 p-1 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${selectedCategory === category.id 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md' 
                : 'bg-cosmic-dark/60 text-white/70 hover:bg-cosmic-dark/80'}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
