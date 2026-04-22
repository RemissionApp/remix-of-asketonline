import React from 'react';
import { useAuthFlowBootstrap } from '@/hooks/useAuthFlow';
import { StarField } from '@/components/StarField';

interface Props {
  children: React.ReactNode;
}

/**
 * AuthBootstrap mounts ONCE at the root and wires up all auth state.
 * Replaces the old AuthGuard + duplicated AppInitializer auth logic.
 */
export const AuthBootstrap: React.FC<Props> = ({ children }) => {
  const ready = useAuthFlowBootstrap();

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <StarField starCount={150} />
        <div className="cosmic-block backdrop-blur-sm p-8 rounded-lg border border-cosmic-accent/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cosmic-accent/60 border-t-transparent rounded-full animate-spin" />
            <p className="text-cosmic-secondary">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};