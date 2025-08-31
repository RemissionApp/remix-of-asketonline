import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aewfggzscyjxpuciqtti.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2ZnZ3pzY3lqeHB1Y2lxdHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzYyMDcsImV4cCI6MjA2Mjc1MjIwN30.yRu3axa77L5DMcQn8CzY8sSOjeUNxkGXfXO8rfwGV2M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

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
