import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { differenceInYears } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/utils/dateFormatUtils';
import { createLogger } from '@/utils/logger';
import AvatarUpload from './AvatarUpload';
import ZodiacInfo from './ZodiacInfo';
import BirthDateEditor from './BirthDateEditor';
import ProfileForm from './ProfileForm';
import ProfileDataDisplay from './ProfileDataDisplay';
import { useTranslations } from '@/hooks/useTranslations';
import * as z from 'zod';

const UserProfileForm: React.FC = () => {
  const logger = createLogger('UserProfileForm');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    updateUserProfile,
    userProfile,
    language,
    onboardingComplete,
    setOnboardingComplete,
    user,
    loadUserProfile,
  } = useAppStore();
  const { t } = useTranslations();
  const [age, setAge] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBirthDate, setEditingBirthDate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: new Date(),
  });

  // Load user profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // First, try to load from the store
        await loadUserProfile();

        logger.debug('Profile loaded from store', {
          profileName: userProfile.name,
        });

        // Then fetch the latest data from Supabase
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('name, birth_date, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          logger.error('Error fetching profile', error);
          return;
        }

        logger.debug('Profile data from Supabase', { profileData });

        if (profileData) {
          // Convert birth_date string from Supabase to a Date object
          const birthDate = profileData.birth_date
            ? new Date(profileData.birth_date)
            : null;

          // Update the store and local form data
          await updateUserProfile({
            name: profileData.name || userProfile.name,
            birthDate: birthDate || userProfile.birthDate,
            avatar_url: profileData.avatar_url || userProfile.avatar_url,
          });

          setFormData({
            name: profileData.name || userProfile.name || '',
            birthDate: birthDate || userProfile.birthDate || new Date(),
          });

          // Calculate and set age
          if (birthDate) {
            const calculatedAge = differenceInYears(new Date(), birthDate);
            setAge(calculatedAge);
          }
        }
      } catch (err) {
        logger.error('Exception fetching profile', err);
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
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form values received:', values);
    
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Вы должны войти в систему для обновления профиля',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Format birthDate to YYYY-MM-DD for Supabase (ISO format)
      const formattedBirthDate = values.birthDate.toISOString().split('T')[0];
      
      console.log('Updating Supabase with:', {
        name: values.name,
        birth_date: formattedBirthDate,
      });

      // Update directly in Supabase
      const { data: updateResult, error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          birth_date: formattedBirthDate,
        })
        .eq('id', user.id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Supabase update successful:', updateResult);

      // Force reload profile data to sync with DB
      console.log('=== RELOADING PROFILE AFTER SAVE ===');
      await loadUserProfile();
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Update local form data
      setFormData({
        name: values.name,
        birthDate: values.birthDate,
      });

      // Calculate and set age
      const calculatedAge = differenceInYears(new Date(), values.birthDate);
      setAge(calculatedAge);

      toast({
        title: 'Профиль обновлен',
        description: 'Ваши данные успешно сохранены',
      });

      // Check profile completion immediately after reload with fresh state
      const currentState = useAppStore.getState();
      console.log('=== CHECKING COMPLETION STATUS ===');
      console.log('Current userProfile state:', currentState.userProfile);
      
      const profileComplete = currentState.isProfileComplete();
      const onboardingComplete = currentState.checkOnboardingStatus();
      
      console.log('Profile complete:', profileComplete);
      console.log('Onboarding complete:', onboardingComplete);
      
      if (profileComplete && !onboardingComplete) {
        console.log('=== REDIRECTING TO ONBOARDING ===');
        navigate('/onboarding');
      } else if (profileComplete && onboardingComplete) {
        console.log('=== REDIRECTING TO MAIN ===');
        navigate('/main');
      } else {
        console.log('=== STAYING ON PROFILE PAGE - NOT COMPLETE ===');
      }
    } catch (error: any) {
      logger.error('Error saving profile', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить профиль',
        variant: 'destructive',
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
          {t.userProfile?.title || 'О тебе'}
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
            name: formData.name || userProfile.name || '',
            birthDate: formData.birthDate || userProfile.birthDate || new Date(),
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
