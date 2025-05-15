
import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { CosmicButton } from '@/components/CosmicButton';

export const UniverseChatPreview: React.FC = () => {
  const { userProfile } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleEnterChat = () => {
    navigate('/universe-chat');
  };
  
  const chatPreviewContent = (
    <Card className="bg-cosmic-dark/50 border-cosmic-accent/30 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-4">
            <MessageSquare size={28} className="text-cosmic-accent" />
          </div>
          <h3 className="text-xl font-serif text-cosmic-accent mb-2">
            {t.universe?.chatTitle || "Диалог со Вселенной"}
          </h3>
          <p className="text-cosmic-secondary mb-4 text-sm">
            {t.universe?.chatDescription || "Задавай любые вопросы и получай мудрые ответы напрямую от Вселенной"}
          </p>
          <CosmicButton 
            onClick={handleEnterChat} 
            className="mt-2"
          >
            <MessageSquare size={16} className="mr-2" />
            {t.universe?.enterChat || "Войти в чат"}
            <ArrowRight size={16} className="ml-2" />
          </CosmicButton>
        </div>
      </CardContent>
    </Card>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title={t.universe?.chatProTitle || "Диалог со Вселенной"}
        message={t.universe?.chatProMessage || "Разблокируй PRO чтобы вести диалог со Вселенной"}
      >
        {chatPreviewContent}
      </ProFeatureOverlay>
    );
  }
  
  return chatPreviewContent;
};
