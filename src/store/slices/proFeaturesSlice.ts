import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';

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
    const { user } = get();
    if (user) {
      try {
        // First try to update existing subscription
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingSubscription) {
          // Update existing subscription
          const { error } = await supabase
            .from('subscriptions')
            .update({ 
              is_pro: true,
              subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
            })
            .eq('user_id', user.id);

          if (error) {
            console.error('Error upgrading to PRO:', error);
            return;
          }
        } else {
          // Create new subscription
          const { error } = await supabase
            .from('subscriptions')
            .insert({
              user_id: user.id,
              is_pro: true,
              subscription_start: new Date().toISOString(),
              subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            });

          if (error) {
            console.error('Error creating PRO subscription:', error);
            return;
          }
        }

        // Reload user profile to get updated subscription status
        await get().loadUserProfile();
      } catch (e) {
        console.error('Exception upgrading to PRO:', e);
      }
    }
  },

  // Cancel PRO subscription
  cancelProSubscription: async (): Promise<void> => {
    const { user } = get();
    if (user) {
      try {
        const { error } = await supabase
          .from('subscriptions')
          .update({ 
            is_pro: false,
            subscription_end: new Date().toISOString() // End subscription now
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error cancelling PRO subscription:', error);
          return;
        }

        // Reload user profile to get updated subscription status
        await get().loadUserProfile();
      } catch (e) {
        console.error('Exception cancelling PRO subscription:', e);
      }
    }
  },
});
