import React from 'react';
import { X } from 'lucide-react';
import { Pact } from '@/types';
import { cn } from '@/lib/utils';
import { PACT_DISPLAY_CONSTANTS } from './constants';

interface UnifiedBreakButtonProps {
  pact: Pact;
  onBreakAscesis: () => void;
  language: string;
}

export const UnifiedBreakButton: React.FC<UnifiedBreakButtonProps> = ({
  pact,
  onBreakAscesis,
  language,
}) => {
  // Only show button for active pacts
  if (pact.status !== 'active') {
    return null;
  }

  const buttonText = language === 'ru' 
    ? 'Прервать аскезу'
    : language === 'es'
      ? 'Romper ascesis'
      : 'Break asceticism';

  return (
    <button
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
        "bg-red-600/20 border border-red-500/30 text-red-400",
        "hover:bg-red-600/30 hover:border-red-500/50 hover:text-red-300",
        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400/50",
        "active:scale-95"
      )}
      style={{
        transition: `all ${PACT_DISPLAY_CONSTANTS.ANIMATIONS.BUTTON_HOVER}ms ease`
      }}
      onClick={onBreakAscesis}
      aria-label={`${buttonText}: ${pact.title}`}
    >
      <X size={16} className="transition-transform group-hover:rotate-90" />
      <span className="text-sm font-medium">{buttonText}</span>
    </button>
  );
};