
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
      className="relative overflow-hidden flex items-center bg-cosmic-dark/70 backdrop-blur-sm border border-cosmic-accent/30 rounded-md p-3 cursor-pointer hover:bg-cosmic-dark/90 transition-colors mb-6"
      style={{
        backgroundImage: 'url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//un1.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '64px'
      }}
    >
      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 bg-cosmic-dark/60 backdrop-blur-sm"></div>
      
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-cosmic-accent/20 mr-3 z-10">
        <MessageSquare size={16} className="text-cosmic-accent" />
      </div>
      <div className="z-10">
        <h3 className="text-cosmic-accent text-sm font-medium">
          {t.universe?.chatTitle || "Диалог со Вселенной"}
        </h3>
        <p className="text-xs text-cosmic-secondary">
          {t.universe?.chatDescription || "Задайте вопрос Вселенной"}
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
