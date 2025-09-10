import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';

export interface ProFeaturesSlice {
  isUpdatingSubscription: boolean;
  upgradeToPro: () => Promise<void>;
  cancelProSubscription: () => Promise<void>;
}

export const createProFeaturesSlice: StateCreator<
  AppState,
  [],
  [],
  ProFeaturesSlice
> = (set, get) => ({
  isUpdatingSubscription: false,

  // Upgrade to PRO
  upgradeToPro: async (): Promise<void> => {
    const state = get();
    
    // Prevent multiple simultaneous calls
    if (state.isUpdatingSubscription) {
      console.log('Already updating subscription, skipping...');
      return;
    }

    const { user } = state;
    if (!user) {
      console.log('No user found, cannot upgrade to PRO');
      return;
    }

    set({ isUpdatingSubscription: true });

    try {
      console.log('Starting PRO upgrade process');
      
      // Find ALL existing subscriptions for this user
      const { data: existingSubscriptions, error: queryError } = await supabase
        .from('subscriptions')
        .select('id, is_pro, subscription_end')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Error querying subscriptions:', queryError);
        return;
      }

      console.log('Found subscriptions:', existingSubscriptions?.length || 0);

      // Check if user already has an active PRO subscription
      const activePro = existingSubscriptions?.find(sub => 
        sub.is_pro && new Date(sub.subscription_end) > new Date()
      );

      if (activePro) {
        console.log('User already has active PRO subscription');
        // Just update the UI state
        const store = get() as any;
        if (store.loadUserProfile) {
          await store.loadUserProfile();
        }
        return;
      }

      if (existingSubscriptions && existingSubscriptions.length > 0) {
        // Update the most recent subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({ 
            is_pro: true,
            subscription_start: new Date().toISOString(),
            subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', existingSubscriptions[0].id);

        if (error) {
          console.error('Error updating subscription:', error);
          return;
        }
        console.log('Subscription updated successfully');
      } else {
        // Create new subscription only if none exists
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            is_pro: true,
            subscription_start: new Date().toISOString(),
            subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (error) {
          console.error('Error creating subscription:', error);
          return;
        }
        console.log('New subscription created successfully');
      }

      // Reload user profile
      const store = get() as any;
      if (store.loadUserProfile) {
        await store.loadUserProfile();
        console.log('User profile reloaded');
      }
    } catch (e) {
      console.error('Exception upgrading to PRO:', e);
    } finally {
      set({ isUpdatingSubscription: false });
    }
  },

  // Cancel PRO subscription
  cancelProSubscription: async (): Promise<void> => {
    const state = get();
    
    // Prevent multiple simultaneous calls
    if (state.isUpdatingSubscription) {
      console.log('Already updating subscription, skipping...');
      return;
    }

    const { user } = state;
    if (!user) {
      console.log('No user found, cannot cancel PRO subscription');
      return;
    }

    set({ isUpdatingSubscription: true });

    try {
      console.log('Starting PRO cancellation process');
      
      // Update ALL subscriptions to inactive
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          is_pro: false,
          subscription_end: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error cancelling subscriptions:', error);
        return;
      }
      
      console.log('All subscriptions cancelled successfully');

      // Reload user profile
      const store = get() as any;
      if (store.loadUserProfile) {
        await store.loadUserProfile();
        console.log('User profile reloaded');
      }
    } catch (e) {
      console.error('Exception cancelling PRO subscription:', e);
    } finally {
      set({ isUpdatingSubscription: false });
    }
  },
});
