
import React from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';

interface UniverseChatProWrapperProps {
  children: React.ReactNode;
}

export const UniverseChatProWrapper: React.FC<UniverseChatProWrapperProps> = ({ 
  children
}) => {
  const { t } = useTranslations();
  const { userProfile } = useAppStore();
  const isPro = userProfile?.isPro || false;
  
  if (!isPro) {
    return (
      <div className="min-h-screen flex flex-col bg-cosmic">
        <StarField starCount={50} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-cosmic-dark/80 backdrop-blur-md border-cosmic-accent/20">
            <ProFeatureOverlay
              title={t.universe?.chatProTitle || "Dialog with the Universe"}
              message={t.universe?.chatProMessage || "This feature is only available to PRO users"}
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
