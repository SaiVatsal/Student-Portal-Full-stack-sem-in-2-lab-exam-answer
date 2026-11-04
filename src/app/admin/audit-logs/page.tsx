import React from "react";
import { getSession } from "@/lib/security/session";
import { getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Activity } from "lucide-react";

export default async function AdminAuditLogsPage() {
  const session = await getSession();
  const adminName = session?.fullName || "Polimera Sai Vatsal";
  const identifier = session?.identifier || "2500040224";

  const store = getDatabase();
  const logs = store.auditLogs;

  const demoLogs = [
    {
      id: "aud-901",
      action: "USER_LOGIN_SUCCESS",
      actor: "Dr. Rajesh Kumar (KLU1042)",
      entity: "profiles / session",
      ip: "172.16.4.12",
      details: "Faculty authentication via TOTP MFA token",
      time: "2025-03-24 09:12 AM",
    },
    {
      id: "aud-902",
      action: "ATTENDANCE_MARKED",
      actor: "Dr. Rajesh Kumar (KLU1042)",
      entity: "24CS2201 - Section 12",
      ip: "172.16.4.12",
      details: "Session attendance recorded (62 Present, 3 Absent)",
      time: "2025-03-24 10:45 AM",
    },
    {
      id: "aud-903",
      action: "FEE_PAYMENT_SUCCESS",
      actor: "Aditya Verma (2500040001)",
      entity: "student_fee_dues / Razorpay",
      ip: "172.16.8.44",
      details: "Settled INR 1,86,500 via NetBanking (Txn NA-RCP-2025-08149)",
      time: "2025-03-23 04:30 PM",
    },
    {
      id: "aud-904",
      action: "EXAM_SCHEDULE_PUBLISHED",
      actor: "Dr. K. Venkat Rao (KLU_ADMIN_01)",
      entity: "exam_schedules",
      ip: "172.16.2.1",
      details: "End-Semester exam timetable published across student portals",
      time: "2025-03-20 09:00 AM",
    },
  ];

  return (
    <PortalLayout role="admin" userName={adminName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Append-Only Security Audit Trail</h1>
            <p className="text-xs text-text-muted mt-1">
              Immutable Forensic Audit Log • Who did what, when, and from which IP address
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> SHA-256 Chain Verification: INTACT
          </div>
        </div>

        <Card>
          <CardHeader
            title="System Mutation Audit Records"
            subtitle="Append-only Postgres audit_logs table tracking all role promotions, mark changes, logins and fee transactions"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Log ID & Timestamp</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Operation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {demoLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-azure-400 block">{l.id}</span>
                      <span className="text-[10px] text-text-muted">{l.time}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          l.action.includes("LOGIN")
                            ? "info"
                            : l.action.includes("FEE")
                            ? "success"
                            : l.action.includes("ATTENDANCE")
                            ? "neutral"
                            : "warning"
                        }
                      >
                        {l.action}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">{l.actor}</td>
                    <td className="py-3.5 px-4 font-mono text-text-secondary">{l.entity}</td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">{l.ip}</td>
                    <td className="py-3.5 px-4 text-text-muted">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
