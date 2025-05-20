
import React from 'react';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface MissionHeaderProps {
  title: string;
  description: string;
  language: 'ru' | 'en' | 'es';
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({ title, description, language }) => {
  // Определим, является ли это специальная миссия
  const isSilenceChallenge = title.includes('тишины') || 
                           title.includes('silence') || 
                           title.includes('silencio');
                            
  const isGratitudeChain = title.includes('благодарности') || 
                          title.includes('gratitude') || 
                          title.includes('gratitud');

  // Выбираем цвет текста в зависимости от миссии
  const textColorClass = isSilenceChallenge ? 'text-purple-800' : 
                        isGratitudeChain ? 'text-amber-800' : 
                        'text-white';
                        
  const descriptionColorClass = isSilenceChallenge ? 'text-purple-700' : 
                              isGratitudeChain ? 'text-amber-700' : 
                              'text-cosmic-secondary';

  return (
    <>
      <div className="flex items-center mb-3">
        <div className={cn(
          "cosmic-block-icon-wrapper",
          isSilenceChallenge ? "bg-purple-800" : 
          isGratitudeChain ? "bg-amber-800" : 
          "bg-cosmic-dark/60"
        )}>
          <Flag className="w-5 h-5 text-cosmic-gold" />
        </div>
        <h3 className={cn(
          language === 'en' ? "font-serif text-lg" : "font-sans text-lg",
          textColorClass,
          "font-bold"
        )}>
          {title}
        </h3>
      </div>
      
      <p className={cn(
        "text-sm mb-4",
        language === 'en' ? "font-serif" : "",
        descriptionColorClass,
        (isSilenceChallenge || isGratitudeChain) ? "font-medium" : "text-shadow"
      )}>
        {description}
      </p>
    </>
  );
};
