"use client";

import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// null until Mohamed creates the Supabase project and sets the two env vars
// on Vercel — every account feature checks this and degrades gracefully.
export const supabase: SupabaseClient | null = url && anon ? createClient(url, anon) : null;

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, ready, enabled: !!supabase };
}
