import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';

export interface UserJourneyEvent {
  step: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

export const useUserJourneyAnalytics = () => {
  const { user } = useAppStore();

  const trackJourneyStep = (step: string, metadata?: Record<string, any>) => {
    const event: UserJourneyEvent = {
      step,
      timestamp: new Date(),
      userId: user?.id,
      metadata
    };

    // Log for debugging
    logger.info('UserJourney: Step tracked', event);

    // Store in localStorage for analytics
    const journeyEvents = JSON.parse(localStorage.getItem('userJourneyEvents') || '[]');
    journeyEvents.push(event);
    
    // Keep only last 50 events to prevent storage bloat
    if (journeyEvents.length > 50) {
      journeyEvents.splice(0, journeyEvents.length - 50);
    }
    
    localStorage.setItem('userJourneyEvents', JSON.stringify(journeyEvents));

    // Send to analytics service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'user_journey_step', {
        step_name: step,
        user_id: user?.id,
        ...metadata
      });
    }
  };

  const getJourneyEvents = (): UserJourneyEvent[] => {
    try {
      return JSON.parse(localStorage.getItem('userJourneyEvents') || '[]');
    } catch {
      return [];
    }
  };

  const clearJourneyEvents = () => {
    localStorage.removeItem('userJourneyEvents');
  };

  return {
    trackJourneyStep,
    getJourneyEvents,
    clearJourneyEvents
  };
};
