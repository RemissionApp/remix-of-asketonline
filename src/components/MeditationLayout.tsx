
import React from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Home, Sparkles, MessageSquare, User } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';

interface MeditationLayoutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  disablePadding?: boolean; // добавлен новый пропс
}

export const MeditationLayout: React.FC<MeditationLayoutProps> = ({ 
  children, 
  title,
  icon,
  disablePadding = false // со значением по умолчанию
}) => {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />

      {/* Main content */}
      <div className={`relative z-10 flex-1 flex flex-col items-center justify-start ${disablePadding ? '' : 'px-4 py-8'}`}>
        <div className="flex items-center justify-center mb-6">
          {icon}
          <h1 className="text-2xl text-center uppercase font-serif text-white">
            {title}
          </h1>
        </div>

        {children}
      </div>

      <BottomNavigation />
    </div>
  );
};
