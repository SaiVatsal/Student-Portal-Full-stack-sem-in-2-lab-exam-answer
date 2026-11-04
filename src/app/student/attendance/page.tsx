import React from "react";
import { getSession } from "@/lib/security/session";
import { AcademicService, getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, AlertTriangle, ShieldCheck, Info } from "lucide-react";

export default async function StudentAttendancePage() {
  const session = await getSession();
  const studentId = session?.userId || "e0000000-0000-0000-0000-000000000001";
  const studentName = session?.fullName || "Aditya Verma";
  const identifier = session?.identifier || "2500040001";

  const summaries = await AcademicService.getStudentAttendanceSummaries(studentId);

  // Heatmap sample days (last 30 days)
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let status: "present" | "absent" | "weekend" | "holiday" = "present";
    if (isWeekend) status = "weekend";
    else if (i === 12 || i === 22) status = "absent";
    return {
      date: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      status,
    };
  });

  return (
    <PortalLayout role="student" userName={studentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Attendance & Eligibility Engine</h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time biometric & faculty session synchronization • 75% Deemed University Regulatory Threshold
          </p>
        </div>

        {/* Regulatory Rule Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-emerald-400">Eligible (75% and Above)</h4>
                <p className="text-[11px] text-text-muted mt-0.5">Permitted for all In-Sem & End-Sem examinations.</p>
              </div>
            </div>
          </Card>

          <Card className="border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-amber-400">Condonation (65.0% - 74.9%)</h4>
                <p className="text-[11px] text-text-muted mt-0.5">Medical or OD proof + Dean sanction required.</p>
              </div>
            </div>
          </Card>

          <Card className="border-rose-500/30 bg-rose-500/5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-rose-400">Detained (&lt; 65.0%)</h4>
                <p className="text-[11px] text-text-muted mt-0.5">Mandatory course repeat in subsequent summer term.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Heatmap Grid */}
        <Card>
          <CardHeader
            title="30-Day Attendance Heatmap"
            subtitle="Daily aggregate attendance record across all registered lecture and practical periods"
          />
          <div className="flex flex-wrap gap-2 pt-2">
            {heatmapDays.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 group relative cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-transform group-hover:scale-110 ${
                    item.status === "present"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : item.status === "absent"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                      : "bg-surface-subtle text-text-muted border border-surface-border"
                  }`}
                >
                  {item.status === "present" ? "P" : item.status === "absent" ? "A" : "—"}
                </div>
                <span className="text-[9px] text-text-muted">{item.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Detailed Course Breakdown Table with Shortage Calculator */}
        <Card>
          <CardHeader
            title="Course-Wise Breakdown & Shortage Calculator"
            subtitle="Calculates exactly how many classes you can afford to skip or must attend to hit 75%"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4 text-center">Conducted</th>
                  <th className="py-3 px-4 text-center">Attended</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Shortage Calculator Forecast</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {summaries.map((s) => (
                  <tr key={s.courseId} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{s.courseCode}</div>
                      <div className="text-[11px] text-text-muted">{s.courseTitle}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold text-foreground">
                      {s.conductedSessions}
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold text-emerald-400">
                      {s.attendedSessions}
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-sm">
                      <span
                        className={
                          s.percentage >= 75
                            ? "text-emerald-400"
                            : s.percentage >= 65
                            ? "text-amber-400"
                            : "text-rose-400"
                        }
                      >
                        {s.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={
                          s.status === "eligible"
                            ? "success"
                            : s.status === "condonation_needed"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {s.status === "eligible"
                          ? "Eligible"
                          : s.status === "condonation_needed"
                          ? "Condonation Required"
                          : "Detained"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {s.shortageMargin >= 0 ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <Info className="w-3.5 h-3.5 shrink-0" />
                          <span>You can safely skip <strong>{s.shortageMargin}</strong> more classes.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Must attend <strong>{Math.abs(s.shortageMargin)}</strong> consecutive classes without missing.</span>
                        </div>
                      )}
                    </td>
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
