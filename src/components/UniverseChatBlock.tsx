
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';

export const UniverseChatBlock: React.FC = () => {
  const { userProfile } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    navigate('/universe-chat');
  };
  
  const chatContent = (
    <div 
      onClick={handleChatClick}
      className="flex items-center bg-cosmic-dark/70 backdrop-blur-sm border border-cosmic-accent/30 rounded-md p-3 cursor-pointer hover:bg-cosmic-dark/90 transition-colors mb-6"
    >
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-cosmic-accent/20 mr-3">
        <MessageSquare size={16} className="text-cosmic-accent" />
      </div>
      <div>
        <h3 className="text-cosmic-accent text-sm font-medium">
          {t.universe?.chatTitle || "Диалог со Вселенной"}
        </h3>
        <p className="text-xs text-cosmic-secondary">
          {t.universe?.askUniverse || "Задайте вопрос Вселенной"}
        </p>
      </div>
    </div>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title={t.universe?.chatProTitle || "Диалог со Вселенной"}
        message={t.universe?.chatProMessage || "Разблокируй PRO чтобы вести диалог со Вселенной"}
        className="mb-6"
      >
        {chatContent}
      </ProFeatureOverlay>
    );
  }
  
  return chatContent;
};
