
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Hard-code the values directly since the environment variables aren't being processed correctly
const supabaseUrl = "https://aewfggzscyjxpuciqtti.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2ZnZ3pzY3lqeHB1Y2lxdHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzYyMDcsImV4cCI6MjA2Mjc1MjIwN30.yRu3axa77L5DMcQn8CzY8sSOjeUNxkGXfXO8rfwGV2M";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});

// Check and set up auth state on each page load
export const setupAuthListener = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // If logged in, make sure user state is set
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (!userProfile) {
      // Handle case where profile doesn't exist yet (should be created by trigger)
      console.warn('User logged in but no profile found');
    }
  }
  
  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session ? 'User logged in' : 'User logged out');
  });
};

// Helper function to clean up auth state
export const cleanupAuthState = () => {
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
};
