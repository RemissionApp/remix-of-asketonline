
import { create } from 'zustand';
import { quotes } from './data/constants';
import { AppState } from './types';
import { createUISlice } from './slices/uiSlice';
import { createPactsSlice } from './slices/pactsSlice';
import { createUniverseSlice } from './slices/universeSlice';
import { createGamificationSlice } from './slices/gamificationSlice';
import { createProFeaturesSlice } from './slices/proFeaturesSlice';
import { createAuthSlice } from './slices/authSlice';
import { defaultAchievements } from './data/constants';
import { supabase } from '@/lib/supabase';

// Создание хранилища со всеми срезами
export const useAppStore = create<AppState>()((set, get, api) => ({
  // Начальное состояние
  pacts: [],
  activeQuestions: [],
  dailyQuote: quotes[Math.floor(Math.random() * quotes.length)],
  userProfile: {
    name: 'Искатель',
    email: '',
    age: null,
    energyPoints: 0,
    goal: 'Познать свою истинную силу',
    isPro: false,
    rank: 'seeker',
    zodiacSign: '',
    totalDays: 0,
    achievements: [...defaultAchievements],
    birthDate: null,
    avatar_url: null,
    activeMission: undefined,
    id: undefined
  },
  user: null,
  loading: false,
  emailConfirmed: false,
  
  // Добавляем новый метод для установки пользователя
  setUser: (user) => set({ user }),
  
  // Состояние чата
  chatSessions: [],
  isLoadingChatSessions: false,
  currentChatSession: null,
  chatMessages: [],
  isLoadingChat: false,
  isSendingMessage: false,
  isUniverseTyping: false,
  
  // Load user profile from Supabase
  loadUserProfile: async () => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      set({ loading: true });
      
      // Fetch user profile from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error loading user profile:", error);
        return;
      }
      
      if (!data) {
        console.error("No profile data found for user:", user.id);
        return;
      }
      
      // Transform to our app's format
      const userProfile = {
        name: data.name,
        email: user.email,
        age: null,
        energyPoints: data.energy_points,
        goal: data.goal || 'Познать свою истинную силу',
        isPro: false, // Will be set from subscriptions table
        rank: data.rank,
        zodiacSign: '',
        totalDays: data.total_days,
        achievements: [...defaultAchievements],
        birthDate: data.birth_date,
        avatar_url: data.avatar_url,
        activeMission: undefined,
        id: user.id
      };
      
      // Check if user has PRO subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!subscriptionError && subscription) {
        userProfile.isPro = subscription.is_pro;
      }
      
      // Update local state
      set({
        userProfile,
        loading: false
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
      set({ loading: false });
    }
  },
  
  // Комбинируем все срезы
  ...createUISlice(set, get, api),
  ...createPactsSlice(set, get, api),
  ...createUniverseSlice(set, get, api),
  ...createGamificationSlice(set, get, api),
  ...createProFeaturesSlice(set, get, api),
  ...createAuthSlice(set, get, api),
  
  // Update the userProfile method to handle updating the active mission
  updateUserProfile: async (profileData) => {
    try {
      set({ loading: true });
      
      const { user, userProfile } = get();
      
      if (!user) {
        console.error("No user found, can't update profile");
        return;
      }
      
      // Extract active mission
      const { activeMission, ...profileUpdates } = profileData;
      
      // Update profile data in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileUpdates,
          active_mission: activeMission?.id || userProfile.activeMission?.id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        return;
      }
      
      // Update local state
      set({
        userProfile: {
          ...userProfile,
          ...profileData
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
