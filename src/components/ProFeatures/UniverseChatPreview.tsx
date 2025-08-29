import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { CosmicButton } from '@/components/CosmicButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const UniverseChatPreview: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const handleEnterCall = () => {
    navigate('/universe-call');
  };

  // Translation for the title "Звонок Вселенной"
  const universeTitle =
    language === 'ru'
      ? 'Звонок Вселенной'
      : language === 'es'
        ? 'Llamada al Universo'
        : 'Universe Call';

  // Determine the correct font class based on language
  const headingFontClass = language === 'en' ? 'font-serif' : 'font-sans';

  const chatPreviewContent = (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 z-0"
        style={{
          backgroundImage: `url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//dialogue.png)`,
          filter: 'brightness(1.2) contrast(1.15)',
        }}
      />

      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent relative z-10">
        <div className="flex items-center mb-4">
          <Avatar className="h-14 w-14 mr-3 border-2 border-cosmic-accent/30 bg-cosmic-dark">
            <AvatarImage
              src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png"
              alt="Universe Avatar"
            />
            <AvatarFallback className="bg-cosmic-accent/20 text-cosmic-accent">
              <MessageSquare size={24} />
            </AvatarFallback>
          </Avatar>

          <div>
            <h3
              className={`text-xl ${headingFontClass} font-medium text-white`}
            >
              {universeTitle}
            </h3>
            <div className="flex items-center text-xs text-cosmic-secondary">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse-slow"></span>
              {language === 'ru'
                ? 'онлайн'
                : language === 'es'
                  ? 'en línea'
                  : 'online'}
            </div>
          </div>
        </div>

        <CosmicButton
          onClick={handleEnterCall}
          size="md"
          variant="default"
          className="w-full bg-gradient-to-r from-cosmic-accent/40 to-cosmic-indigo/30 hover:from-cosmic-accent/50 hover:to-cosmic-indigo/40 backdrop-blur-md border border-white/20 mt-4"
        >
          {language === 'ru'
            ? 'Позвонить Вселенной'
            : language === 'es'
              ? 'Llamar al Universo'
              : 'Call Universe'}
        </CosmicButton>
      </div>
    </div>
  );

  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay
        title={t.universe?.chatProTitle || 'Звонок Вселенной'}
        message={
          t.universe?.chatProMessage ||
          'Разблокируй PRO чтобы звонить Вселенной'
        }
      >
        {chatPreviewContent}
      </ProFeatureOverlay>
    );
  }

  return chatPreviewContent;
};
