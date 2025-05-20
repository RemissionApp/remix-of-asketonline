
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { differenceInYears } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/utils/dateFormatUtils';
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
  const { updateUserProfile, userProfile, language, onboardingComplete, setOnboardingComplete, user, loadUserProfile } = useAppStore();
  const { t } = useTranslations();
  const [age, setAge] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBirthDate, setEditingBirthDate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: new Date()
  });

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
        
        if (profileData) {
          // Convert birth_date string from Supabase to a Date object
          const birthDate = profileData.birth_date ? new Date(profileData.birth_date) : null;
          
          // Update the store and local form data
          await updateUserProfile({
            name: profileData.name || userProfile.name,
            birthDate: profileData.birth_date || null,
            avatar_url: profileData.avatar_url || userProfile.avatar_url
          });
          
          setFormData({
            name: profileData.name || userProfile.name || '',
            birthDate: birthDate || new Date()
          });
          
          // Calculate and set age
          if (birthDate) {
            const calculatedAge = differenceInYears(new Date(), birthDate);
            setAge(calculatedAge);
          }
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
  }, [user, userProfile.avatar_url, loadUserProfile, updateUserProfile]);
  
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
      console.log("Saving profile data:", values);
      
      // Format birthDate to YYYY-MM-DD for Supabase
      const formattedBirthDate = formatDate(values.birthDate, 'en', false).split('/').reverse().join('-');
      
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
        birthDate: formattedBirthDate
      });
      
      // Update local form data
      setFormData({
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
      
      // Always navigate to main when clicking continue
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
          defaultValues={{
            name: userProfile.name !== 'Искатель' ? userProfile.name : '',
            birthDate: userProfile.birthDate ? new Date(userProfile.birthDate) : new Date()
          }}
        />
      )}
      
      {userProfile?.birthDate && (
        <div className="mt-8">
          <h3 className="text-xl font-serif text-white mb-4">Знак зодиака</h3>
          <ZodiacInfo />
        </div>
      )}
      
      {/* Birth Date Edit Dialog */}
      <BirthDateEditor 
        open={editingBirthDate}
        onOpenChange={setEditingBirthDate}
      />
    </div>
  );
};

export default UserProfileForm;
