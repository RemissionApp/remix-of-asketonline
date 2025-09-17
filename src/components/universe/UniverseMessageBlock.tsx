import React, { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { CosmicButton } from '@/components/CosmicButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useRevenueCat } from '@/hooks/useRevenueCat';

/**
 * Component that displays the Universe chat entry point with an avatar and action buttons
 */
const UniverseMessageBlockComponent: React.FC = () => {
  const { userProfile, language, user } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { hasActiveSubscription } = useRevenueCat(user?.id);

  const handleQuestionClick = () => {
    navigate('/universe');
  };

  const handleCallClick = () => {
    navigate('/universe-call');
  };

  // Get appropriate title based on language
  const universeTitle =
    language === 'ru'
      ? 'Диалог с Вселенной'
      : language === 'es'
        ? 'Diálogo con el Universo'
        : 'Dialogue with the Universe';

  // Determine the correct font class based on language - matching other headings in the app
  const headingFontClass = language === 'en' ? 'font-serif' : 'font-sans';

  const messageContent = (
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

        {hasActiveSubscription ? (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <CosmicButton
              onClick={handleQuestionClick}
              size="md"
              variant="default"
              className="flex-1 bg-gradient-to-r from-cosmic-gold/40 to-cosmic-gold/30 hover:from-cosmic-gold/50 hover:to-cosmic-gold/40 text-white backdrop-blur-md border border-white/10"
            >
              {language === 'ru'
                ? 'Задать вопрос'
                : language === 'es'
                  ? 'Hacer pregunta'
                  : 'Ask a question'}
            </CosmicButton>

            <CosmicButton
              onClick={handleCallClick}
              size="md"
              variant="default"
              className="flex-1 bg-gradient-to-r from-cosmic-accent/40 to-cosmic-indigo/30 hover:from-cosmic-accent/50 hover:to-cosmic-indigo/40 backdrop-blur-md border border-white/10"
            >
              {language === 'ru'
                ? 'Позвонить Вселенной'
                : language === 'es'
                  ? 'Llamar al Universo'
                  : 'Call Universe'}
            </CosmicButton>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <CosmicButton
              onClick={handleQuestionClick}
              size="md"
              variant="default"
              className="flex-1 bg-gradient-to-r from-cosmic-gold/40 to-cosmic-gold/30 hover:from-cosmic-gold/50 hover:to-cosmic-gold/40 text-white backdrop-blur-md border border-white/10"
            >
              {language === 'ru'
                ? 'Задать вопрос'
                : language === 'es'
                  ? 'Hacer pregunta'
                  : 'Ask a question'}
            </CosmicButton>
          </div>
        )}
      </div>
    </div>
  );

  // Leave the chat button visible for free users, but wrap the whole block with ProFeatureOverlay for non-PRO users
  return messageContent;
};

// Export memoized version to prevent unnecessary re-renders
export const UniverseMessageBlock = memo(UniverseMessageBlockComponent);
