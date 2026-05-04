import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAndroid } from '@/utils/platform';

interface PageHeaderProps {
  title: string;
  onBackClick?: () => void;
  backTo?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBackClick,
  backTo = '/main',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(backTo);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{
        paddingTop: isAndroid()
          ? 'calc(env(safe-area-inset-top) + 0.6rem)'
          : 'calc(env(safe-area-inset-top) + 0.4rem)',
        paddingLeft: 'calc(env(safe-area-inset-left) + 0.75rem)',
        paddingRight: 'calc(env(safe-area-inset-right) + 0.75rem)',
      }}
    >
      <div className="glass-strong glass-shimmer pointer-events-auto relative flex items-center rounded-2xl px-2 py-2 min-h-12 overflow-hidden">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm shadow-[0_0_18px_rgba(139,92,246,0.35)] hover:bg-white/10 transition-colors text-white shrink-0"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-serif text-white font-medium truncate max-w-[55%]">
          {title}
        </h1>

        <div className="flex items-center space-x-2 shrink-0 ml-auto">
          <img
            src="/asket-logo.png"
            alt="Asceta Logo"
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-white font-serif text-sm">Asceta</span>
        </div>
      </div>
    </div>
  );
};
