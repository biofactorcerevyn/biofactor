// Re-export the centralized client from `src/lib` so existing imports keep working.
// export {supabase} from '../../lib/supabaseClient';
export type { Database } from './types';

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

// 🔴 DEBUG ONLY — REMOVE LATER
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.supabase = supabase;
}
