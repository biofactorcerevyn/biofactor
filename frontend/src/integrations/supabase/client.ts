// Re-export the centralized client from `src/lib` so existing imports keep working.
export { supabase } from '../../lib/supabaseClient';
export type { Database } from './types';