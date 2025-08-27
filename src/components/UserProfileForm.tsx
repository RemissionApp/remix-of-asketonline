import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { differenceInYears } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { createLogger } from '@/utils/logger';
import AvatarUpload from './AvatarUpload';
import ZodiacInfo from './ZodiacInfo';
import BirthDateEditor from './BirthDateEditor';
import ProfileForm from './ProfileForm';
import ProfileDataDisplay from './ProfileDataDisplay';
import { useTranslations } from '@/hooks/useTranslations';
import { useOptimizedProfileCache } from '@/hooks/useOptimizedProfileCache';
import * as z from 'zod';

const UserProfileForm: React.FC = () => {
  const logger = createLogger('UserProfileForm');
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, user, isProfileComplete, checkOnboardingStatus } = useAppStore();
  const { t } = useTranslations();
  const [age, setAge] = useState<number | null>(null);
  const [editingBirthDate, setEditingBirthDate] = useState(false);

  // Use optimized profile cache - cast user to AuthUser type
  const {
    profile,
    isLoading,
    updateProfile,
    updateProfileAsync,
    isUpdating,
  } = useOptimizedProfileCache(user as any);

  // Calculate age when profile data changes
  useEffect(() => {
    if (profile?.birthDate) {
      const calculatedAge = differenceInYears(new Date(), profile.birthDate);
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [profile?.birthDate]);

  // Define proper types for form submission
  interface ProfileFormData {
    name: string;
    birthDate: Date;
  }

  // Handle form submission
  const onSubmit = async (values: ProfileFormData) => {
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Вы должны войти в систему для обновления профиля',
        variant: 'destructive',
      });
      return;
    }

    try {
      logger.info('Saving profile data', {
        name: values.name,
        hasBirthDate: !!values.birthDate,
      });

      // Use optimized profile update
      await updateProfileAsync({
        name: values.name,
        birthDate: values.birthDate,
      });

      // Navigate based on profile completion and onboarding status
      const profileComplete = isProfileComplete();
      const onboardingComplete = checkOnboardingStatus();
      
      if (profileComplete && !onboardingComplete) {
        navigate('/onboarding');
      } else if (profileComplete && onboardingComplete) {
        navigate('/main');
      } else {
        // Profile still not complete, stay here
        logger.warn('Profile save successful but still not complete');
      }
    } catch (error: any) {
      logger.error('Error saving profile', error);
      // Error toast is handled by the optimized cache
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

      {isLoading || isUpdating ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-cosmic-accent border-t-transparent rounded-full"></div>
          <span className="ml-2 text-cosmic-secondary">
            {isLoading ? 'Загрузка...' : 'Сохранение...'}
          </span>
        </div>
      ) : (
        <ProfileForm
          onSubmit={onSubmit}
          isSaving={isUpdating}
          defaultValues={{
            name: profile?.name && profile.name !== 'Искатель' ? profile.name : '',
            birthDate: profile?.birthDate || new Date(),
          }}
        />
      )}

      {profile?.birthDate && (
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
