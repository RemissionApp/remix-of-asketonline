import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UploadButton } from './avatar/UploadButton';
import { ConfirmUpload } from './avatar/ConfirmUpload';
import {
  uploadAvatarFile,
  updateProfileAvatar,
} from '@/utils/avatarStorage';
import { createLogger } from '@/utils/logger';

const AvatarUpload: React.FC = () => {
  const logger = createLogger('AvatarUpload');
  const { user, userProfile, loadUserProfile } = useAppStore();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setSelectedFile(file);

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setShowConfirm(true);

    // Clean up old input value so selecting the same file again works
    e.target.value = '';
  };

  const cancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setShowConfirm(false);
  };

  const uploadAvatar = async () => {
    if (!user || !selectedFile) {
      logger.error('Missing user or file', { user: !!user, selectedFile: !!selectedFile });
      return;
    }

    try {
      setUploading(true);
      logger.debug('Starting avatar upload', { userId: user.id, fileName: selectedFile.name });

      // Get current auth session to ensure we're authenticated
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error('Не авторизован. Пожалуйста, войдите снова.');
      }

      // Upload the file
      const publicUrl = await uploadAvatarFile(user.id, selectedFile);
      logger.debug('File uploaded successfully', { publicUrl });

      // Update profile with new avatar URL
      await updateProfileAvatar(user.id, publicUrl);
      logger.debug('Profile updated in database');

      // Save timestamp for cache-busting
      const timestamp = Date.now();
      localStorage.setItem('avatar-upload-timestamp', timestamp.toString());
      
      // Optimistic UI update - directly update local state
      const store = useAppStore.getState();
      useAppStore.setState(state => ({
        userProfile: { 
          ...state.userProfile, 
          avatar_url: publicUrl 
        }
      }));
      logger.debug('Local state updated optimistically');

      // Force reload profile from database with cache bypass
      setTimeout(async () => {
        try {
          logger.debug('Force reloading profile from database');
          await loadUserProfile();
          
          // Trigger custom event for immediate avatar update
          window.dispatchEvent(new CustomEvent('avatarUpdated', { 
            detail: { 
              avatarUrl: publicUrl,
              timestamp 
            } 
          }));
          logger.debug('Avatar update event dispatched');
        } catch (err) {
          logger.error('Error during profile reload', err);
        }
      }, 100);

      // Clean up
      setShowConfirm(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      toast({
        title: 'Аватар обновлен',
        description: 'Ваш аватар успешно загружен',
      });
      
      logger.info('Avatar upload completed successfully');
    } catch (error: any) {
      logger.error('Error uploading avatar', error);
      toast({
        title: 'Ошибка загрузки',
        description: error.message || 'Не удалось загрузить аватар',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Return the appropriate component based on current state
  return showConfirm ? (
    <ConfirmUpload
      previewUrl={previewUrl}
      uploading={uploading}
      onCancel={cancelUpload}
      onConfirm={uploadAvatar}
    />
  ) : (
    <UploadButton onFileChange={handleFileChange} uploading={uploading} />
  );
};

export default AvatarUpload;
