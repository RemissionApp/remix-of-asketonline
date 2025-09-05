import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOptimizedOnboarding } from '@/hooks/useOptimizedOnboarding';
import { logger } from '@/utils/logger';

interface OptimizedOnboardingGuardProps {
  children: React.ReactNode;
  requiredStep?: 'profile' | 'preferences' | 'tour' | 'complete';
}

export const OptimizedOnboardingGuard = ({ 
  children, 
  requiredStep = 'complete' 
}: OptimizedOnboardingGuardProps) => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    loading, 
    canProceedToStep, 
    getRedirectPath,
    checkProfileCompletion
  } = useOptimizedOnboarding();

  useEffect(() => {
    if (loading) return;

    // Check if profile was just completed
    checkProfileCompletion();

    // Redirect if user can't access this step
    if (!canProceedToStep(requiredStep)) {
      const redirectPath = getRedirectPath();
      logger.debug('Redirecting user due to incomplete onboarding', {
        currentStep,
        requiredStep,
        redirectPath
      });
      navigate(redirectPath, { replace: true });
    }
  }, [
    currentStep, 
    requiredStep, 
    loading, 
    navigate, 
    canProceedToStep, 
    getRedirectPath,
    checkProfileCompletion
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canProceedToStep(requiredStep)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};