import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { determineAuthRoute } from '@/utils/authRouter';
import { ChevronDown, ChevronUp, Bug } from 'lucide-react';

/**
 * AuthDebugPanel - Development tool for debugging auth state
 * Only visible in development mode
 */
export const AuthDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    userProfile,
    loading,
    profileStepCompleted,
    onboardingStepCompleted,
    isProfileComplete,
    checkOnboardingStatus,
  } = useAppStore();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const { route: determinedRoute, reason } = determineAuthRoute();
  const profileComplete = isProfileComplete();
  const onboardingComplete = checkOnboardingStatus();

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-cosmic-accent/80 hover:bg-cosmic-accent text-white p-3 rounded-full shadow-lg backdrop-blur-sm"
          title="Open Auth Debug Panel"
        >
          <Bug className="w-5 h-5" />
        </button>
      ) : (
        <div className="bg-cosmic-dark/95 border border-cosmic-accent/30 rounded-lg shadow-xl backdrop-blur-sm p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Auth Debug
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cosmic-secondary hover:text-white"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="border-b border-cosmic-accent/20 pb-2">
              <p className="text-cosmic-secondary">Current Route:</p>
              <p className="text-white font-mono">{location.pathname}</p>
            </div>

            <div className="border-b border-cosmic-accent/20 pb-2">
              <p className="text-cosmic-secondary">Determined Route:</p>
              <p className="text-white font-mono">{determinedRoute}</p>
              <p className="text-cosmic-accent text-xs">{reason}</p>
            </div>

            <div className="border-b border-cosmic-accent/20 pb-2">
              <p className="text-cosmic-secondary">User:</p>
              <p className="text-white">{user ? `✓ ${user.email}` : '✗ Not authenticated'}</p>
            </div>

            <div className="border-b border-cosmic-accent/20 pb-2">
              <p className="text-cosmic-secondary">Profile:</p>
              <p className="text-white">
                Name: {userProfile?.name || '✗ Empty'}
              </p>
              <p className="text-white">
                Birth Date: {userProfile?.birthDate ? new Date(userProfile.birthDate).toLocaleDateString() : '✗ Empty'}
              </p>
              <p className={profileComplete ? 'text-green-400' : 'text-red-400'}>
                Complete: {profileComplete ? '✓ Yes' : '✗ No'}
              </p>
              <p className={profileStepCompleted ? 'text-green-400' : 'text-red-400'}>
                DB Flag: {profileStepCompleted ? '✓ Yes' : '✗ No'}
              </p>
            </div>

            <div className="border-b border-cosmic-accent/20 pb-2">
              <p className="text-cosmic-secondary">Onboarding:</p>
              <p className={onboardingComplete ? 'text-green-400' : 'text-red-400'}>
                Complete: {onboardingComplete ? '✓ Yes' : '✗ No'}
              </p>
              <p className={onboardingStepCompleted ? 'text-green-400' : 'text-red-400'}>
                DB Flag: {onboardingStepCompleted ? '✓ Yes' : '✗ No'}
              </p>
            </div>

            <div>
              <p className="text-cosmic-secondary">Loading:</p>
              <p className="text-white">{loading ? '⏳ Yes' : '✓ No'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
