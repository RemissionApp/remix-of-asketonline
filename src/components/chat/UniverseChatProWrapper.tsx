
import React from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';

interface UniverseChatProWrapperProps {
  children: React.ReactNode;
  isPro: boolean;
}

export const UniverseChatProWrapper: React.FC<UniverseChatProWrapperProps> = ({ 
  children, 
  isPro 
}) => {
  if (!isPro) {
    return (
      <div className="min-h-screen flex flex-col bg-cosmic">
        <StarField starCount={50} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-cosmic-dark/80 backdrop-blur-md border-cosmic-accent/20">
            <ProFeatureOverlay
              title="Диалог со Вселенной"
              message="Этот раздел доступен только пользователям PRO"
            >
              <div className="h-96"></div>
            </ProFeatureOverlay>
          </Card>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return <>{children}</>;
};
