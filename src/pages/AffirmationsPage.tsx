
import React, { useState } from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';
import { Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { AffirmationsFilter } from '@/components/affirmations/AffirmationsFilter';
import { AffirmationsIntro } from '@/components/affirmations/AffirmationsIntro';
import { AffirmationsContent } from '@/components/affirmations/AffirmationsContent';

const AffirmationsPage: React.FC = () => {
  const { language } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Translation for the title
  const affirmationsTitle = language === 'ru' ? 'Аффирмации' : 
                          language === 'es' ? 'Afirmaciones' : 'Affirmations';

  return (
    <MeditationLayout 
      title={affirmationsTitle}
      icon={<Sparkles size={24} className="text-purple-400 mr-3" />}
    >
      {/* Categories filter */}
      <AffirmationsFilter 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        language={language} 
      />
      
      {/* Affirmations */}
      <div className="w-full max-w-2xl space-y-4 pb-20">
        <AffirmationsIntro language={language} />
        <AffirmationsContent selectedCategory={selectedCategory} language={language} />
      </div>
    </MeditationLayout>
  );
};

export default AffirmationsPage;
