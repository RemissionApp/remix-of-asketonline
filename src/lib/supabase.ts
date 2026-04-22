// Re-export the auto-generated, typed Supabase client.
// The old hardcoded client pointed to a deleted project; all imports now
// transparently use the Lovable Cloud client.
export { supabase } from '@/integrations/supabase/client';

/**
 * Очищает состояние аутентификации для предотвращения проблем с лимбо авторизации
 */
export const cleanupAuthState = () => {
  try {
    // Удаляем все стандартные токены аутентификации
    localStorage.removeItem('supabase.auth.token');

    // Удаляем все ключи аутентификации Supabase из localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });

    // Удаляем из sessionStorage, если используется
    Object.keys(sessionStorage || {}).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });

    // Удаляем куки, связанные с аутентификацией
    document.cookie.split(';').forEach(c => {
      if (c.trim().startsWith('sb-')) {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      }
    });
  } catch (error) {
    console.error('Ошибка при очистке состояния аутентификации:', error);
  }
};

/**
 * Ensure the avatars bucket exists and has proper permissions
 */
export const ensureAvatarBucketExists = async () => {
  try {
    // Check if bucket exists
    const { error: bucketError } = await supabase.storage.getBucket('avatars');

    // Create bucket if it doesn't exist
    if (bucketError) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
      });
    }

    return true;
  } catch (error) {
    console.error('Error ensuring avatar bucket exists:', error);
    return false;
  }
};
