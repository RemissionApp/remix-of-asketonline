import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface UniverseCaptionsProps {
  agentMessage: string | null;
  userMessage: string | null;
  isSpeaking: boolean;
  isConnected: boolean;
}

const placeholders = {
  ru: 'Вселенная слушает вас…',
  en: 'The Universe is listening…',
  es: 'El Universo te escucha…',
};

export const UniverseCaptions: React.FC<UniverseCaptionsProps> = ({
  agentMessage,
  userMessage,
  isSpeaking,
  isConnected,
}) => {
  const { language } = useAppStore();
  const [visibleAgent, setVisibleAgent] = useState<string | null>(null);
  const [visibleUser, setVisibleUser] = useState<string | null>(null);

  // Fade messages out after 10s of inactivity
  useEffect(() => {
    if (!agentMessage) return;
    setVisibleAgent(agentMessage);
    const t = setTimeout(() => setVisibleAgent(null), 12000);
    return () => clearTimeout(t);
  }, [agentMessage]);

  useEffect(() => {
    if (!userMessage) return;
    setVisibleUser(userMessage);
    const t = setTimeout(() => setVisibleUser(null), 8000);
    return () => clearTimeout(t);
  }, [userMessage]);

  if (!isConnected) return null;

  const placeholder =
    placeholders[language as keyof typeof placeholders] ?? placeholders.en;

  return (
    <div className="w-full max-w-md mx-auto space-y-2 min-h-[120px] flex flex-col justify-end">
      {visibleUser && (
        <div
          key={visibleUser}
          className="animate-fade-in text-center text-xs text-cosmic-muted px-4 italic"
        >
          {visibleUser}
        </div>
      )}

      {visibleAgent ? (
        <div
          key={visibleAgent}
          className={`animate-fade-in glass rounded-2xl px-5 py-4 border transition-colors duration-500 ${
            isSpeaking
              ? 'border-green-400/50 shadow-lg shadow-green-500/20'
              : 'border-cosmic-accent/20'
          }`}
        >
          <p className="text-white text-base leading-relaxed text-center font-serif">
            {visibleAgent}
          </p>
        </div>
      ) : (
        <div className="text-center text-sm text-cosmic-muted/70 px-4">
          {placeholder}
        </div>
      )}
    </div>
  );
};