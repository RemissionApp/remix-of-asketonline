
import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { formatDateLong } from '@/utils/dateFormatUtils';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import BirthDateEditor from './BirthDateEditor';
import NameEditor from './NameEditor';

interface ProfileDataDisplayProps {
  age: number | null;
}

const ProfileDataDisplay: React.FC<ProfileDataDisplayProps> = ({ age }) => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const [editingName, setEditingName] = useState(false);
  const [editingBirthDate, setEditingBirthDate] = useState(false);
  
  return (
    <div className="mb-8">
      <div className="mb-4 bg-cosmic-dark/30 backdrop-blur-sm border border-cosmic-accent/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-cosmic-secondary text-sm">{t.userProfile?.nameLabel || "Имя"}</span>
            <span className="text-white text-lg font-medium">{userProfile.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-cosmic-accent hover:bg-cosmic-accent/10"
            onClick={() => setEditingName(true)}
          >
            <Edit className="h-4 w-4 mr-1" /> {t.userProfile?.editButton || "Изменить"}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-cosmic-secondary text-sm">{t.userProfile?.birthDateLabel || "Дата рождения"}</span>
            <span className="text-white text-lg font-medium">
              {userProfile.birthDate ? formatDateLong(userProfile.birthDate, language) : '-'}
            </span>
            {age !== null && (
              <span className="text-cosmic-secondary text-sm">
                {age} {t.userProfile?.yearsOld || "лет"}
              </span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-cosmic-accent hover:bg-cosmic-accent/10"
            onClick={() => setEditingBirthDate(true)}
          >
            <Edit className="h-4 w-4 mr-1" /> {t.userProfile?.editButton || "Изменить"}
          </Button>
        </div>
      </div>
      
      <div className="mt-6 mb-8 text-cosmic-secondary text-sm font-sans">
        {t.userProfile?.currentDate || "Текущая дата"}: {formatDateLong(new Date(), language)}
      </div>
      
      {/* Модальное окно для редактирования имени */}
      <NameEditor 
        open={editingName} 
        onOpenChange={setEditingName} 
      />
      
      {/* Модальное окно для редактирования даты рождения */}
      <BirthDateEditor 
        open={editingBirthDate} 
        onOpenChange={setEditingBirthDate} 
      />
    </div>
  );
};

export default ProfileDataDisplay;
