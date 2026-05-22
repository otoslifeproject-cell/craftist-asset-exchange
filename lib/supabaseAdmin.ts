import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { requiredEnv } from './env';

let client: SupabaseClient | null = null;

export function supabaseAdmin() {
  if (client) return client;
  client = createClient(requiredEnv('NEXT_PUBLIC_SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return client;
}
