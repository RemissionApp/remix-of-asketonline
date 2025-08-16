import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export const ThinkingAnimation: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="energy-circle w-40 h-40 animate-pulse-slow mb-6">
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <div className="text-cosmic-accent animate-pulse-slow">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V2M12 22v-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <p className="text-cosmic-secondary text-center font-inter">
        {t.universe.thinking}
      </p>
    </div>
  );
};
