// Nitro Azard Environment Startup Validation
// Fails loudly if critical security secrets or URLs are missing

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  sessionSecret: string;
  appUrl: string;
  isStandalone: boolean;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  razorpayWebhookSecret?: string;
}

export function validateEnv(): EnvConfig {
  const isStandalone = process.env.STANDALONE_DEV_MODE === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nitro-azard-demo.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo_anon_key";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "demo_service_key";
  const sessionSecret = process.env.SESSION_SECRET || "c8e7631fd2fba64057e937d25e0a0a9965a3962b7ff83bb412cf888db7c4ef50";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!isStandalone && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    throw new Error(
      "FATAL: Missing critical Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  if (sessionSecret.length < 32) {
    throw new Error("FATAL: SESSION_SECRET must be at least 32 characters in length for cryptographic security.");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
    sessionSecret,
    appUrl,
    isStandalone,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_nitroazard01",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "demo_secret",
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "demo_webhook_secret",
  };
}

export const env = validateEnv();
