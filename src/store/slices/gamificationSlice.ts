
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
  
  // Assign mission
  assignMission: async () => {
    const { user, userProfile } = get();
    
    if (!user) return;
    
    try {
      // Check if user already has an active mission
      if (userProfile.activeMission) return;
      
      // Get all completed missions
      const { data: completedMissions, error: missionsError } = await supabase
        .from('missions')
        .select('title')
        .eq('user_id', user.id)
        .eq('completed', true);
      
      if (missionsError) throw missionsError;
      
      // Filter available missions that haven't been completed
      const completedTitles = completedMissions?.map(m => m.title) || [];
      const availableMissionsCopy = availableMissions.filter(
        m => !completedTitles.includes(m.title)
      );
      
      if (availableMissionsCopy.length === 0) return; // No available missions
      
      // Select a random mission
      const randomIndex = Math.floor(Math.random() * availableMissionsCopy.length);
      const selectedMission = { ...availableMissionsCopy[randomIndex] };
      
      // Save to database
      const { error } = await supabase
        .from('missions')
        .insert({
          user_id: user.id,
          title: selectedMission.title,
          description: selectedMission.description,
          requirements: selectedMission.requirements,
          reward: selectedMission.reward,
          completed: false
        });
      
      if (error) throw error;
      
      // Update local state
      set((state) => ({
        userProfile: {
          ...state.userProfile,
          activeMission: selectedMission
        }
      }));
    } catch (error) {
      console.error("Error assigning mission:", error);
    }
  },
  
  // Complete mission
  completeMission: async () => {
    const { user, userProfile } = get();
    
    if (!user || !userProfile.activeMission) return;
    
    try {
      const { reward } = userProfile.activeMission;
      
      // Mark mission as completed in database
      const { error } = await supabase
        .from('missions')
        .update({ completed: true })
        .eq('user_id', user.id)
        .eq('title', userProfile.activeMission.title);
      
      if (error) throw error;
      
      // Add energy points
      await get().addEnergyPoints(reward.energyPoints);
      
      // If mission gives an achievement, unlock it
      if (reward.achievement) {
        await get().unlockAchievement(reward.achievement);
      }
      
      // Update local state
      set((state) => ({
        userProfile: {
          ...state.userProfile,
          activeMission: undefined
        }
      }));
      
      toast({
        title: "Миссия выполнена!",
        description: `Вы получили ${reward.energyPoints} энергетических очков`
      });
    } catch (error) {
      console.error("Error completing mission:", error);
    }
  }
});
