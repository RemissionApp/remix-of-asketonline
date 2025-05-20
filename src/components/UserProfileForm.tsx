
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { differenceInYears } from 'date-fns';
import { supabase } from '@/lib/supabase';
import AvatarUpload from './AvatarUpload';
import ZodiacInfo from './ZodiacInfo';
import ProfileDataDisplay from './ProfileDataDisplay';
import { useTranslations } from '@/hooks/useTranslations';

const UserProfileForm: React.FC = () => {
  const location = useLocation();
  const { userProfile, loadUserProfile, user } = useAppStore();
  const { t } = useTranslations();
  const [age, setAge] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // First, try to load from the store
        await loadUserProfile();
        
        console.log("Profile loaded from store:", userProfile);
        
        // Then fetch the latest data from Supabase
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('name, birth_date, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        console.log("Profile data from Supabase:", profileData);
        
        // Calculate and set age if birth date is available
        if (profileData.birth_date) {
          const birthDate = new Date(profileData.birth_date);
          const calculatedAge = differenceInYears(new Date(), birthDate);
          setAge(calculatedAge);
        }
      } catch (err) {
        console.error("Exception fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadProfile();
    }
  }, [user, userProfile.avatar_url, loadUserProfile]);
  
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="flex justify-center mb-4 relative">
        <AvatarUpload />
      </div>
      
      {location.pathname !== '/profile' && (
        <h2 className="text-3xl font-serif text-white mb-6">
          {t.userProfile?.title || "О тебе"}
        </h2>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-cosmic-accent border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ProfileDataDisplay age={age} />
      )}
      
      {userProfile?.birthDate && (
        <div className="mt-8">
          <h3 className="text-xl font-serif text-white mb-4">{t.zodiac?.yourSign || "Знак зодиака"}</h3>
          <ZodiacInfo />
        </div>
      )}
    </div>
  );
};

export default UserProfileForm;
