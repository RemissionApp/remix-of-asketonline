
import React from 'react';
import { Headphones } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { CosmicButton } from '@/components/CosmicButton';

export const MeditationBlock: React.FC = () => {
  const { language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleMeditationClick = () => {
    navigate('/meditation');
  };

  // Determine the correct font class based on language - matching other headings in the app
  const headingFontClass = language === 'en' ? 'font-serif' : 'font-sans';
  
  // Translation for the title
  const meditationTitle = language === 'ru' ? 'Медитации' : 
                          language === 'es' ? 'Meditaciones' : 'Meditations';
  
  return (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6">
      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent">
        <div className="flex items-center mb-4">
          <div className="cosmic-block-icon-wrapper">
            <Headphones size={24} className="text-cosmic-accent" />
          </div>
          
          <h3 className={`text-xl ${headingFontClass} font-medium text-white`}>
            {meditationTitle}
          </h3>
        </div>
        
        <p className="text-cosmic-secondary mb-4">
          {language === 'ru' ? 'Откройте для себя коллекцию медитаций, которые помогут вам в вашем пути.' : 
           language === 'es' ? 'Descubre una colección de meditaciones que te ayudarán en tu camino.' : 
           'Discover a collection of meditations to help you on your journey.'}
        </p>
        
        <CosmicButton 
          onClick={handleMeditationClick} 
          size="sm"
          variant="outline"
          className="w-full"
        >
          <Headphones size={16} className="mr-1" />
          {language === 'ru' ? 'Открыть медитации' : 
           language === 'es' ? 'Abrir meditaciones' : 'Open meditations'}
        </CosmicButton>
      </div>
    </div>
  );
};
