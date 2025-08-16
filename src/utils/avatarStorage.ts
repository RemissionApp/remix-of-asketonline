import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

/**
 * Ensures that the avatars bucket exists and has proper permissions
 */
export const ensureAvatarBucket = async () => {
  try {
    // Check if bucket exists
    const { error: bucketError } = await supabase.storage.getBucket('avatars');

    if (bucketError) {
      // If bucket doesn't exist, try to create it
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
      });

      // Set up bucket policies to allow public access to avatars
      const { error: policyError } = await supabase.storage
        .from('avatars')
        .createSignedUrl('test-policy.txt', 60, {
          transform: {
            width: 100,
            height: 100,
          },
        });

      if (policyError) {
        console.log('Policy setup may be needed on the server side');
      }
    }

    return true;
  } catch (err) {
    console.error('Error checking/creating bucket:', err);
    return false;
  }
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
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId);

  if (error) throw error;

  return true;
};
