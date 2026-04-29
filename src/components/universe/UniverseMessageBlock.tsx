import React, { memo } from 'react';
import { MessageCircleQuestion, PhoneCall, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useRevenueCat } from '@/hooks/useRevenueCat';

/**
 * Component that displays the Universe chat entry point with an avatar and action buttons
 */
const UniverseMessageBlockComponent: React.FC = () => {
  const { language, user } = useAppStore();
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

  const headingFontClass = language === 'en' ? 'font-serif' : 'font-display';

  const askLabel =
    language === 'ru'
      ? 'Задать вопрос'
      : language === 'es'
        ? 'Hacer pregunta'
        : 'Ask a question';

  const callLabel =
    language === 'ru'
      ? 'Звонок Вселенной'
      : language === 'es'
        ? 'Llamar al Universo'
        : 'Call the Universe';

  const messageContent = (
    <div className="glass-card glass-shimmer mb-4 sm:mb-6 relative">
      {/* Background galaxy image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 z-0"
        style={{
          backgroundImage: `url('/universe-glass-bg.jpg')`,
        }}
      />
      {/* Frosted glass veil */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,6,30,0.25) 0%, rgba(10,6,30,0.55) 100%)',
          backdropFilter: 'blur(2px)',
        }}
      />

      <div className="w-full p-4 sm:p-5 relative z-10">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 mr-3 border-2 border-white/20 bg-cosmic-dark shadow-[0_0_18px_rgba(139,92,246,0.45)]">
            <AvatarImage
              src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png"
              alt="Universe Avatar"
            />
            <AvatarFallback className="bg-cosmic-accent/20 text-cosmic-accent">
              <MessageSquare size={20} />
            </AvatarFallback>
          </Avatar>

          <div>
            <h3
              className={`text-base sm:text-xl ${headingFontClass} font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}
            >
              {universeTitle}
            </h3>
            <div className="flex items-center text-[10px] sm:text-xs text-cosmic-secondary">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse-slow shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
              {language === 'ru'
                ? 'онлайн'
                : language === 'es'
                  ? 'en línea'
                  : 'online'}
            </div>
          </div>
        </div>

        {/* Two icon buttons centered */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mt-4 mb-2">
          <button
            onClick={handleQuestionClick}
            aria-label={askLabel}
            className="flex flex-col items-center group"
          >
            <span
              className="glass-icon-btn w-14 h-14 sm:w-16 sm:h-16 animate-breathe-gold"
              style={{
                background:
                  'linear-gradient(135deg, rgba(232,193,108,0.35) 0%, rgba(232,193,108,0.1) 100%)',
                borderColor: 'rgba(232,193,108,0.4)',
              }}
            >
              <MessageCircleQuestion
                size={26}
                className="text-cosmic-gold drop-shadow-[0_0_6px_rgba(232,193,108,0.8)]"
              />
            </span>
            <span className="mt-2 text-[11px] sm:text-xs text-white/90 font-medium tracking-wide">
              {askLabel}
            </span>
          </button>

          <button
            onClick={handleCallClick}
            aria-label={callLabel}
            className="flex flex-col items-center group"
          >
            <span
              className="glass-icon-btn w-14 h-14 sm:w-16 sm:h-16 animate-breathe"
              style={{
                background:
                  'linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(74,58,180,0.15) 100%)',
                borderColor: 'rgba(139,92,246,0.45)',
              }}
            >
              <PhoneCall
                size={24}
                className="text-white drop-shadow-[0_0_6px_rgba(139,92,246,0.9)]"
              />
            </span>
            <span className="mt-2 text-[11px] sm:text-xs text-white/90 font-medium tracking-wide">
              {callLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // Leave the chat button visible for free users, but wrap the whole block with ProFeatureOverlay for non-PRO users
  return messageContent;
};

// Export memoized version to prevent unnecessary re-renders
export const UniverseMessageBlock = memo(UniverseMessageBlockComponent);
