
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { formatDateLong } from '@/utils/dateFormatUtils';

interface ProfileDataDisplayProps {
  age: number | null;
}

const ProfileDataDisplay: React.FC<ProfileDataDisplayProps> = ({ age }) => {
  const { language } = useAppStore();
  const { t, getYearWord } = useTranslations();
  
  return (
    <>
      {age !== null && (
        <div className="mb-6 text-cosmic-secondary font-medium">
          {t.userProfile?.age || "Возраст"}: {age} {getYearWord(age)}
        </div>
      )}
      
      <div className="mt-6 text-cosmic-secondary text-sm">
        {t.userProfile?.currentDate || "Текущая дата"}: {formatDateLong(new Date(), language)}
      </div>
    </>
  );
};

export default ProfileDataDisplay;
