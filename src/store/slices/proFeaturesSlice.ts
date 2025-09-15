import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { useRevenueCatStore } from './revenueCatSlice';

export interface ProFeaturesSlice {
  upgradeToPro: () => Promise<void>;
  cancelProSubscription: () => Promise<void>;
}

export const createProFeaturesSlice: StateCreator<
  AppState,
  [],
  [],
  ProFeaturesSlice
> = (set, get) => ({
  // Upgrade to PRO
  upgradeToPro: async (): Promise<void> => {
    const { presentPaywall } = useRevenueCatStore.getState();

    try {
      // Show paywall for subscription
      await presentPaywall();

      // The RevenueCat store will automatically update the Pro status
      // through the customer info listener
    } catch (error) {
      console.error('Error upgrading to PRO:', error);
      throw error;
    }
  },

  // Cancel PRO subscription
  cancelProSubscription: async (): Promise<void> => {
    // Note: RevenueCat handles subscription cancellation through the platform
    // (Google Play Store or App Store). This method is kept for compatibility
    // but the actual cancellation should be done through the platform settings.

    console.log(
      '⚠️ Subscription cancellation should be done through platform settings'
    );

    // Update local state to reflect cancellation
    set(state => ({
      userProfile: {
        ...state.userProfile,
        isPro: false,
      },
    }));

    // Persist to Supabase if connected
    const { user } = get();
    if (user) {
      try {
        const { error } = await supabase
          .from('subscriptions')
          .update({ is_pro: false })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error cancelling PRO subscription:', error);
        }
      } catch (e) {
        console.error('Exception cancelling PRO subscription:', e);
      }
    }
  },
});
