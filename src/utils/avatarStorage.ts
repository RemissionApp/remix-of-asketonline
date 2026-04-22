import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Avatars bucket is provisioned via migration with proper RLS policies.
 * This is a no-op kept for backward compatibility with existing call sites.
 */
export const ensureAvatarBucket = async () => {
  return true;
};

/**
 * Uploads an avatar file to Supabase storage
 */
export const uploadAvatarFile = async (userId: string, file: File) => {
  // Create a unique file path for each user's avatar
  const filePath = `${userId}/${Math.random().toString(36).substring(2)}`;

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  // Get the public URL for the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Updates the user's profile with the new avatar URL
 */
export const updateProfileAvatar = async (
  userId: string,
  avatarUrl: string
) => {
  // Profile row is guaranteed to exist (created by on_auth_user_created trigger).
  // Use UPDATE to avoid overwriting other columns like `name`.
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId);

  if (error) throw error;

  return true;
};
