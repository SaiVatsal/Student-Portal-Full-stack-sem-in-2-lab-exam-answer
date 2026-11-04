import React from "react";
import { getSession } from "@/lib/security/session";
import { AcademicService, getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldCheck, ShieldAlert, Download, Clock, MapPin, AlertCircle } from "lucide-react";

export default async function StudentExamsPage() {
  const session = await getSession();
  const studentId = session?.userId || "e0000000-0000-0000-0000-000000000001";
  const studentName = session?.fullName || "Aditya Verma";
  const identifier = session?.identifier || "2500040001";

  const store = getDatabase();
  const schedules = store.examSchedules;
  const gate = await AcademicService.checkHallTicketEligibility(studentId);

  return (
    <PortalLayout role="student" userName={studentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Examinations & Hall Ticket</h1>
          <p className="text-xs text-text-muted mt-1">
            End-Semester Theory Examinations (Even 2024-25) • Seating Arrangements & Automated Eligibility Gate
          </p>
        </div>

        {/* Hall Ticket Clearance Gate Status */}
        <Card className={`border-2 ${gate.eligible ? "border-emerald-500/40 bg-emerald-500/5" : "border-rose-500/40 bg-rose-500/5"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className={`p-3 rounded-xl ${gate.eligible ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                {gate.eligible ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-display text-foreground">
                    Hall Ticket Status: {gate.eligible ? "ELIGIBLE & GENERATED" : "BLOCKED"}
                  </h3>
                  <Badge variant={gate.eligible ? "success" : "danger"}>
                    {gate.eligible ? "Admit Card Ready" : "Detained / Pending Dues"}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {gate.eligible
                    ? "All clearance checks passed: 100% fee settled and attendance satisfies minimum deemed university regulations."
                    : "Your hall ticket is currently blocked due to outstanding administrative obligations."}
                </p>
                {!gate.eligible && gate.reasons.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {gate.reasons.map((r, i) => (
                      <li key={i} className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              {gate.eligible ? (
                <a
                  href={`/api/export/hallticket?studentId=${studentId}`}
                  target="_blank"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download Official Hall Ticket (PDF)
                </a>
              ) : (
                <Button variant="danger" disabled className="text-xs">
                  Hall Ticket Blocked
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Exam Schedule & Seating Table */}
        <Card>
          <CardHeader
            title="End-Semester Exam Schedule & Seating Plan"
            subtitle="Invigilated by Central Examination Cell • Reporting time: 30 minutes before commencement"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4 text-center">Session & Timing</th>
                  <th className="py-3 px-4">Allotted Examination Hall & Desk</th>
                  <th className="py-3 px-4 text-center">Invigilation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-azure-400">
                      {s.examDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground font-mono">{s.courseCode}</div>
                      <div className="text-[11px] text-text-muted">{s.courseTitle}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium">
                      {s.startTime} - {s.endTime} (FN)
                    </td>
                    <td className="py-3.5 px-4 text-foreground font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-hot" />
                      <span>{s.hall}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="neutral">Seating Verified</Badge>
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
