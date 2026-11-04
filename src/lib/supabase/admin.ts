import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

if (typeof window !== "undefined") {
  throw new Error("SECURITY VIOLATION: Supabase Admin client cannot be imported or executed in client bundle.");
}

export function createAdminClient() {
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
