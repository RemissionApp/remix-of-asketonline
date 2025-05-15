
import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { CosmicButton } from '@/components/CosmicButton';

export const UniverseChatBlock: React.FC = () => {
  const { userProfile } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    navigate('/universe-chat');
  };
  
  const chatContent = (
    <div 
      className="cosmic-block relative overflow-hidden flex flex-col bg-cosmic-dark/70 backdrop-blur-sm border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto"
      style={{
        backgroundImage: 'url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//un1.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 bg-cosmic-dark/60 backdrop-blur-sm"></div>
      
      <div className="flex items-center z-10 mb-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cosmic-accent/20 mr-3">
          <MessageSquare size={20} className="text-cosmic-accent" />
        </div>
        <div>
          <h3 className="text-cosmic-accent text-base font-medium">
            {t.universe?.chatTitle || "Диалог со Вселенной"}
          </h3>
          <p className="text-sm text-cosmic-secondary">
            {t.universe?.chatDescription || "Задайте вопрос Вселенной"}
          </p>
        </div>
      </div>
      
      <CosmicButton 
        onClick={handleChatClick} 
        size="sm" 
        variant="outline" 
        className="self-end mt-2 z-10"
      >
        {t.universe?.enterChat || "Начать диалог"} 
        <ArrowRight size={16} />
      </CosmicButton>
    </div>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title={t.universe?.chatProTitle || "Диалог со Вселенной"}
        message={t.universe?.chatProMessage || "Разблокируй PRO чтобы вести диалог со Вселенной"}
        className="mb-6 w-full max-w-lg mx-auto"
      >
        {chatContent}
      </ProFeatureOverlay>
    );
  }
  
  return chatContent;
};
