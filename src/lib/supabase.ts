
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aewfggzscyjxpuciqtti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2ZnZ3pzY3lqeHB1Y2lxdHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzYyMDcsImV4cCI6MjA2Mjc1MjIwN30.yRu3axa77L5DMcQn8CzY8sSOjeUNxkGXfXO8rfwGV2M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Enable automatic URL detection for auth callbacks
  },
})

/**
 * Cleans up authentication state to prevent auth limbo issues
 */
export const cleanupAuthState = () => {
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error cleaning up auth state:', error);
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

/**
 * Manually resend verification email for a user
 */
export const resendVerificationEmail = async (email: string): Promise<{success: boolean; message: string}> => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Verification email resent successfully. Please check your inbox.'
    };
  } catch (error: any) {
    console.error('Error resending verification email:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to resend verification email.'
    };
  }
};

/**
 * Check if an email verification link is valid
 */
export const verifyEmailToken = async (token: string): Promise<boolean> => {
  try {
    // We don't actually need to do anything here as Supabase handles the verification
    // This is just a utility function to check if verification was successful
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    // If we have a user and their email is confirmed, verification was successful
    return !!user?.email_confirmed_at;
  } catch (error) {
    console.error('Error verifying email token:', error);
    return false;
  }
};
