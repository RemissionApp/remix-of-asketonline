
import React, { useState } from 'react';
import { UserAvatar } from '@/components/UserAvatar';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Loader2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

interface AvatarUploadProps {
  onUploadComplete?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onUploadComplete,
  size = 'lg'
}) => {
  const { userProfile, user, updateUserProfile } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslations();
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: t.avatar?.errorTitle || "Ошибка",
        description: t.avatar?.invalidFileType || "Пожалуйста, выберите изображение",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t.avatar?.errorTitle || "Ошибка",
        description: t.avatar?.fileTooLarge || "Файл слишком большой (максимум 5MB)",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create a unique file path for the user's avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update user profile with the new avatar URL
      await updateUserProfile({ 
        avatar_url: publicUrl 
      });
      
      // Call the onUploadComplete callback if provided
      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
      
      toast({
        title: t.avatar?.successTitle || "Успех",
        description: t.avatar?.uploadSuccess || "Аватар успешно обновлен",
      });
    } catch (error: any) {
      toast({
        title: t.avatar?.errorTitle || "Ошибка",
        description: error.message || t.avatar?.uploadError || "Не удалось загрузить аватар",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="relative">
      <UserAvatar size={size} customImage={userProfile.avatar_url} />
      
      <label 
        htmlFor="avatar-upload" 
        className="absolute -bottom-2 -right-2 bg-cosmic-accent text-white rounded-full p-1.5 cursor-pointer hover:bg-cosmic-accent/80 transition-colors"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
      </label>
      
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
};
