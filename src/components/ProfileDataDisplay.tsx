
import React from 'react';
import { format, differenceInYears } from 'date-fns';
import { ru, es, enUS } from 'date-fns/locale';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

interface ProfileDataDisplayProps {
  age: number | null;
}

const ProfileDataDisplay: React.FC<ProfileDataDisplayProps> = ({ age }) => {
  const { language } = useAppStore();
  const { t, getYearWord } = useTranslations();
  
  // Get locale based on selected language
  const getLocale = () => {
    switch (language) {
      case 'ru':
        return ru;
      case 'es':
        return es;
      default:
        return enUS;
    }
  };
  
  return (
    <>
      {age !== null && (
        <div className="mb-6 text-cosmic-secondary font-medium">
          {t.userProfile?.age || "Возраст"}: {age} {getYearWord(age)}
        </div>
      )}
      
      <div className="mt-6 text-cosmic-secondary text-sm">
        {t.userProfile?.currentDate || "Текущая дата"}: {format(new Date(), "PPP", { locale: getLocale() })}
      </div>
    </>
  );
};

export default ProfileDataDisplay;
