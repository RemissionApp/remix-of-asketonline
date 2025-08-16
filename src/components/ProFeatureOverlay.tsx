import React from 'react';
import { LockIcon, SparklesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

interface ProFeatureOverlayProps {
  title?: string;
  message?: string;
  children: React.ReactNode;
  className?: string;
  navigateTo?: string;
  showUnlockPrompt?: boolean;
  unlockText?: string;
}

export const ProFeatureOverlay: React.FC<ProFeatureOverlayProps> = ({
  title = 'PRO Feature',
  message = 'Upgrade to PRO to unlock this feature',
  children,
  className = '',
  navigateTo = '/comparison',
  showUnlockPrompt = false,
  unlockText = 'Unlock PRO functions',
}) => {
  const navigate = useNavigate();
  const { upgradeToPro } = useAppStore();

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <div
      className={`relative ${className} cursor-pointer`}
      onClick={handleClick}
    >
      {/* The actual content that's blurred/locked */}
      <div className="filter blur-sm pointer-events-none opacity-60">
        {children}
      </div>

      {/* Lock icon in top right corner */}
      <div className="absolute top-2 right-2 z-10">
        <div className="w-8 h-8 bg-cosmic-dark/70 backdrop-blur-sm rounded-full flex items-center justify-center">
          <LockIcon size={16} className="text-cosmic-gold" />
        </div>
      </div>

      {/* Overlay that makes the whole component clickable */}
      <div className="absolute inset-0 bg-cosmic-dark/40 backdrop-blur-sm rounded-lg border border-cosmic-accent/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="p-4 text-center">
          <h3 className="text-lg font-serif text-white mb-2">{title}</h3>
          <p className="text-sm text-cosmic-secondary">{message}</p>
        </div>
      </div>

      {/* Bottom PRO unlock prompt - only shown when showUnlockPrompt is true */}
      {showUnlockPrompt && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-cosmic-gold/50 to-cosmic-accent/50 py-2 px-3 rounded-b-lg flex items-center justify-center z-20">
          <SparklesIcon size={16} className="text-white mr-2" />
          <span className="text-white font-medium text-sm">{unlockText}</span>
        </div>
      )}
    </div>
  );
};
