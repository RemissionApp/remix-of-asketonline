
import React from 'react';
import { UserProfile } from '@/types';

interface UserGreetingProps {
  userProfile: UserProfile | null;
  language: string;
}

export const UserGreeting: React.FC<UserGreetingProps> = ({ userProfile, language }) => {
  if (!userProfile?.name) return null;
  
  return (
    <div className="relative z-10 text-center mb-4">
      <h2 className="text-cosmic-gold font-serif text-xl">
        {language === 'ru' 
          ? `Приветствую тебя, ${userProfile.name}!` 
          : language === 'es'
            ? `¡Te saludo, ${userProfile.name}!`
            : `Greetings, ${userProfile.name}!`}
      </h2>
    </div>
  );
};
