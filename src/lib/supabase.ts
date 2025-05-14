
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Hard-code the values directly since the environment variables aren't being processed correctly
const supabaseUrl = "https://aewfggzscyjxpuciqtti.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2ZnZ3pzY3lqeHB1Y2lxdHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzYyMDcsImV4cCI6MjA2Mjc1MjIwN30.yRu3axa77L5DMcQn8CzY8sSOjeUNxkGXfXO8rfwGV2M";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
