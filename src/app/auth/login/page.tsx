"use client";

import React, { useState } from "react";
import { loginAction } from "@/server/actions/auth";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCheck, KeyRound, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleQuickFill = (roleId: string, rolePass: string) => {
    setIdentifier(roleId);
    setPassword(rolePass);
    setError(null);
  };

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
      // Next.js redirect throws in server actions, which is normal
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
          University Academic ERP Portal
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          Unified portal for Students, Faculty, Administrators, and Parents
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
                label="Student ID / Employee ID / Email"
                placeholder="e.g. 2500040001 or KLU1042"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
              Sign In to Portal
            </Button>
          </form>

          {/* Quick Demo Role Selector for effortless review */}
          <div className="mt-6 pt-5 border-t border-surface-border/60">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              Quick Role Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleRoleQuickFill("2500040001", "NitroStudent2025!")}
                className="p-2 rounded-lg bg-surface-subtle hover:bg-surface-raised border border-surface-border text-left transition-colors"
              >
                <div className="font-semibold text-azure-400">Student</div>
                <div className="text-[10px] text-text-muted">ID: 2500040001</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickFill("KLU1042", "NitroFaculty2025!")}
                className="p-2 rounded-lg bg-surface-subtle hover:bg-surface-raised border border-surface-border text-left transition-colors"
              >
                <div className="font-semibold text-emerald-400">Faculty</div>
                <div className="text-[10px] text-text-muted">ID: KLU1042</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickFill("KLU_ADMIN_01", "NitroAdmin2025!")}
                className="p-2 rounded-lg bg-surface-subtle hover:bg-surface-raised border border-surface-border text-left transition-colors"
              >
                <div className="font-semibold text-amber-400">Admin</div>
                <div className="text-[10px] text-text-muted">ID: KLU_ADMIN_01</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickFill("suresh.verma@parents.nitroazard.edu.in", "NitroParent2025!")}
                className="p-2 rounded-lg bg-surface-subtle hover:bg-surface-raised border border-surface-border text-left transition-colors"
              >
                <div className="font-semibold text-purple-400">Parent</div>
                <div className="text-[10px] text-text-muted">Ward: Aditya</div>
              </button>
            </div>
            <p className="text-[10px] text-text-muted text-center mt-3">
              MFA Test Token for Faculty & Admin: <span className="font-mono text-azure-400 font-bold">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
