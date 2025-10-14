import { createClient } from "@supabase/supabase-js";

// Gunakan environment variable agar aman
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Membuat instance Supabase client untuk digunakan di seluruh app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
