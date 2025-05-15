import React, { useState } from 'react';
import { Camera, Check, UploadCloud, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { UserAvatar } from './UserAvatar';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';

const AvatarUpload: React.FC = () => {
  const { user, userProfile, updateUserProfile } = useAppStore();
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
    if (!user || !selectedFile) return;
    
    try {
      setUploading(true);
      
      // Get current auth session to ensure we're authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error("Не авторизован. Пожалуйста, войдите снова.");
      }
      
      // Check first if avatars bucket exists, try to create if it doesn't
      try {
        // Try to get the bucket first to see if it exists
        const { error: bucketError } = await supabase.storage.getBucket('avatars');
        
        if (bucketError) {
          // If bucket doesn't exist, try to create it
          await supabase.storage.createBucket('avatars', { 
            public: true,
            fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
          });
          
          // Set up bucket policies to allow public access to avatars
          const { error: policyError } = await supabase.storage.from('avatars').createSignedUrl(
            'test-policy.txt', 
            60, 
            {
              transform: {
                width: 100,
                height: 100,
              }
            }
          );
          
          if (policyError) {
            console.log("Policy setup may be needed on the server side");
          }
        }
      } catch (err) {
        console.error("Error checking/creating bucket:", err);
        // Continue anyway, might work if bucket exists on server side
      }
      
      // Create a unique file path for each user's avatar
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);
      
      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      updateUserProfile({
        ...userProfile,
        avatar_url: publicUrl
      });
      
      // Clean up
      setShowConfirm(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      toast({
        title: "Аватар обновлен",
        description: "Ваш аватар успешно загружен"
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить аватар",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  // If showing confirmation UI
  if (showConfirm) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-cosmic-accent"
            />
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
            onClick={cancelUpload}
            disabled={uploading}
          >
            <X className="mr-1 h-4 w-4" />
            Отмена
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="bg-cosmic-accent/20 hover:bg-cosmic-accent/30 text-white"
            onClick={uploadAvatar}
            disabled={uploading}
          >
            {uploading ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-cosmic-accent border-t-transparent rounded-full" />
                Загрузка...
              </div>
            ) : (
              <>
                <Check className="mr-1 h-4 w-4" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
  
  // Default upload button UI
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <UserAvatar size="lg" />
        
        <label
          htmlFor="avatar-upload"
          className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cosmic-accent text-white cursor-pointer"
          title="Загрузить аватар"
        >
          <Camera size={16} />
        </label>
        
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
