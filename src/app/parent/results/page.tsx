import React from "react";
import { getSession } from "@/lib/security/session";
import { AcademicService } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ParentResultsPage() {
  const session = await getSession();
  const parentName = session?.fullName || "Suresh Verma";
  const identifier = session?.identifier || "PARENT_2500040001";
  const studentId = "e0000000-0000-0000-0000-000000000001";

  const transcript = await AcademicService.getStudentTranscript(studentId);

  return (
    <PortalLayout role="parent" userName={parentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Ward Academic Results: Aditya Verma</h1>
          <p className="text-xs text-text-muted mt-1">
            Official 10-Point Grading Transcript • SGPA: {transcript.sgpa} • CGPA: {transcript.cgpa}
          </p>
        </div>

        <Card>
          <CardHeader title="Semester 5 Official Grade Sheet" subtitle="Controller of Examinations" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-4 text-center">In-Sem Score</th>
                  <th className="py-3 px-4 text-center">End-Sem Score</th>
                  <th className="py-3 px-4 text-center">Total (100M)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {transcript.results.map((r) => (
                  <tr key={r.courseId} className="hover:bg-surface-raised/50">
                    <td className="py-3.5 px-4 font-bold font-mono text-foreground">{r.courseCode}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold">{r.credits}</td>
                    <td className="py-3.5 px-4 text-center font-tabular">{r.inSemScore}</td>
                    <td className="py-3.5 px-4 text-center font-tabular">{r.endSemScore}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-foreground">{r.totalScore}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={r.grade === "O" || r.grade === "A+" ? "success" : "info"}>{r.grade}</Badge>
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
