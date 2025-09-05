export type OnboardingStep = 'profile' | 'preferences' | 'tour' | 'complete';

export interface OnboardingState {
  currentStep: OnboardingStep;
  profileStepCompleted: boolean;
  onboardingStepCompleted: boolean;
  preferencesStepCompleted: boolean;
  completedAt: Date | null;
  lastSyncedAt: Date | null;
}

export interface UserDataCache {
  profile: any;
  onboardingState: OnboardingState | null;
  ttl: number; // Time to live in milliseconds
  lastFetch: number;
}

export interface OnboardingActions {
  loadOnboardingState: () => Promise<void>;
  updateOnboardingStep: (step: OnboardingStep, completed?: boolean) => Promise<void>;
  completeStep: (step: Exclude<OnboardingStep, 'complete'>) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  isStepCompleted: (step: OnboardingStep) => boolean;
  canProceedToStep: (step: OnboardingStep) => boolean;
}