
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';

export const CosmicMissionsEntryPoint: React.FC = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();
  
  const handleViewMissions = () => {
    navigate('/cosmic-missions');
  };
  
  const getTitle = () => {
    switch(language) {
      case 'ru': return 'Космические миссии';
      case 'es': return 'Misiones cósmicas';
      default: return 'Cosmic missions';
    }
  };
  
  const getButtonText = () => {
    switch(language) {
      case 'ru': return 'Открыть миссии';
      case 'es': return 'Ver misiones';
      default: return 'View missions';
    }
  };
  
  const getDescription = () => {
    switch(language) {
      case 'ru': return 'Выполняйте ритуалы, челленджи и цепочки заданий для получения наград';
      case 'es': return 'Completa rituales, desafíos y cadenas para ganar recompensas';
      default: return 'Complete rituals, challenges and chains to earn rewards';
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg overflow-hidden">
        <div 
          className="w-full bg-cover bg-center h-24 relative"
          style={{ 
            backgroundImage: "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//mission-banner.jpg')",
            backgroundPosition: 'center 30%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/30 to-cosmic-dark/80 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="bg-cosmic-accent/20 rounded-full p-2 mb-1">
                <Star size={24} className="text-cosmic-gold" />
              </div>
              <h3 className={language === 'en' ? "font-serif text-xl text-white" : "text-xl text-white"}>
                {getTitle()}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <p className={`text-sm text-cosmic-secondary mb-4 ${language === 'en' ? "font-serif" : ""}`}>
            {getDescription()}
          </p>
          
          <CosmicButton 
            onClick={handleViewMissions} 
            className="w-full"
            variant="outline"
          >
            {getButtonText()}
            <ChevronRight className="ml-1 w-4 h-4" />
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};
