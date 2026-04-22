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

      // Cache-busted URL so <img> reflects the new file immediately.
      const timestamp = Date.now();
      const cacheBustedUrl = `${publicUrl}?v=${timestamp}`;
      localStorage.setItem('avatar-upload-timestamp', timestamp.toString());

      // Single optimistic update — Zustand is the only source of truth.
      useAppStore.setState(state => ({
        userProfile: {
          ...state.userProfile,
          avatar_url: cacheBustedUrl,
        },
      }));

      window.dispatchEvent(new CustomEvent('avatarUpdated', {
        detail: { avatarUrl: cacheBustedUrl, timestamp },
      }));
      logger.debug('Local state updated with cache-busted URL');

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
