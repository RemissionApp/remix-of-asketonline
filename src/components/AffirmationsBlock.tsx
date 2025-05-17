
import React from 'react';
import { TextCursor } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { CosmicButton } from '@/components/CosmicButton';

export const AffirmationsBlock: React.FC = () => {
  const { language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleAffirmationsClick = () => {
    navigate('/affirmations');
  };

  // Determine the correct font class based on language - matching other headings in the app
  const headingFontClass = language === 'en' ? 'font-serif' : 'font-sans';
  
  // Translation for the title
  const affirmationsTitle = language === 'ru' ? 'Аффирмации' : 
                          language === 'es' ? 'Afirmaciones' : 'Affirmations';
  
  return (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 relative overflow-hidden">
      {/* Background image with reflection effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70 z-0"
        style={{ 
          backgroundImage: `url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//affirmation.png)`,
          filter: 'brightness(1.7) contrast(1.2)', // Increased brightness by 70% (up from 40%)
          transform: 'scaleX(-1)' // This creates the reflection effect (mirror)
        }}
      />
      
      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent relative z-10">
        <div className="flex items-center mb-4">
          <div className="cosmic-block-icon-wrapper bg-cosmic-dark/60">
            <TextCursor size={24} className="text-cosmic-accent" />
          </div>
          
          <h3 className={`text-xl ${headingFontClass} font-medium text-white`}>
            {affirmationsTitle}
          </h3>
        </div>
        
        <p className="text-white mb-4 text-shadow text-center">
          {language === 'ru' ? 'Позитивные утверждения для вдохновения и личностного роста.' : 
           language === 'es' ? 'Afirmaciones positivas para inspiración y crecimiento personal.' : 
           'Positive affirmations for inspiration and personal growth.'}
        </p>
        
        <CosmicButton 
          onClick={handleAffirmationsClick} 
          size="md"
          variant="default"
          className="w-full bg-gradient-to-r from-purple-500/60 to-indigo-500/50 hover:from-purple-500/70 hover:to-indigo-500/60 backdrop-blur-md border border-white/20"
        >
          {language === 'ru' ? 'Открыть аффирмации' : 
           language === 'es' ? 'Abrir afirmaciones' : 'Open affirmations'}
        </CosmicButton>
      </div>
    </div>
  );
};
