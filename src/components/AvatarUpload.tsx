import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { UploadButton } from './avatar/UploadButton';
import { ConfirmUpload } from './avatar/ConfirmUpload';
import { useOptimizedProfileCache } from '@/hooks/useOptimizedProfileCache';
import {
  ensureAvatarBucket,
  uploadAvatarFile,
} from '@/utils/avatarStorage';

const AvatarUpload: React.FC = () => {
  const { user } = useAppStore();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Use optimized profile cache for avatar updates
  const { updateProfileAsync } = useOptimizedProfileCache(user as any);

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
    if (!user || !selectedFile) return;

    try {
      setUploading(true);

      // Get current auth session to ensure we're authenticated
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error('Не авторизован. Пожалуйста, войдите снова.');
      }

      // Ensure avatar bucket exists
      await ensureAvatarBucket();

      // Upload the file
      const publicUrl = await uploadAvatarFile(user.id, selectedFile);

      // Update profile using optimized cache
      await updateProfileAsync({ avatar_url: publicUrl });

      console.log('Avatar uploaded successfully:', publicUrl);
      
      // Force refresh profile cache to get latest data
      const { refreshProfile } = useOptimizedProfileCache(user as any);
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for DB propagation
      refreshProfile();
      
      toast({
        title: 'Аватар загружен',
        description: 'Ваш аватар был успешно обновлен',
      });

      // Trigger multiple refresh events to ensure immediate display
      window.dispatchEvent(new Event('avatar-updated'));
      setTimeout(() => {
        window.dispatchEvent(new Event('avatar-updated'));
      }, 300);

      // Clean up
      setShowConfirm(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
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
