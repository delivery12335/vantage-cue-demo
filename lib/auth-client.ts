import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
export function getAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true,
    storage: {
      getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
      setItem: (name, value) => {
        const remember = localStorage.getItem("vantage-remember") !== "false";
        (remember ? sessionStorage : localStorage).removeItem(name);
        (remember ? localStorage : sessionStorage).setItem(name, value);
      },
      removeItem: (name) => { localStorage.removeItem(name); sessionStorage.removeItem(name); },
    },
  } });
  return client;
}
