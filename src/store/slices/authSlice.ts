import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { SpiritualRank } from '@/types';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/dateFormatUtils';

export interface AuthSlice {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkEmailConfirmation: () => Promise<boolean>;
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set, get) => ({
  signIn: async (email, password) => {
    try {
      set({ loading: true });
      
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        toast({
          title: "Ошибка входа",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (user) {
        set({ user: user });
        await get().loadUserProfile();
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти в систему",
        variant: "destructive"
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  signUp: async (email, password) => {
    try {
      set({ loading: true });
      
      const { data: { user }, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      
      if (error) {
        toast({
          title: "Ошибка регистрации",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (user) {
        set({ user: user });
        
        // Create a user profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: 'Искатель',
            email: user.email,
            rank: 'seeker',
            energy_points: 0,
            total_days: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error("Error creating user profile:", profileError);
          toast({
            title: "Ошибка создания профиля",
            description: profileError.message,
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Регистрация успешна",
          description: "Пожалуйста, подтвердите свой email"
        });
      }
    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось зарегистрироваться",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Ошибка выхода",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Clear local state
      set({ 
        user: null,
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
          achievements: [],
          birthDate: null,
          avatar_url: null,
          activeMission: undefined,
          id: undefined
        },
        emailConfirmed: false
      });
    } catch (error: any) {
      toast({
        title: "Ошибка выхода",
        description: error.message || "Не удалось выйти из системы",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  checkEmailConfirmation: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found");
        set({ emailConfirmed: false });
        return false;
      }
      
      // Fetch the user profile from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        set({ emailConfirmed: false });
        return false;
      }
      
      // If no profile data, also return false
      if (!profileData) {
        console.log("No profile data found");
        set({ emailConfirmed: false });
        return false;
      }
      
      // Check if the email is confirmed
      const updatedProfile = profileData;
      
      if (!updatedProfile) {
        console.log("Email not confirmed");
        set({ emailConfirmed: false });
        return false;
      }
      
      const birthDate = updatedProfile?.birth_date || null;
      
      // Update the profile in the store
      set({
        userProfile: {
          ...get().userProfile,
          name: updatedProfile?.name || 'Искатель',
          email: user.email || '',
          energyPoints: updatedProfile?.energy_points || 0,
          goal: updatedProfile?.goal || get().userProfile.goal,
          rank: (updatedProfile?.rank as SpiritualRank) || 'seeker',
          birthDate: birthDate,
          totalDays: updatedProfile?.total_days || 0,
          avatar_url: updatedProfile?.avatar_url || null
        },
        emailConfirmed: true
      });
      
      return true;
    } catch (error: any) {
      console.error("Error checking email confirmation:", error);
      set({ emailConfirmed: false });
      return false;
    }
  },
  
  loadUserProfile: async () => {
    try {
      const { user } = get();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        // Load saved profile
        set({
          userProfile: {
            ...get().userProfile,
            name: data.name || 'Искатель',
            energyPoints: data.energy_points || 0,
            rank: data.rank as SpiritualRank,
            totalDays: data.total_days || 0,
            birthDate: data.birth_date,
            goal: data.goal || get().userProfile.goal,
            avatar_url: data.avatar_url,
            activeMission: data.active_mission ? await fetchActiveMission(data.active_mission) : null
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  },
});

// Helper function to fetch active mission
async function fetchActiveMission(missionId: string) {
  try {
    const { data: missionData, error: missionError } = await supabase
      .from('missions')
      .select('*')
      .eq('id', missionId)
      .single();
    
    if (missionError) {
      console.error('Error fetching active mission:', missionError);
      return null;
    }
    
    return missionData;
  } catch (error) {
    console.error('Error fetching active mission:', error);
    return null;
  }
}
