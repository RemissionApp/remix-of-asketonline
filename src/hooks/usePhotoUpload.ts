import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePhotoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = async (file: File, missionId: string, dayNumber: number): Promise<string | null> => {
    if (!file) return null;

    setIsUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');

      // Создаем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${missionId}/day-${dayNumber}-${Date.now()}.${fileExt}`;

      console.log('📸 Загружаем фото:', fileName);

      // Загружаем файл в Storage
      const { data, error } = await supabase.storage
        .from('mission-photos')
        .upload(fileName, file);

      if (error) {
        console.error('❌ Ошибка загрузки:', error);
        throw error;
      }

      // Получаем публичный URL (хотя bucket приватный, URL будет работать для владельца)
      const { data: { publicUrl } } = supabase.storage
        .from('mission-photos')
        .getPublicUrl(fileName);

      console.log('✅ Фото загружено:', publicUrl);
      
      toast.success('Фото успешно загружено!');
      return publicUrl;

    } catch (error) {
      console.error('💥 Ошибка загрузки фото:', error);
      toast.error('Не удалось загрузить фото');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deletePhoto = async (url: string): Promise<boolean> => {
    try {
      // Извлекаем path из URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      const { error } = await supabase.storage
        .from('mission-photos')
        .remove([fileName]);

      if (error) throw error;
      
      console.log('🗑️ Фото удалено:', fileName);
      return true;
    } catch (error) {
      console.error('❌ Ошибка удаления фото:', error);
      return false;
    }
  };

  return {
    uploadPhoto,
    deletePhoto,
    isUploading,
  };
};