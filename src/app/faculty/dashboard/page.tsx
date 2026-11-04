import React from "react";
import { getSession } from "@/lib/security/session";
import { getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckSquare, Award, Users, BookOpen, Clock, FileCheck2, ChevronRight } from "lucide-react";

export default async function FacultyDashboardPage() {
  const session = await getSession();
  const facultyName = session?.fullName || "Dr. Rajesh Kumar";
  const identifier = session?.identifier || "KLU1042";

  return (
    <PortalLayout role="faculty" userName={facultyName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-surface to-surface-raised p-6 rounded-2xl border border-surface-border shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono text-emerald-400 font-semibold tracking-wider">
                Professor & Mentor • Department of Computer Science & Engineering
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Welcome, {facultyName}
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Employee ID: <span className="font-mono text-foreground">{identifier}</span> • Cabin: C-Block 312
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/faculty/attendance"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mark Session Attendance</span>
            </Link>

            <Link
              href="/faculty/marks"
              className="px-4 py-2 bg-azure-500 hover:bg-azure-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Enter In-Sem Marks</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Snapshots */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <span className="text-xs font-medium text-text-secondary">Assigned Sections</span>
            <div className="mt-3 text-2xl font-bold font-tabular text-foreground">3 Sections</div>
            <p className="text-[11px] text-text-muted mt-2">Section 12, 14 & 18</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Enrolled Students</span>
            <div className="mt-3 text-2xl font-bold font-tabular text-foreground">185 Students</div>
            <p className="text-[11px] text-text-muted mt-2">Active in 24CS2201 & 24CS2203</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Pending Mentee Requests</span>
            <div className="mt-3 text-2xl font-bold font-tabular text-amber-400">2 Requests</div>
            <p className="text-[11px] text-text-muted mt-2">On-Duty & Medical Leave</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Next Lecture</span>
            <div className="mt-3 text-xl font-bold text-foreground">Period 1 (09:00 AM)</div>
            <p className="text-[11px] text-text-muted mt-2">24CS2201 • Room C-402</p>
          </Card>
        </div>

        {/* Faculty Active Offerings Grid */}
        <Card>
          <CardHeader
            title="My Assigned Course Sections (Semester 6 Even)"
            subtitle="Direct course management: Attendance, In-Sem Assessments, and Materials"
          />

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-azure-400">24CS2201</span>
                  <Badge variant="info">Section 12</Badge>
                  <span className="text-xs text-text-muted">65 Enrolled Students</span>
                </div>
                <h4 className="text-sm font-bold text-foreground mt-1">Design and Analysis of Algorithms</h4>
                <p className="text-xs text-text-muted mt-0.5">Schedule: Mon/Wed (09:00 AM) • Room C-402</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/faculty/attendance"
                  className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-semibold text-foreground hover:bg-surface-raised transition-colors"
                >
                  Attendance
                </Link>
                <Link
                  href="/faculty/marks"
                  className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-semibold text-azure-400 hover:bg-surface-raised transition-colors"
                >
                  In-Sem Marks
                </Link>
                <Link
                  href="/faculty/students"
                  className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-semibold text-foreground hover:bg-surface-raised transition-colors"
                >
                  Roster
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-azure-400">24CS2203</span>
                  <Badge variant="info">Section 12</Badge>
                  <span className="text-xs text-text-muted">60 Enrolled Students</span>
                </div>
                <h4 className="text-sm font-bold text-foreground mt-1">Operating Systems Principles</h4>
                <p className="text-xs text-text-muted mt-0.5">Schedule: Mon/Thu (11:00 AM) • Room C-402</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/faculty/attendance"
                  className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-semibold text-foreground hover:bg-surface-raised transition-colors"
                >
                  Attendance
                </Link>
                <Link
                  href="/faculty/marks"
                  className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-semibold text-azure-400 hover:bg-surface-raised transition-colors"
                >
                  In-Sem Marks
                </Link>
                <Link
                  href="/faculty/students"
                  className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-semibold text-foreground hover:bg-surface-raised transition-colors"
                >
                  Roster
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
