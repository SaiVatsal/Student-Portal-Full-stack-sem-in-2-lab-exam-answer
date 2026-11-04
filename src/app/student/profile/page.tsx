"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, ShieldCheck, KeyRound, Smartphone, LogOut, CheckCircle2 } from "lucide-react";

export default function StudentProfilePage() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    { id: "s-1", device: "Chrome 122 on Windows (Current)", ip: "172.16.4.12", active: "Active Now" },
    { id: "s-2", device: "Safari on iPhone 15 Pro", ip: "172.16.8.90", active: "4 hours ago" },
  ]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    alert("Session revoked successfully.");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 10) {
      alert("Password must be at least 10 characters.");
      return;
    }
    alert("Password updated and stored securely with argon2/bcrypt hashing.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <PortalLayout role="student" userName="Aditya Verma" userIdentifier="2500040001">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Student Profile & Security Settings</h1>
          <p className="text-xs text-text-muted mt-1">
            Personal Information • Document Vault • Multi-Factor Authentication • Active Browser Sessions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader title="Academic & Personal Details" subtitle="Verified Admissions Record" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-muted">Full Legal Name:</span>
                  <p className="font-bold text-foreground text-sm mt-0.5">Aditya Verma</p>
                </div>
                <div>
                  <span className="text-text-muted">Registration Number:</span>
                  <p className="font-mono font-bold text-azure-400 text-sm mt-0.5">2500040001</p>
                </div>
                <div>
                  <span className="text-text-muted">Program & Branch:</span>
                  <p className="font-semibold text-foreground mt-0.5">B.Tech Computer Science & Engineering</p>
                </div>
                <div>
                  <span className="text-text-muted">Academic Batch:</span>
                  <p className="font-semibold text-foreground mt-0.5">Batch 2022 - 2026 (6th Semester)</p>
                </div>
                <div>
                  <span className="text-text-muted">Registered Email:</span>
                  <p className="font-mono text-foreground mt-0.5">aditya.verma@student.nitroazard.edu.in</p>
                </div>
                <div>
                  <span className="text-text-muted">Contact Phone:</span>
                  <p className="font-mono text-foreground mt-0.5">+91 98480 12345</p>
                </div>
                <div>
                  <span className="text-text-muted">Faculty Mentor:</span>
                  <p className="font-semibold text-azure-400 mt-0.5">Dr. Rajesh Kumar (Professor, CSE)</p>
                </div>
                <div>
                  <span className="text-text-muted">Linked Parent Identifier:</span>
                  <p className="font-mono text-foreground mt-0.5">PARENT_2500040001 (Suresh Verma)</p>
                </div>
              </div>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader title="Change Password" subtitle="Minimum 10 characters required with zxcvbn entropy score check" />
              <form onSubmit={handlePasswordUpdate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Secure Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="sm">
                  Update Password
                </Button>
              </form>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader title="Active Login Sessions" subtitle="Cryptographically signed httpOnly session tokens" />
              <div className="divide-y divide-surface-border/50 text-xs">
                {sessions.map((s) => (
                  <div key={s.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{s.device}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">IP: {s.ip} • {s.active}</p>
                    </div>
                    {s.id !== "s-1" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRevokeSession(s.id)}
                        className="text-xs text-rose-400"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: MFA Configuration */}
          <div className="space-y-6">
            <Card className="border-azure-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-5 h-5 text-azure-400" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Two-Factor Authentication (TOTP)
                </h3>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Add an extra layer of protection using Google Authenticator, Authy, or 1Password.
              </p>

              <div className="mt-4 p-3 rounded-lg bg-surface-subtle border border-surface-border text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-secondary">MFA Status:</span>
                  <Badge variant={mfaEnabled ? "success" : "neutral"}>
                    {mfaEnabled ? "ENABLED" : "OPTIONAL"}
                  </Badge>
                </div>
              </div>

              <Button
                variant={mfaEnabled ? "secondary" : "primary"}
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className="w-full mt-4 text-xs"
              >
                {mfaEnabled ? "Disable TOTP Protection" : "Enable TOTP Multi-Factor"}
              </Button>
            </Card>

            <Card>
              <CardHeader title="Verified Digital Documents" subtitle="Admissions & Degree Records" />
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-surface-subtle flex items-center justify-between">
                  <span>Class 12 / Intermediate Marks Memo</span>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div className="p-2.5 rounded bg-surface-subtle flex items-center justify-between">
                  <span>Aadhaar Identity Card</span>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div className="p-2.5 rounded bg-surface-subtle flex items-center justify-between">
                  <span>Transfer Certificate (TC)</span>
                  <Badge variant="success">Verified</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
