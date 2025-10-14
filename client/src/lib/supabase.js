import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey
  });
  throw new Error('Missing required Supabase environment variables. Please check your .env file.');
}

// Create client with anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For admin operations, we'll use the regular client but with different approach
export const supabaseAdmin = supabase;
