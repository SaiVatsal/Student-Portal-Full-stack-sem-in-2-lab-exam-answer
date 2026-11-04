import React from "react";
import { getSession } from "@/lib/security/session";
import { AcademicService, getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, CheckCircle2, Award, CalendarCheck, CreditCard, ChevronRight } from "lucide-react";

export default async function ParentDashboardPage() {
  const session = await getSession();
  const parentName = session?.fullName || "Suresh Verma";
  const identifier = session?.identifier || "PARENT_2500040001";
  const studentId = "e0000000-0000-0000-0000-000000000001"; // Linked Ward: Aditya Verma

  const store = getDatabase();
  const attendance = await AcademicService.getStudentAttendanceSummaries(studentId);
  const transcript = await AcademicService.getStudentTranscript(studentId);
  const dues = store.feeDues.get(studentId) || [];
  const pendingAmount = dues.filter((d) => d.status !== "paid").reduce((acc, d) => acc + (d.amountDue - d.amountPaid), 0);

  return (
    <PortalLayout role="parent" userName={parentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-surface to-surface-raised p-6 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono text-purple-400 font-semibold tracking-wider">
              Parent & Guardian View • Scoped Student Access
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            Ward Overview: Aditya Verma
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Roll No: <span className="font-mono text-foreground">2500040001</span> • B.Tech CSE (6th Semester) • Mentor: Dr. Rajesh Kumar
          </p>
        </div>

        {/* 4 Ward Snapshot Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <span className="text-xs font-medium text-text-secondary">Aggregate Attendance</span>
            <div className="mt-2 text-2xl font-bold font-tabular text-emerald-400">84.8%</div>
            <p className="text-[11px] text-text-muted mt-2">Satisfies 75% Regulation</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Cumulative CGPA</span>
            <div className="mt-2 text-2xl font-bold font-tabular text-azure-400">{transcript.cgpa}</div>
            <p className="text-[11px] text-text-muted mt-2">First Class Distinction</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Fee Status</span>
            <div className="mt-2 text-2xl font-bold font-tabular text-emerald-400">
              {pendingAmount === 0 ? "Zero Dues" : `₹ ${pendingAmount}`}
            </div>
            <p className="text-[11px] text-text-muted mt-2">Semester 6 Cleared</p>
          </Card>

          <Card>
            <span className="text-xs font-medium text-text-secondary">Hostel Accommodation</span>
            <div className="mt-2 text-sm font-bold text-foreground">Kapil Dev Block A-304</div>
            <p className="text-[11px] text-text-muted mt-2">Warden: Prof. M. Venkateswarlu</p>
          </Card>
        </div>

        {/* Course-Wise Attendance Status for Ward */}
        <Card>
          <CardHeader
            title="Ward Attendance Progress"
            subtitle="Direct real-time attendance percentages across all enrolled courses"
          />

          <div className="space-y-3">
            {attendance.map((c) => (
              <div
                key={c.courseId}
                className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-azure-400">{c.courseCode}</span>
                  <h4 className="font-semibold text-foreground mt-0.5">{c.courseTitle}</h4>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-tabular font-bold text-sm text-foreground">
                    {c.attendedSessions} / {c.conductedSessions} ({c.percentage}%)
                  </span>
                  <Badge variant={c.percentage >= 75 ? "success" : "warning"}>
                    {c.percentage >= 75 ? "Eligible" : "Condonation Needed"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
