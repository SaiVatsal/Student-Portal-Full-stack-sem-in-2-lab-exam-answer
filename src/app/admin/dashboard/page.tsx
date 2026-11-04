import React from "react";
import { getSession } from "@/lib/security/session";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, BookOpen, CalendarDays, Award, CreditCard, ShieldCheck, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const adminName = session?.fullName || "Dr. K. Venkat Rao";
  const identifier = session?.identifier || "KLU_ADMIN_01";

  return (
    <PortalLayout role="admin" userName={adminName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-surface to-surface-raised p-6 rounded-2xl border border-surface-border shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono text-amber-400 font-semibold tracking-wider">
                Dean of Academics & Controller of Examinations • Nitro Azard ERP
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Academic Administration Central Console
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Session: 2024-2025 Even Semester • All Academic Regulations Active
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/grades"
              className="px-4 py-2 bg-azure-500 hover:bg-azure-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>Process End-Sem Results</span>
            </Link>

            <Link
              href="/admin/users"
              className="px-4 py-2 bg-surface-subtle hover:bg-surface border border-surface-border text-foreground text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </Link>
          </div>
        </div>

        {/* 4 University Wide KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <span className="text-xs font-medium text-text-secondary">Enrolled Students</span>
            <div className="mt-3 text-2xl font-bold font-tabular text-foreground">12,480</div>
            <p className="text-[11px] text-emerald-400 mt-2 font-medium">98.2% Fee Cleared</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Active Faculty</span>
            <div className="mt-3 text-2xl font-bold font-tabular text-foreground">840 Faculty</div>
            <p className="text-[11px] text-text-muted mt-2">100% MFA Enforced</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Attendance Compliance</span>
            <div className="mt-3 text-2xl font-bold font-tabular text-emerald-400">91.4%</div>
            <p className="text-[11px] text-text-muted mt-2">Above 75% threshold</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Security Audit Log</span>
            <div className="mt-3 text-2xl font-bold font-tabular text-azure-400">0 Alerts</div>
            <p className="text-[11px] text-text-muted mt-2">Append-only log intact</p>
          </Card>
        </div>

        {/* Administrative Quick Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users" className="block group">
            <Card className="h-full hover:border-azure-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-azure-500/10 text-azure-400">
                  <Users className="w-5 h-5" />
                </span>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-azure-400" />
              </div>
              <h3 className="font-display font-bold text-sm text-foreground mt-4">
                User Management & CSV Import
              </h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Provision students, faculty, bulk CSV uploads with row-level error reporting and account deactivation.
              </p>
            </Card>
          </Link>

          <Link href="/admin/timetable" className="block group">
            <Card className="h-full hover:border-azure-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CalendarDays className="w-5 h-5" />
                </span>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-emerald-400" />
              </div>
              <h3 className="font-display font-bold text-sm text-foreground mt-4">
                Timetable Builder & Clash Engine
              </h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Automated classroom conflict, faculty double-booking, and exam hall clash detection.
              </p>
            </Card>
          </Link>

          <Link href="/admin/grades" className="block group">
            <Card className="h-full hover:border-azure-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Award className="w-5 h-5" />
                </span>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-amber-400" />
              </div>
              <h3 className="font-display font-bold text-sm text-foreground mt-4">
                End-Sem Grades & Result Freezing
              </h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                End-Sem exam score upload, relative 10-point SGPA/CGPA computation, result publication and lock.
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
