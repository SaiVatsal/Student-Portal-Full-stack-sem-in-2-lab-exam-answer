"use client";

import React, { useState } from "react";
import { loginAction } from "@/server/actions/auth";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("password", password);

    try {
      const res = await loginAction(null, formData);
      if (res && !res.success) {
        setError(res.error || "Authentication failed.");
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
        <h1 className="text-2xl font-bold font-display tracking-tight text-white">
          University Academic Portal
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          Unified Access for Students, Faculty, Administrators, and Guardians
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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
                label="Student ID / Employee ID / Registered Email"
                placeholder="Enter your institutional ID or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-text-secondary">Password</label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Self-service password recovery instructions sent to registered institutional email.");
                  }}
                  className="text-[11px] text-azure-400 hover:text-azure-300 font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-surface-border text-azure-500 focus:ring-azure-500 bg-surface-subtle"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2 font-semibold" isLoading={loading}>
              Sign In to Portal
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-surface-border/60 text-center text-xs text-text-muted space-y-2">
            <p className="flex items-center justify-center gap-1.5 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protected by 256-Bit TLS Encryption & Role-Level Security</span>
            </p>
            <p className="text-[11px] text-text-muted">
              Need account assistance? Contact{" "}
              <span className="text-text-secondary font-mono">ithelpdesk@nitroazard.edu.in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
