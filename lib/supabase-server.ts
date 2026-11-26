import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client with the service role key, so /api/order can
// save every order (guests included). Never import this from a client file.
// null when SUPABASE_SERVICE_ROLE_KEY isn't set — callers fall back gracefully.
let client: SupabaseClient | null | undefined;

export function supabaseServer(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}
