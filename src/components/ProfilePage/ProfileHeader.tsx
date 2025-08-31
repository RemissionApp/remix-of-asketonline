import React, { useState } from 'react';
import { Settings, Edit3, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { UserAvatar } from '@/components/UserAvatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProfileCard } from './ProfileCard';

export const ProfileHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { userProfile, updateUserProfile } = useAppStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile?.name || '');

  const handleSaveName = async () => {
    if (editedName.trim() && editedName !== userProfile?.name) {
      await updateUserProfile({ name: editedName.trim() });
    }
    setIsEditingName(false);
  };

  const handleAccountSettings = () => {
    console.log('ProfileHeader: Account settings button clicked');
    console.log('ProfileHeader: userProfile exists:', !!userProfile);
    console.log('ProfileHeader: navigate function exists:', !!navigate);
    
    try {
      navigate('/account-settings');
      console.log('ProfileHeader: Navigation called successfully');
    } catch (error) {
      console.error('ProfileHeader: Navigation error:', error);
      // Fallback navigation
      window.location.href = '/account-settings';
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userProfile?.name || '');
    setIsEditingName(false);
  };

  return (
    <ProfileCard>
      <div className="flex items-center gap-space-md mb-space-md">
        <UserAvatar 
          size="lg" 
          showRankBorder 
          showZodiacBadge 
          className="flex-shrink-0" 
        />
        <div className="flex-1 min-w-0">
          {/* Name with inline editing */}
          <div className="flex items-center gap-2 mb-1">
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-8 bg-cosmic-accent/10 border-cosmic-accent/30 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveName}
                  className="h-8 w-8 p-0 text-cosmic-accent hover:text-cosmic-accent/80"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="h-8 w-8 p-0 text-cosmic-text/60 hover:text-cosmic-text/80"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <h2 className="text-xl text-white font-serif truncate">
                  {userProfile?.name || t.auth?.defaultUserName || 'Искатель'}
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingName(true)}
                  className="h-6 w-6 p-0 text-cosmic-accent/60 hover:text-cosmic-accent"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Age and spiritual rank */}
          <div className="space-y-1">
            {userProfile?.birthDate && (
              <p className="text-cosmic-text/70 text-sm">
                {new Date().getFullYear() - new Date(userProfile.birthDate).getFullYear()} {t.userProfile?.age || 'лет'}
              </p>
            )}
            {userProfile?.rank && (
              <p className="text-cosmic-gold text-sm font-medium">
                {userProfile.rank}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Settings Button */}
      <Button
        onClick={handleAccountSettings}
        variant="outline"
        className="w-full bg-cosmic-accent/10 hover:bg-cosmic-accent/20 border-cosmic-accent/30 text-cosmic-text"
        disabled={!userProfile}
      >
        <Settings className="w-4 h-4 mr-2" />
        {t.userProfile?.accountSettings || 'Настройки аккаунта'}
      </Button>
    </ProfileCard>
  );
};