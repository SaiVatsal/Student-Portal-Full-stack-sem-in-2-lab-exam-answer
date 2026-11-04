import React from "react";
import { getSession } from "@/lib/security/session";
import { AcademicService, getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";

export default async function StudentResultsPage() {
  const session = await getSession();
  const studentId = session?.userId || "e0000000-0000-0000-0000-000000000001";
  const studentName = session?.fullName || "Aditya Verma";
  const identifier = session?.identifier || "2500040001";

  const transcript = await AcademicService.getStudentTranscript(studentId);
  const store = getDatabase();
  const inSemAssessments = store.assessments.get("o0000000-0000-0000-0000-000000000001") || [];

  // Historical SGPA progression
  const sgpaHistory = [
    { sem: "Sem 1", sgpa: 8.62 },
    { sem: "Sem 2", sgpa: 8.75 },
    { sem: "Sem 3", sgpa: 8.90 },
    { sem: "Sem 4", sgpa: 8.81 },
    { sem: "Sem 5", sgpa: transcript.sgpa },
  ];

  return (
    <PortalLayout role="student" userName={studentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Academic Results & Grade Sheet</h1>
            <p className="text-xs text-text-muted mt-1">
              Deemed University Grading System (10-Point Relative Scale) • Calculated Server-Side
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-surface-subtle hover:bg-surface-raised border border-surface-border text-foreground text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-azure-400" />
              <span>Download Official Grade Sheet (PDF)</span>
            </button>
          </div>
        </div>

        {/* CGPA & SGPA Snapshot Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-azure-500/30">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Cumulative CGPA
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-tabular text-foreground">{transcript.cgpa}</span>
              <span className="text-xs text-emerald-400 font-semibold">First Class with Distinction</span>
            </div>
            <p className="text-[11px] text-text-muted mt-2">Cumulative over 5 semesters</p>
          </Card>

          <Card>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Latest Semester SGPA
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-tabular text-azure-400">{transcript.sgpa}</span>
              <span className="text-xs text-text-muted">Sem 5</span>
            </div>
            <p className="text-[11px] text-text-muted mt-2">Total Credits Earned: {transcript.earnedCredits}</p>
          </Card>

          <Card>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Credits Passed
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-tabular text-foreground">108</span>
              <span className="text-xs text-text-muted">/ 160 Required</span>
            </div>
            <p className="text-[11px] text-text-muted mt-2">Degree completion: 67.5%</p>
          </Card>

          <Card>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Standing Arrears / Backlogs
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-tabular text-emerald-400">0</span>
              <Badge variant="success">All Cleared</Badge>
            </div>
            <p className="text-[11px] text-text-muted mt-2">No active backlogs recorded</p>
          </Card>
        </div>

        {/* SGPA Historical Trend */}
        <Card>
          <CardHeader
            title="Semester-Wise SGPA Progression Trend"
            subtitle="Demonstrates academic consistency across program progression"
          />
          <div className="grid grid-cols-5 gap-3 pt-2">
            {sgpaHistory.map((h, i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-center">
                <span className="text-[10px] font-mono text-text-muted uppercase block">{h.sem}</span>
                <span className="text-lg font-bold font-tabular text-azure-400 block mt-1">{h.sgpa}</span>
                <div className="w-full bg-surface-raised h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-azure-500 rounded-full"
                    style={{ width: `${(h.sgpa / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Current Semester In-Sem Assessment Component Breakdown */}
        <Card>
          <CardHeader
            title="Current Semester 6 In-Sem Continuous Assessment Breakdown"
            subtitle="24CS2201 Design & Analysis of Algorithms • Mid-1, Mid-2, Assignments, and Lab"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Assessment Component</th>
                  <th className="py-3 px-4 text-center">Category</th>
                  <th className="py-3 px-4 text-center">Weightage</th>
                  <th className="py-3 px-4 text-center">Max Marks</th>
                  <th className="py-3 px-4 text-center">Marks Obtained</th>
                  <th className="py-3 px-4">CO Mapping</th>
                  <th className="py-3 px-4">Faculty Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {inSemAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{a.title}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="info">{a.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-medium">{a.weightage}%</td>
                    <td className="py-3.5 px-4 text-center font-tabular">{a.maxMarks}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-emerald-400 text-sm">
                      {a.marksObtained}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1">
                        {a.coMapped.map((co) => (
                          <span key={co} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border text-azure-400">
                            {co}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">{a.feedback || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Previous Semester Official Grade Sheet */}
        <Card>
          <CardHeader
            title="Semester 5 Official Grade Sheet"
            subtitle="Academic Year 2024-2025 Odd Semester • Published by Controller of Examinations"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-4 text-center">In-Sem (60M)</th>
                  <th className="py-3 px-4 text-center">End-Sem (40M)</th>
                  <th className="py-3 px-4 text-center">Total (100M)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Grade Points</th>
                  <th className="py-3 px-4 text-center">Revaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {transcript.results.map((r) => (
                  <tr key={r.courseId} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground font-mono">{r.courseCode}</div>
                      <div className="text-[11px] text-text-muted">{r.courseTitle}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold text-foreground">
                      {r.credits}
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-medium text-text-secondary">
                      {r.inSemScore}
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-medium text-text-secondary">
                      {r.endSemScore}
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-sm text-foreground">
                      {r.totalScore}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={r.grade === "O" || r.grade === "A+" ? "success" : "info"}>
                        {r.grade}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-foreground">
                      {r.gradePoints}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => alert(`Revaluation requested for ${r.courseCode}. Form dispatched to Exam Cell.`)}
                        className="text-[11px] text-azure-400 hover:text-azure-300 font-semibold underline underline-offset-2"
                      >
                        Apply Revaluation
                      </button>
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
