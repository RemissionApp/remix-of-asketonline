import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { formatDateLong } from '@/utils/dateFormatUtils';

interface ProfileDataDisplayProps {
  age: number | null;
}

const ProfileDataDisplay: React.FC<ProfileDataDisplayProps> = ({ age }) => {
  const { language, userProfile } = useAppStore();
  const { t, getYearWord } = useTranslations();

  return (
    <>
      {userProfile.name && userProfile.name.trim() !== '' && (
        <div className="mb-6 text-cosmic-accent font-medium font-sans">
          {userProfile.name}
        </div>
      )}
      
      {userProfile.birthDate && (
        <div className="mb-6 text-cosmic-secondary font-medium font-sans">
          {t.userProfile?.birthDate || 'Дата рождения'}:{' '}
          {formatDateLong(userProfile.birthDate, language)}
        </div>
      )}
      
      {age !== null && (
        <div className="mb-6 text-cosmic-secondary font-medium font-sans">
          {t.userProfile?.age || 'Возраст'}: {age} {getYearWord(age)}
        </div>
      )}

      <div className="mt-6 mb-8 text-cosmic-secondary text-sm font-sans">
        {t.userProfile?.currentDate || 'Текущая дата'}:{' '}
        {formatDateLong(new Date(), language)}
      </div>
    </>
  );
};

export default ProfileDataDisplay;
