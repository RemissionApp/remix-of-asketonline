
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from "@/components/ui/date-picker";
import { useTranslations } from '@/hooks/useTranslations';
import { useToast } from '@/hooks/use-toast';

interface UserProfileFormProps {
  onSuccess?: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSuccess = () => {} }) => {
  const { updateUserProfile, userProfile } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { toast } = useToast();
  
  const initialBirthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  
  const [birthDate, setBirthDate] = React.useState<Date | null>(initialBirthDate);
  
  const formik = useFormik({
    initialValues: {
      name: userProfile?.name || '',
      age: userProfile?.age || null,
      goal: userProfile?.goal || '',
      zodiacSign: userProfile?.zodiacSign || '',
      birthDate: initialBirthDate || null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, t.userProfile?.nameRequired || "Name must be at least 2 characters")
        .max(50, t.userProfile?.nameMaxLength || "Name must be 50 characters or less")
        .required(t.userProfile?.nameRequired || "Name is required"),
      age: Yup.number()
        .integer(t.userProfile?.ageValidationInteger || 'Must be an integer')
        .min(5, t.userProfile?.ageValidationTooYoung || 'Too young')
        .max(120, t.userProfile?.ageValidationTooOld || 'Too old')
        .nullable(),
      goal: Yup.string()
        .min(10, t.userProfile?.goalValidationShort || 'Must be at least 10 characters')
        .max(200, t.userProfile?.goalValidationLong || 'Must be 200 characters or less')
        .required(t.userProfile?.goalValidationRequired || 'Required'),
      zodiacSign: Yup.string(),
      birthDate: Yup.date().nullable(),
    }),
    onSubmit: async (values) => {
      // Convert Date to ISO string when saving to Supabase
      const profileData = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.toISOString() : null,
      };
      
      try {
        await updateUserProfile(profileData);
        toast({
          title: t.userProfile?.profileUpdated || "Profile updated",
          description: t.userProfile?.profileUpdatedDesc || "Your profile has been updated successfully",
        });
        
        if (onSuccess) onSuccess();
        navigate('/main');
      } catch (error) {
        toast({
          title: t.userProfile?.profileUpdateFailed || "Update failed",
          description: t.userProfile?.profileUpdateFailedDesc || "There was a problem updating your profile",
          variant: "destructive",
        });
      }
    },
  });
  
  const handleBirthDateChange = (date: Date | null) => {
    // Convert Date to ISO string when saving to form state
    setBirthDate(date);
    if (date) {
      formik.setFieldValue('birthDate', date);
    } else {
      formik.setFieldValue('birthDate', null);
    }
  };
  
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{t.userProfile?.nameLabel || 'Name'}</Label>
        <Input
          type="text"
          id="name"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500">{formik.errors.name}</div>
        ) : null}
      </div>
      
      <div>
        <Label htmlFor="age">{t.userProfile?.ageLabel || 'Age'}</Label>
        <Input
          type="number"
          id="age"
          {...formik.getFieldProps('age')}
        />
        {formik.touched.age && formik.errors.age ? (
          <div className="text-red-500">{formik.errors.age}</div>
        ) : null}
      </div>
      
      <div>
        <Label htmlFor="goal">{t.userProfile?.goalLabel || 'Life Goal'}</Label>
        <Input
          type="text"
          id="goal"
          {...formik.getFieldProps('goal')}
        />
        {formik.touched.goal && formik.errors.goal ? (
          <div className="text-red-500">{formik.errors.goal}</div>
        ) : null}
      </div>
      
      <div>
        <Label htmlFor="birthDate">{t.userProfile?.birthDateLabel || 'Birth Date'}</Label>
        <DatePicker
          id="birthDate"
          onSelect={handleBirthDateChange}
          date={birthDate}
        />
        {formik.touched.birthDate && formik.errors.birthDate ? (
          <div className="text-red-500">{formik.errors.birthDate}</div>
        ) : null}
      </div>
      
      <CosmicButton type="submit" disabled={formik.isSubmitting}>
        {t.userProfile?.submitButton || 'Submit'}
      </CosmicButton>
    </form>
  );
};

export default UserProfileForm;
