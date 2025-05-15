
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Hard-code the values directly since the environment variables aren't being processed correctly
const supabaseUrl = "https://aewfggzscyjxpuciqtti.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2ZnZ3pzY3lqeHB1Y2lxdHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzYyMDcsImV4cCI6MjA2Mjc1MjIwN30.yRu3axa77L5DMcQn8CzY8sSOjeUNxkGXfXO8rfwGV2M";

// Initialize the Supabase client with explicit auth configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

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
