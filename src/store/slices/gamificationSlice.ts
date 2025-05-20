import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { SpiritualRank } from '@/types';
import { defaultAchievements, availableMissions, rankRequirements } from '../data/constants';

export interface GamificationSlice {
  addEnergyPoints: (points: number) => Promise<void>;
  checkRankProgress: () => SpiritualRank;
  unlockAchievement: (achievementId: string) => Promise<void>;
  assignMission: () => Promise<void>;
  completeMission: () => Promise<void>;
}

export const createGamificationSlice: StateCreator<AppState, [], [], GamificationSlice> = (set, get) => ({
  // Add energy points
  addEnergyPoints: async (points) => {
    const { user, userProfile } = get();
    
    if (!user) return;
    
    try {
      const newTotal = (userProfile.energyPoints || 0) + points;
      
      // Update in database
      const { error } = await supabase
        .from('profiles')
        .update({ energy_points: newTotal })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      set((state) => ({
        userProfile: {
          ...state.userProfile,
          energyPoints: newTotal
        }
      }));
    } catch (error) {
      console.error("Error adding energy points:", error);
    }
  },
  
  // Check rank progress
  checkRankProgress: () => {
    const { userProfile } = get();
    const { totalDays } = userProfile;
    
    if (totalDays >= rankRequirements.enlightened) return 'enlightened';
    if (totalDays >= rankRequirements.master) return 'master';
    if (totalDays >= rankRequirements.warrior) return 'warrior';
    if (totalDays >= rankRequirements.pilgrim) return 'pilgrim';
    return 'seeker';
  },
  
  // Unlock achievement
  unlockAchievement: async (achievementId) => {
    const { user, userProfile } = get();
    
    if (!user) return;
    
    try {
      // Check if achievement is already unlocked
      const achievementExists = userProfile.achievements.find(a => a.id === achievementId && a.unlocked);
      
      if (achievementExists) return; // Already unlocked
      
      // Find the achievement in the default list
      const achievement = defaultAchievements.find(a => a.id === achievementId);
      
      if (!achievement) return; // Achievement not found
      
      // Check if this achievement is already in the database
      const { data: existingAchievements, error: checkError } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_type', achievementId);
      
      if (checkError) throw checkError;
      
      if (!existingAchievements || existingAchievements.length === 0) {
        // Insert the achievement
        const { error } = await supabase
          .from('achievements')
          .insert({
            user_id: user.id,
            achievement_type: achievementId,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            unlocked_at: new Date().toISOString()
          });
        
        if (error) throw error;
      } else {
        // Update the existing achievement
        const { error } = await supabase
          .from('achievements')
          .update({ unlocked_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('achievement_type', achievementId);
        
        if (error) throw error;
      }
      
      // Add energy points for achievement
      await get().addEnergyPoints(20);
      
      // Update local state
      set((state) => {
        const updatedAchievements = state.userProfile.achievements.map(a => 
          a.id === achievementId 
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } 
            : a
        );
        
        return {
          userProfile: {
            ...state.userProfile,
            achievements: updatedAchievements
          }
        };
      });
      
      toast({
        title: "Достижение разблокировано!",
        description: achievement.title
      });
    } catch (error) {
      console.error("Error unlocking achievement:", error);
    }
  },
  
  // Assign a mission to the user
  assignMission: async () => {
    try {
      const { userProfile, user } = get();
      
      if (!user || !userProfile) return;
      
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .limit(1)
        .single();
      
      if (missionError && missionError.code !== 'PGRST116') {
        console.error('Error fetching active mission:', missionError);
        return;
      }
      
      if (missionData) {
        set({ userProfile: { ...userProfile, activeMission: missionData } });
      }
    } catch (error) {
      console.error('Error assigning mission:', error);
    }
  },
  
  // Complete the active mission
  completeMission: async () => {
    try {
      const { userProfile, user, addEnergyPoints } = get();
      
      if (!user || !userProfile?.activeMission) return;
      
      // Update mission in database
      const { error: updateError } = await supabase
        .from('missions')
        .update({ completed: true })
        .eq('id', userProfile.activeMission.id);
      
      if (updateError) {
        console.error('Error updating mission:', updateError);
        return;
      }
      
      // Add energy points from completed mission
      const energyPoints = userProfile.activeMission.reward.energyPoints || 0;
      await addEnergyPoints(energyPoints);
      
      // If mission has an achievement, unlock it
      if (userProfile.activeMission.reward.achievement) {
        await get().unlockAchievement(userProfile.activeMission.reward.achievement);
      }
      
      // Clear active mission
      set({ userProfile: { ...userProfile, activeMission: null } });
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  }
});
