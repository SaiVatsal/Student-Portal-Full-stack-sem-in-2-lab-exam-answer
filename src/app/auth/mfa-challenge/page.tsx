"use client";

import React, { useState } from "react";
import { verifyMfaAction } from "@/server/actions/auth";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldAlert, KeyRound, AlertCircle, HelpCircle } from "lucide-react";

export default function MFAChallengePage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("token", token);

    try {
      const res = await verifyMfaAction(null, formData);
      if (res && !res.success) {
        setError(res.error || "Verification failed.");
      }
    } catch {
      // Next.js redirect
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center justify-center gap-2">
          <ShieldAlert className="w-5 h-5 text-azure-400" />
          Two-Factor Authentication
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          Enter the verification code from your authenticator application
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111B2E] py-8 px-6 shadow-2xl rounded-2xl border border-surface-border sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="6-Digit Authenticator Code or Backup Key"
                placeholder="000 000"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                maxLength={9}
                className="font-mono text-center text-lg tracking-widest"
                autoFocus
              />
            </div>

            <Button type="submit" variant="primary" className="w-full font-semibold" isLoading={loading}>
              Verify & Complete Sign In
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-surface-border/60 text-center text-[11px] text-text-muted">
            <p>
              Lost access to your authenticator device? Use one of your 8-digit emergency recovery codes or contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
