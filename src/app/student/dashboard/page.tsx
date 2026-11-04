import React from "react";
import { getSession } from "@/lib/security/session";
import { AcademicService, getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CalendarDays,
  AlertTriangle,
  Clock,
  Bell,
  CreditCard,
  Award,
  ChevronRight,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  GraduationCap,
} from "lucide-react";

export default async function StudentDashboardPage() {
  const session = await getSession();
  const studentId = session?.userId || "e0000000-0000-0000-0000-000000000001";
  const studentName = session?.fullName || "Aditya Verma";
  const identifier = session?.identifier || "2500040001";

  const store = getDatabase();
  const attendanceSummaries = await AcademicService.getStudentAttendanceSummaries(studentId);
  const hallTicketGate = await AcademicService.checkHallTicketEligibility(studentId);
  const dues = store.feeDues.get(studentId) || [];
  const pendingFee = dues.filter((d) => d.status !== "paid").reduce((acc, d) => acc + (d.amountDue - d.amountPaid), 0);
  const notices = store.notices.slice(0, 3);
  const timetableToday = store.timetable.filter((t) => t.dayOfWeek === "Monday"); // Current day preview

  return (
    <PortalLayout role="student" userName={studentName} userIdentifier={identifier}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-surface to-surface-raised p-6 rounded-2xl border border-surface-border shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono text-azure-400 font-semibold tracking-wider">
                B.Tech Computer Science & Engineering • 6th Semester
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Welcome back, {studentName}
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Registration No: <span className="font-mono text-foreground">{identifier}</span> • Section 12 • Room C-402
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/results"
              className="px-4 py-2 bg-surface-subtle hover:bg-surface border border-surface-border rounded-lg text-xs font-medium text-foreground transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-azure-400" />
              <span>CGPA: <strong className="text-emerald-400 font-tabular">8.84</strong></span>
            </Link>

            <Link
              href="/student/exams"
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                hallTicketGate.eligible
                  ? "bg-azure-500 hover:bg-azure-600 text-white shadow-sm"
                  : "bg-[#FF6B2C] hover:bg-[#E55A1D] text-white"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{hallTicketGate.eligible ? "Hall Ticket Ready" : "Hall Ticket Blocked"}</span>
            </Link>
          </div>
        </div>

        {/* Critical Alerts Banner (Fee Due or Attendance Shortage) */}
        {pendingFee > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-300">
                  Pending Semester Fee Dues: INR {pendingFee.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Clear outstanding dues before the examination clearance deadline to unblock your Hall Ticket.
                </p>
              </div>
            </div>
            <Link
              href="/student/fees"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg shrink-0 transition-colors"
            >
              Pay Now
            </Link>
          </div>
        )}

        {/* 4 Stat Snapshots */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Aggregate Attendance</span>
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-tabular text-foreground">
                {hallTicketGate.attendancePercentage}%
              </span>
              <Badge variant={hallTicketGate.attendancePercentage >= 75 ? "success" : "danger"}>
                {hallTicketGate.attendancePercentage >= 75 ? "Eligible" : "Warning"}
              </Badge>
            </div>
            <p className="text-[11px] text-text-muted mt-2">Required minimum: 75.0%</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Cumulative CGPA</span>
              <span className="p-2 rounded-lg bg-azure-500/10 text-azure-400">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-tabular text-foreground">8.84</span>
              <Badge variant="info">Top 5%</Badge>
            </div>
            <p className="text-[11px] text-text-muted mt-2">Earned 108 of 160 credits</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Active Courses</span>
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-tabular text-foreground">5</span>
              <span className="text-xs text-text-muted">20 Credits</span>
            </div>
            <p className="text-[11px] text-text-muted mt-2">L-T-P-S Structure verified</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Next Exam</span>
              <span className="p-2 rounded-lg bg-hot/10 text-hot">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">24CS2201</span>
              <Badge variant="hot">24 Apr</Badge>
            </div>
            <p className="text-[11px] text-text-muted mt-2">10:00 AM • C-Block Desk 42</p>
          </Card>
        </div>

        {/* Main Grid: Attendance Watchlist & Today's Timetable */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Course Attendance Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader
                title="Course Attendance Tracker"
                subtitle="Monitored against deemed university 75% threshold rules"
                action={
                  <Link
                    href="/student/attendance"
                    className="text-xs text-azure-400 hover:text-azure-300 font-medium flex items-center gap-1"
                  >
                    Shortage Calculator <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                }
              />

              <div className="space-y-4">
                {attendanceSummaries.map((c) => (
                  <div
                    key={c.courseId}
                    className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {c.courseCode}
                        </span>
                        <Badge
                          variant={
                            c.percentage >= 75
                              ? "success"
                              : c.percentage >= 65
                              ? "warning"
                              : "danger"
                          }
                        >
                          {c.percentage >= 75
                            ? "Normal"
                            : c.percentage >= 65
                            ? "Condonation Required"
                            : "Detained"}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-1">{c.courseTitle}</p>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <div className="text-sm font-bold font-tabular text-foreground">
                          {c.attendedSessions}/{c.conductedSessions} ({c.percentage}%)
                        </div>
                        <p className="text-[11px] text-text-muted">
                          {c.shortageMargin >= 0
                            ? `Can skip ${c.shortageMargin} more sessions`
                            : `Must attend ${Math.abs(c.shortageMargin)} consecutive classes`}
                        </p>
                      </div>

                      {/* Visual Progress bar */}
                      <div className="w-20 bg-surface-raised rounded-full h-2 overflow-hidden border border-surface-border">
                        <div
                          className={`h-full rounded-full ${
                            c.percentage >= 75
                              ? "bg-emerald-500"
                              : c.percentage >= 65
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${Math.min(c.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Today's Timetable */}
            <Card>
              <CardHeader
                title="Today's Class Schedule (Monday)"
                subtitle="Synchronized live with academic section timetable"
                action={
                  <Link
                    href="/student/timetable"
                    className="text-xs text-azure-400 hover:text-azure-300 font-medium flex items-center gap-1"
                  >
                    Full Week Timetable <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                }
              />

              <div className="divide-y divide-surface-border/50">
                {timetableToday.map((slot) => (
                  <div key={slot.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface-raised text-center min-w-[64px]">
                        <span className="text-[11px] font-mono font-bold text-azure-400 block">
                          {slot.startTime}
                        </span>
                        <span className="text-[9px] text-text-muted block">
                          Period {slot.period}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {slot.courseCode} - {slot.courseTitle}
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5">
                          Faculty: {slot.facultyName} • Room: <span className="text-foreground">{slot.room}</span>
                        </div>
                      </div>
                    </div>

                    <Badge variant="info">In-Person</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column (1 span): Notices, Deadlines & Hall Ticket Card */}
          <div className="space-y-6">
            {/* Hall Ticket Clearance Gate Card */}
            <Card className="border-azure-500/30 bg-gradient-to-b from-surface to-surface-raised">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-azure-400" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  End-Sem Hall Ticket Clearance
                </h3>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Admit cards are issued only upon automatic verification of 100% fee clearance and minimum 75% course attendance.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-surface-subtle">
                  <span className="text-text-secondary">Fee Clearance:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Zero Dues
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-surface-subtle">
                  <span className="text-text-secondary">Attendance Rule:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 84.8% Aggregate
                  </span>
                </div>
              </div>

              <Link
                href="/student/exams"
                className="mt-4 w-full py-2.5 px-4 bg-azure-500 hover:bg-azure-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" /> View & Download Hall Ticket
              </Link>
            </Card>

            {/* University Official Circulars & Notices */}
            <Card>
              <CardHeader
                title="University Circulars"
                subtitle="Official notifications from Dean Academics"
              />

              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n.id} className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase text-azure-400 font-bold">
                        {n.category}
                      </span>
                      <span className="text-[10px] text-text-muted">{n.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground mt-1.5 line-clamp-2">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                      {n.content}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
