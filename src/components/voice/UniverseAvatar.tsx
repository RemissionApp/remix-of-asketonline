import React from 'react';
import universeAvatarDefault from '@/assets/universe-avatar-listening.png';

interface UniverseAvatarProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const UniverseAvatar: React.FC<UniverseAvatarProps> = ({ 
  isActive, 
  isSpeaking 
}) => {
  // Выбираем аватар в зависимости от состояния соединения
  const avatarSrc = isActive 
    ? universeAvatarDefault  // С открытыми глазами когда активен
    : "https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png"; // Закрытые глаза когда неактивен

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Main avatar circle */}
      <div 
        className={`w-full h-full rounded-full border-4 transition-all duration-500 relative overflow-hidden ${
          isActive 
            ? 'border-cosmic-accent shadow-lg shadow-cosmic-accent/50' 
            : 'border-cosmic-accent/30 shadow-sm'
        }`}
      >
        {/* Universe Avatar Image */}
        <img 
          src={avatarSrc}
          alt="Universe Avatar"
          className="w-full h-full object-cover rounded-full transition-all duration-500"
        />
        
        {/* Gradient overlay for better visibility */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
};