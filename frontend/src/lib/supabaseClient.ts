import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Environment variables missing in some environments — runtime will surface errors.
}

export const supabase = createClient<Database>(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// if (typeof window !== 'undefined') {
//   // @ts-ignore
//   window.supabase = supabase;
// }

export default supabase;