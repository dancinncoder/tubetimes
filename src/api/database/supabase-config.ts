import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error("Supabase URL or key is missing in environment variables.");
// }

// export const supabase = createClient(
//   supabaseUrl as string,
//   supabaseKey as string
// );

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or key is missing in environment variables.");
}

// Supabase 클라이언트 초기화
export const supabase = createClient(supabaseUrl, supabaseKey);
