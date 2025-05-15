
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Edit2Icon } from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { UserAvatar } from '@/components/UserAvatar';
import AvatarUpload from './AvatarUpload';
import ZodiacInfo from './ZodiacInfo';
import BirthDateEditor from './BirthDateEditor';
import ProfileForm from './ProfileForm';
import ProfileDataDisplay from './ProfileDataDisplay';
import { useTranslations } from '@/hooks/useTranslations';
import * as z from 'zod';

const UserProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile, userProfile, language, onboardingComplete, setOnboardingComplete, user } = useAppStore();
  const { t } = useTranslations();
  const [age, setAge] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBirthDate, setEditingBirthDate] = useState(false);

  // Fetch profile data from Supabase when component mounts
  useEffect(() => {
    const fetchProfileFromSupabase = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching profile data from Supabase for user:", user.id);
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('name, birth_date')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Ошибка загрузки профиля",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        console.log("Profile data from Supabase:", profileData);
        
        if (profileData) {
          // Convert birth_date string from Supabase to a Date object
          const birthDate = profileData.birth_date ? new Date(profileData.birth_date) : new Date();
          
          // Update the store
          updateUserProfile({
            name: profileData.name,
            birthDate: birthDate
          });
          
          // Calculate and set age
          const calculatedAge = differenceInYears(new Date(), birthDate);
          setAge(calculatedAge);
        }
      } catch (err) {
        console.error("Exception fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch profile if user is available and we're not in the initial setup flow
    if (user && location.pathname === '/profile') {
      fetchProfileFromSupabase();
    } else if (userProfile && userProfile.name !== 'Искатель' && userProfile.birthDate) {
      // For the initial setup, use data from store if available
      
      // Calculate and set age
      const calculatedAge = differenceInYears(new Date(), userProfile.birthDate);
      setAge(calculatedAge);
    }
  }, [user, location.pathname]);
  
  // Handle form submission
  const onSubmit = async (values: z.infer<any>) => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему для обновления профиля",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Saving profile data to Supabase:", values);
      
      // Format birthDate to YYYY-MM-DD for Supabase
      const formattedBirthDate = format(values.birthDate, 'yyyy-MM-dd');
      
      // Update directly in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          birth_date: formattedBirthDate
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Also update the local store
      await updateUserProfile({
        name: values.name,
        birthDate: values.birthDate
      });
      
      // Calculate and set age
      const calculatedAge = differenceInYears(new Date(), values.birthDate);
      setAge(calculatedAge);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены"
      });
    
      // Always navigate to main regardless of previous location
      navigate('/main');
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить профиль",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle birth date edit button click
  const handleEditBirthDate = () => {
    setEditingBirthDate(true);
  };

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
      
      <ProfileDataDisplay age={age} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-cosmic-accent border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ProfileForm 
          onSubmit={onSubmit} 
          isSaving={isSaving} 
        />
      )}
      
      {/* Zodiac section */}
      {userProfile?.birthDate && <ZodiacInfo />}
      
      {/* Birth Date Edit Dialog */}
      <BirthDateEditor 
        open={editingBirthDate}
        onOpenChange={setEditingBirthDate}
      />
    </div>
  );
};

export default UserProfileForm;
