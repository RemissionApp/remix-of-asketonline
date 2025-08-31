import React from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProfileCard } from './ProfileCard';

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
  showFullSettingsLink?: boolean;
  fullSettingsText?: string;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  children,
  showFullSettingsLink = true,
  fullSettingsText = 'Все настройки'
}) => {
  const navigate = useNavigate();

  return (
    <ProfileCard variant="compact">
      <div className="flex items-center justify-between mb-space-md">
        <h3 className="text-cosmic-text font-medium">
          {title}
        </h3>
        {showFullSettingsLink && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/account-settings')}
            className="text-cosmic-accent hover:text-cosmic-accent/80"
          >
            <Settings className="w-4 h-4 mr-2" />
            {fullSettingsText}
          </Button>
        )}
      </div>
      
      <div className="space-y-space-md">
        {children}
      </div>
    </ProfileCard>
  );
};