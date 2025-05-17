
import React from 'react';
import { MessageSquare, ArrowRight, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { CosmicButton } from '@/components/CosmicButton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Component that displays the Universe chat entry point with an avatar and action buttons
 */
export const UniverseMessageBlock: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    navigate('/universe-chat');
  };
  
  const handleQuestionClick = () => {
    navigate('/universe');
  };
  
  // Translation for the title "Диалог со вселенной"
  const universeTitle = language === 'ru' ? 'Диалог со вселенной' : 
                         language === 'es' ? 'Diálogo con el Universo' : 'Dialogue with the Universe';
  
  const messageContent = (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6">
      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent">
        <div className="flex items-center mb-4">
          <Avatar className="h-14 w-14 mr-3 border-2 border-cosmic-accent/30 bg-cosmic-dark">
            <AvatarImage src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png" alt="Universe Avatar" />
            <AvatarFallback className="bg-cosmic-accent/20 text-cosmic-accent">
              <MessageSquare size={24} />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="text-lg font-serif font-medium text-white">
              {universeTitle}
            </h3>
            <div className="flex items-center text-xs text-cosmic-secondary">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse-slow"></span>
              {language === 'ru' ? 'онлайн' : 
               language === 'es' ? 'en línea' : 'online'}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <CosmicButton 
            onClick={handleQuestionClick} 
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <HelpCircle size={16} className="mr-1" />
            {language === 'ru' ? 'Задать вопрос' : 
             language === 'es' ? 'Hacer pregunta' : 'Ask a question'}
          </CosmicButton>
          
          <CosmicButton 
            onClick={handleChatClick} 
            size="sm" 
            variant="outline"
            className="flex-1"
          >
            <MessageSquare size={16} className="mr-1" />
            {language === 'ru' ? 'Перейти в чат' : 
             language === 'es' ? 'Ir al chat' : 'Enter chat'}
            <ArrowRight size={16} className="ml-1" />
          </CosmicButton>
        </div>
      </div>
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
        {messageContent}
      </ProFeatureOverlay>
    );
  }
  
  return messageContent;
};
