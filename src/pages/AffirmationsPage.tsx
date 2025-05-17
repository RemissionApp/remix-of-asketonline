
import React from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';

const AffirmationsPage: React.FC = () => {
  const { language } = useAppStore();

  // Translation for the title
  const affirmationsTitle = language === 'ru' ? 'Аффирмации' : 
                          language === 'es' ? 'Afirmaciones' : 'Affirmations';

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      <TopBar />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center mt-16">
        <h1 className="text-2xl font-medium text-white mb-6">
          {affirmationsTitle}
        </h1>
        
        <div className="max-w-md w-full bg-cosmic-dark/80 backdrop-blur-md border border-cosmic-accent/30 rounded-lg p-6 mb-6">
          <p className="text-white text-center">
            {language === 'ru' ? 'Страница аффирмаций будет доступна в ближайшем обновлении.' : 
             language === 'es' ? 'La página de afirmaciones estará disponible en la próxima actualización.' : 
             'The affirmations page will be available in an upcoming update.'}
          </p>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default AffirmationsPage;
