
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
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 relative overflow-hidden">
      {/* Background image with reflection effect */}
      <div 
        className="absolute inset-0 bg-cover bg-left opacity-60 z-0"
        style={{ 
          backgroundImage: `url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//meditation2.png)`,
          filter: 'brightness(1.9) contrast(1.15)', // Increased brightness by 40% (from 1.7 to 1.9)
          transform: 'scaleX(-1)' // This creates the reflection effect (mirror)
        }}
      />
      
      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent relative z-10">
        <div className="flex items-center mb-4">
          <div className="cosmic-block-icon-wrapper bg-cosmic-dark/60">
            <Headphones size={24} className="text-cosmic-accent" />
          </div>
          
          <h3 className={`text-xl ${headingFontClass} font-medium text-white`}>
            {meditationTitle}
          </h3>
        </div>
        
        <p className="text-white mb-4 text-shadow">
          {language === 'ru' ? 'Откройте для себя коллекцию медитаций, которые помогут вам в вашем пути.' : 
           language === 'es' ? 'Descubre una colección de meditaciones que te ayudarán en tu camino.' : 
           'Discover a collection of meditations to help you on your journey.'}
        </p>
        
        <CosmicButton 
          onClick={handleMeditationClick} 
          size="md"
          variant="default"
          className="w-full bg-gradient-to-r from-cosmic-accent/60 to-cosmic-indigo/50 hover:from-cosmic-accent/70 hover:to-cosmic-indigo/60 backdrop-blur-md border border-white/20"
        >
          {language === 'ru' ? 'Открыть медитации' : 
           language === 'es' ? 'Abrir meditaciones' : 'Open meditations'}
        </CosmicButton>
      </div>
    </div>
  );
};
