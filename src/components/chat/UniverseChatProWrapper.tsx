import React from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { useEntitlement } from '@/hooks/useEntitlement';

interface UniverseChatProWrapperProps {
  children: React.ReactNode;
  isPro: boolean;
}

export const UniverseChatProWrapper: React.FC<UniverseChatProWrapperProps> = ({
  children,
  isPro,
}) => {
  const { t } = useTranslations();
  const { isUnlocked } = useEntitlement();

  if (!isPro && !isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-cosmic">
        <StarField starCount={50} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-cosmic-dark/80 backdrop-blur-md border-cosmic-accent/20">
            <ProFeatureOverlay
              title={t.universe?.chatProTitle || 'Dialog with the Universe'}
              message={
                t.universe?.chatProMessage ||
                'This feature is only available to PRO users'
              }
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
