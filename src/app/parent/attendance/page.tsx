import React from "react";
import { getSession } from "@/lib/security/session";
import { AcademicService } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ParentAttendancePage() {
  const session = await getSession();
  const parentName = session?.fullName || "Suresh Verma";
  const identifier = session?.identifier || "PARENT_2500040001";
  const studentId = "e0000000-0000-0000-0000-000000000001";

  const summaries = await AcademicService.getStudentAttendanceSummaries(studentId);

  return (
    <PortalLayout role="parent" userName={parentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Ward Attendance Record: Aditya Verma</h1>
          <p className="text-xs text-text-muted mt-1">
            Monitored against deemed university 75% threshold rules • Roll No: 2500040001
          </p>
        </div>

        <Card>
          <CardHeader title="Course Attendance Summary" subtitle="Semester 6 Even" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4 text-center">Conducted</th>
                  <th className="py-3 px-4 text-center">Attended</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {summaries.map((s) => (
                  <tr key={s.courseId} className="hover:bg-surface-raised/50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground font-mono">{s.courseCode}</div>
                      <div className="text-[11px] text-text-muted">{s.courseTitle}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold">{s.conductedSessions}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold text-emerald-400">{s.attendedSessions}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-sm text-foreground">{s.percentage}%</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={s.status === "eligible" ? "success" : "warning"}>
                        {s.status === "eligible" ? "Normal" : "Condonation Required"}
                      </Badge>
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
