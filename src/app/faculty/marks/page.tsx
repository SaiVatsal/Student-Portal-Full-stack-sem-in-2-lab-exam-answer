"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Lock, Unlock, Save, Send } from "lucide-react";

interface StudentMarkEntry {
  id: string;
  studentId: string;
  name: string;
  mid1: number;
  mid2: number;
  assignments: number;
  lab: number;
}

export default function FacultyMarksPage() {
  const [isLocked, setIsLocked] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [marks, setMarks] = useState<StudentMarkEntry[]>([
    { id: "e0000000-0000-0000-0000-000000000001", studentId: "2500040001", name: "Aditya Verma", mid1: 88.5, mid2: 84.0, assignments: 95.0, lab: 92.0 },
    { id: "e0000000-0000-0000-0000-000000000002", studentId: "2500040002", name: "Ananya Sharma", mid1: 91.0, mid2: 88.0, assignments: 98.0, lab: 94.0 },
    { id: "s-3", studentId: "2500040003", name: "Rohan Patel", mid1: 76.0, mid2: 72.5, assignments: 85.0, lab: 80.0 },
    { id: "s-4", studentId: "2500040004", name: "Kavya Nair", mid1: 82.0, mid2: 79.0, assignments: 90.0, lab: 86.0 },
    { id: "s-5", studentId: "2500040005", name: "Siddharth Rao", mid1: 85.0, mid2: 81.5, assignments: 88.0, lab: 85.0 },
  ]);

  const updateMark = (index: number, field: keyof StudentMarkEntry, val: number) => {
    if (isLocked) return;
    setMarks((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, [field]: val } : m))
    );
  };

  const handlePublishMarks = () => {
    if (confirm("Are you sure you want to publish these marks to the student portal? Once published, marks will be locked and cannot be edited without Dean/Admin approval.")) {
      setIsLocked(true);
      setIsPublished(true);
      alert("Marks published and locked. Students can now view their verified In-Sem scores.");
    }
  };

  return (
    <PortalLayout role="faculty" userName="Dr. Rajesh Kumar" userIdentifier="KLU1042">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">In-Sem Marks Entry & Publication</h1>
            <p className="text-xs text-text-muted mt-1">
              Course: 24CS2201 (Algorithms) • Section 12 • 60% In-Sem Total Weight • Continuous Assessments
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isLocked ? (
              <Button
                variant="hot"
                size="sm"
                onClick={handlePublishMarks}
                className="gap-1.5 text-xs font-bold"
              >
                <Send className="w-4 h-4" /> Publish & Lock Marks
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="success">Marks Published</Badge>
                <span className="flex items-center gap-1 text-xs text-text-muted font-mono">
                  <Lock className="w-3.5 h-3.5 text-hot" /> Locked (Requires Admin Unlock)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Component Weightage Formula Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <Card className="text-center">
            <span className="text-text-muted">Mid-1 Exam</span>
            <div className="text-lg font-bold font-tabular text-azure-400 mt-1">20% Weight</div>
            <span className="text-[10px] text-text-muted">Max: 100 Marks</span>
          </Card>
          <Card className="text-center">
            <span className="text-text-muted">Mid-2 Exam</span>
            <div className="text-lg font-bold font-tabular text-azure-400 mt-1">20% Weight</div>
            <span className="text-[10px] text-text-muted">Max: 100 Marks</span>
          </Card>
          <Card className="text-center">
            <span className="text-text-muted">Assignments</span>
            <div className="text-lg font-bold font-tabular text-azure-400 mt-1">10% Weight</div>
            <span className="text-[10px] text-text-muted">Continuous Assessment</span>
          </Card>
          <Card className="text-center">
            <span className="text-text-muted">Lab Execution</span>
            <div className="text-lg font-bold font-tabular text-azure-400 mt-1">10% Weight</div>
            <span className="text-[10px] text-text-muted">Practical Record</span>
          </Card>
        </div>

        {/* Marks Matrix Table */}
        <Card>
          <CardHeader
            title="Continuous In-Sem Mark Roll"
            subtitle="Weighted total calculated automatically: (Mid1*0.2) + (Mid2*0.2) + (Asg*0.1) + (Lab*0.1)"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Mid-1 (100M)</th>
                  <th className="py-3 px-4 text-center">Mid-2 (100M)</th>
                  <th className="py-3 px-4 text-center">Assignments (100M)</th>
                  <th className="py-3 px-4 text-center">Lab / Practical (100M)</th>
                  <th className="py-3 px-4 text-center">Weighted Total (60M)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {marks.map((m, idx) => {
                  const weightedTotal =
                    m.mid1 * 0.2 + m.mid2 * 0.2 + m.assignments * 0.1 + m.lab * 0.1;

                  return (
                    <tr key={m.id} className="hover:bg-surface-raised/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-azure-400">{m.studentId}</td>
                      <td className="py-3 px-4 font-bold text-foreground">{m.name}</td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          disabled={isLocked}
                          value={m.mid1}
                          onChange={(e) => updateMark(idx, "mid1", Number(e.target.value))}
                          className="w-16 h-8 text-center bg-surface-subtle border border-surface-border rounded text-xs font-mono font-bold text-foreground disabled:opacity-80"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          disabled={isLocked}
                          value={m.mid2}
                          onChange={(e) => updateMark(idx, "mid2", Number(e.target.value))}
                          className="w-16 h-8 text-center bg-surface-subtle border border-surface-border rounded text-xs font-mono font-bold text-foreground disabled:opacity-80"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          disabled={isLocked}
                          value={m.assignments}
                          onChange={(e) => updateMark(idx, "assignments", Number(e.target.value))}
                          className="w-16 h-8 text-center bg-surface-subtle border border-surface-border rounded text-xs font-mono font-bold text-foreground disabled:opacity-80"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          disabled={isLocked}
                          value={m.lab}
                          onChange={(e) => updateMark(idx, "lab", Number(e.target.value))}
                          className="w-16 h-8 text-center bg-surface-subtle border border-surface-border rounded text-xs font-mono font-bold text-foreground disabled:opacity-80"
                        />
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400 text-sm">
                        {weightedTotal.toFixed(1)} / 60.0
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
