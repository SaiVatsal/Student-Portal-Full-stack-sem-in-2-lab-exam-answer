"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface AssignmentItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  submission?: {
    fileName: string;
    submittedAt: string;
    marksAwarded?: number;
    feedback?: string;
  };
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([
    {
      id: "asg-1",
      courseCode: "24CS2201",
      courseTitle: "Design and Analysis of Algorithms",
      title: "Lab Assignment 3: Edmonds-Karp Network Flow Implementation",
      description: "Implement Edmonds-Karp algorithm in C++ with BFS augmenting paths. Include PDF report containing empirical runtime curves against theoretical O(V * E^2).",
      deadline: "2025-03-30 11:59 PM",
      maxMarks: 10,
      submission: {
        fileName: "2500040001_EdmondsKarp_Submission.zip",
        submittedAt: "2025-03-24 06:20 PM",
        marksAwarded: 9.5,
        feedback: "Flawless code architecture and rigorous graph reduction proof.",
      },
    },
    {
      id: "asg-2",
      courseCode: "24CS2202",
      courseTitle: "Database Management Systems",
      title: "Complex SQL Analytics & Index Performance Benchmarking",
      description: "Design relational queries across a 1M row synthetic table, compare query execution plans with B-tree vs Hash indexes.",
      deadline: "2025-04-10 11:59 PM",
      maxMarks: 10,
    },
  ]);

  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const handleFileUpload = (asgId: string) => {
    setUploadingFor(asgId);
    setTimeout(() => {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === asgId
            ? {
                ...a,
                submission: {
                  fileName: "2500040001_Final_Submission.pdf",
                  submittedAt: "Just now",
                },
              }
            : a
        )
      );
      setUploadingFor(null);
      alert("Submission uploaded and magic byte signature validated successfully.");
    }, 800);
  };

  return (
    <PortalLayout role="student" userName="Aditya Verma" userIdentifier="2500040001">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Course Assignments & LMS Submissions</h1>
          <p className="text-xs text-text-muted mt-1">
            Upload verified PDF/ZIP deliverables • Resubmit before deadline • Direct faculty grading feedback
          </p>
        </div>

        <div className="space-y-4">
          {assignments.map((asg) => (
            <Card key={asg.id}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-surface-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-azure-400">{asg.courseCode}</span>
                    <span className="text-xs text-text-muted font-medium">• {asg.courseTitle}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mt-1">{asg.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={asg.submission ? "success" : "warning"}>
                    {asg.submission ? "Submitted" : "Pending Submission"}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-text-muted">
                    Max: {asg.maxMarks} Marks
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-secondary mt-3 leading-relaxed">{asg.description}</p>

              <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                <Clock className="w-4 h-4 text-hot" />
                <span>Submission Deadline: <strong className="text-foreground">{asg.deadline}</strong></span>
              </div>

              {/* Submission State or Upload Area */}
              <div className="mt-4 pt-3 border-t border-surface-border/60">
                {asg.submission ? (
                  <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>{asg.submission.fileName}</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Uploaded on {asg.submission.submittedAt}
                      </p>
                      {asg.submission.feedback && (
                        <div className="mt-2 p-2 rounded bg-surface border border-surface-border/80 text-[11px]">
                          <strong className="text-azure-400">Faculty Evaluation:</strong>{" "}
                          <span className="text-foreground">{asg.submission.feedback}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {asg.submission.marksAwarded !== undefined && (
                        <div className="text-right">
                          <span className="text-[10px] text-text-muted uppercase block">Marks Awarded</span>
                          <span className="text-lg font-bold font-tabular text-emerald-400">
                            {asg.submission.marksAwarded} / {asg.maxMarks}
                          </span>
                        </div>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        isLoading={uploadingFor === asg.id}
                        onClick={() => handleFileUpload(asg.id)}
                        className="text-xs"
                      >
                        Resubmit File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-subtle border border-dashed border-surface-border">
                    <span className="text-xs text-text-muted">
                      Accepted formats: .PDF, .ZIP (Max file size: 25 MB)
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={uploadingFor === asg.id}
                      onClick={() => handleFileUpload(asg.id)}
                      className="gap-1.5 text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Deliverable
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
