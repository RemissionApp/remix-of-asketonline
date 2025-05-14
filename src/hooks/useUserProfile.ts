
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";

export const useUserProfile = () => {
  const userProfile = useAppStore(state => state.userProfile);
  const setUserProfile = useAppStore(state => state.setUserProfile);

  // Update user profile with new data
  const updateUserProfile = async (updates: Partial<typeof userProfile>) => {
    try {
      setUserProfile({ 
        ...userProfile, 
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      // If connected to Supabase, update the database as well
      if (supabase && updates && Object.keys(updates).length > 0) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userProfile.id);
            
          if (error) throw error;
        } catch (err) {
          console.error('Failed to update profile in database:', err);
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  
  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setUserProfile({
          ...userProfile,
          ...data
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  return {
    userProfile,
    updateUserProfile,
    fetchUserProfile,
  };
};
