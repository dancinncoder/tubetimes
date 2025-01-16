import { createClient } from "@supabase/supabase-js";

// Accessing the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl as string,
  supabaseKey as string
);
