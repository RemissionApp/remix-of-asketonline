
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';

export interface ProFeaturesSlice {
  upgradeToPro: () => Promise<void>;
  cancelProSubscription: () => Promise<void>;
}

export const createProFeaturesSlice: StateCreator<AppState, [], [], ProFeaturesSlice> = (set, get) => ({
  // Upgrade to PRO
  upgradeToPro: async (): Promise<void> => {
    // For demo purposes, just set isPro to true in the userProfile
    set(state => ({
      userProfile: {
        ...state.userProfile,
        isPro: true
      }
    }));
    
    // Persist to Supabase if connected
    const { user } = get();
    if (user) {
      try {
        const { error } = await supabase
          .from('subscriptions')
          .update({ is_pro: true })
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error upgrading to PRO:', error);
        }
      } catch (e) {
        console.error('Exception upgrading to PRO:', e);
      }
    }
  },
  
  // Cancel PRO subscription
  cancelProSubscription: async (): Promise<void> => {
    // For demo purposes, just set isPro to false in the userProfile
    set(state => ({
      userProfile: {
        ...state.userProfile,
        isPro: false
      }
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
  }
});
