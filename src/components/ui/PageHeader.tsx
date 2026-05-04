import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAndroid } from '@/utils/platform';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  backTo?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  backTo = '/main',
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backTo);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none ${className}`}
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
          className="flex items-center justify-center w-9 h-9 rounded-full bg-cosmic-accent/10 hover:bg-cosmic-accent/20 transition-colors text-cosmic-accent shrink-0"
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
