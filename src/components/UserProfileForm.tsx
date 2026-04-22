import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { differenceInYears } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const location = useLocation();
  const {
    userProfile,
    user,
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

  // Hydrate the local form from store data once available.
  useEffect(() => {
    if (userProfile?.name || userProfile?.birthDate) {
      setFormData({
        name: userProfile.name || '',
        birthDate: userProfile.birthDate || new Date(),
      });
      if (userProfile.birthDate) {
        setAge(differenceInYears(new Date(), userProfile.birthDate));
      }
    }
  }, [userProfile?.name, userProfile?.birthDate]);

  // Handle form submission - single upsert, optimistic local update, no navigation.
  const onSubmit = async (values: z.infer<any>) => {
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
      const formattedBirthDate = values.birthDate.toISOString().split('T')[0];

      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            name: values.name,
            birth_date: formattedBirthDate,
            profile_step_completed: true,
          },
          { onConflict: 'id' }
        );

      if (error) throw error;

      // Authoritative local update — useAuthFlow recomputes targetRoute
      // and <ProtectedRoute> redirects automatically.
      useAppStore.setState(state => ({
        userProfile: {
          ...state.userProfile,
          name: values.name,
          birthDate: values.birthDate,
        },
        profileStepCompleted: true,
      }));

      setFormData({ name: values.name, birthDate: values.birthDate });
      setAge(differenceInYears(new Date(), values.birthDate));

      toast({
        title: 'Профиль обновлен',
        description: 'Ваши данные успешно сохранены',
      });
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
      {location.pathname === '/profile-setup' && (
        <p className="text-xs uppercase tracking-widest text-cosmic-secondary/60 mb-4">
          Шаг 1 из 2
        </p>
      )}
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
