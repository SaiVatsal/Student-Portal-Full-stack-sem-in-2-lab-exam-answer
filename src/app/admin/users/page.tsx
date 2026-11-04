"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Users, Upload, UserPlus, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin" | "parent";
  identifier: string;
  status: "active" | "deactivated";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([
    { id: "u-1", name: "Aditya Verma", email: "aditya.verma@student.nitroazard.edu.in", role: "student", identifier: "2500040001", status: "active" },
    { id: "u-2", name: "Ananya Sharma", email: "ananya.sharma@student.nitroazard.edu.in", role: "student", identifier: "2500040002", status: "active" },
    { id: "u-3", name: "Dr. Rajesh Kumar", email: "rajesh.kumar@faculty.nitroazard.edu.in", role: "faculty", identifier: "KLU1042", status: "active" },
    { id: "u-4", name: "Dr. Priya Sundaram", email: "priya.sundaram@faculty.nitroazard.edu.in", role: "faculty", identifier: "KLU1088", status: "active" },
    { id: "u-5", name: "Polimera Sai Vatsal", email: "2500040224@nitroazard.edu.in", role: "admin", identifier: "2500040224", status: "active" },
    { id: "u-6", name: "Suresh Verma", email: "suresh.verma@parents.nitroazard.edu.in", role: "parent", identifier: "PARENT_2500040001", status: "active" },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCsvOpen, setIsCsvOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"student" | "faculty" | "admin" | "parent">("student");
  const [newIdentifier, setNewIdentifier] = useState("");

  const [csvReport, setCsvReport] = useState<{ processed: number; errors: string[] } | null>(null);

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "deactivated" : "active" }
          : u
      )
    );
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AdminUserRow = {
      id: `u-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      identifier: newIdentifier,
      status: "active",
    };
    setUsers([newUser, ...users]);
    setIsCreateOpen(false);
    setNewName("");
    setNewEmail("");
    setNewIdentifier("");
    alert("User provisioned with forced password change on first sign in.");
  };

  const handleSimulateCsvUpload = () => {
    setCsvReport({
      processed: 48,
      errors: [
        "Row 14: Invalid roll number format '250004X019' (expected 10 numeric digits)",
        "Row 29: Duplicate email 'rahul.k@student.nitroazard.edu.in' already exists in registry",
      ],
    });
  };

  return (
    <PortalLayout role="admin" userName="Polimera Sai Vatsal" userIdentifier="2500040224">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Identity & User Management</h1>
            <p className="text-xs text-text-muted mt-1">
              Provision Single Users • Bulk CSV Ingestion with Row-Level Error Reports • Account Lock & Deactivation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setIsCsvOpen(true)} size="sm" className="gap-1.5 text-xs">
              <Upload className="w-3.5 h-3.5" /> Bulk CSV Import
            </Button>
            <Button variant="primary" onClick={() => setIsCreateOpen(true)} size="sm" className="gap-1.5 text-xs">
              <UserPlus className="w-3.5 h-3.5" /> Provision User
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader
            title="University Directory Registry"
            subtitle="Scoped by role-based access control (RLS strictly enforced on all queries)"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Identifier</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Institutional Email</th>
                  <th className="py-3 px-4 text-center">Role</th>
                  <th className="py-3 px-4 text-center">Account Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-azure-400">{u.identifier}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground">{u.name}</td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">{u.email}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={
                          u.role === "admin"
                            ? "danger"
                            : u.role === "faculty"
                            ? "info"
                            : u.role === "student"
                            ? "success"
                            : "neutral"
                        }
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={u.status === "active" ? "success" : "danger"}>
                        {u.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                          u.status === "active"
                            ? "text-rose-400 hover:bg-rose-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {u.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal for Provisioning User */}
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Provision New University Account"
          description="Sets temporary password with mandatory reset on first authentication."
        >
          <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
            <Input
              label="Full Legal Name"
              placeholder="e.g. Vikramaditya Reddy"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />

            <Input
              label="Institutional Email"
              type="email"
              placeholder="e.g. vikram.reddy@student.nitroazard.edu.in"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-text-secondary font-medium mb-1">Account Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full h-10 px-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Administrator</option>
                  <option value="parent">Parent</option>
                </select>
              </div>

              <Input
                label="Student ID / Employee ID"
                placeholder="e.g. 2500040099"
                value={newIdentifier}
                onChange={(e) => setNewIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Provision Account
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal for Bulk CSV Import */}
        <Modal
          isOpen={isCsvOpen}
          onClose={() => {
            setIsCsvOpen(false);
            setCsvReport(null);
          }}
          title="Bulk CSV User Ingestion"
          description="Upload CSV roster. Validates rows against Zod schema with instant error reporting."
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 border border-dashed border-surface-border rounded-xl bg-surface-subtle text-center">
              <input type="file" accept=".csv" className="text-xs text-text-muted" />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSimulateCsvUpload}
                className="mt-3 text-xs"
              >
                Validate & Process CSV
              </Button>
            </div>

            {csvReport && (
              <div className="p-4 rounded-xl bg-surface-raised border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Successfully Ingested: {csvReport.processed} rows
                  </span>
                  <Badge variant="danger">{csvReport.errors.length} Format Errors</Badge>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-surface-border/60">
                  <span className="text-[11px] font-bold text-text-secondary uppercase">
                    Row-Level Error Audit:
                  </span>
                  {csvReport.errors.map((err, i) => (
                    <div key={i} className="text-rose-400 font-mono text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </PortalLayout>
  );
}
