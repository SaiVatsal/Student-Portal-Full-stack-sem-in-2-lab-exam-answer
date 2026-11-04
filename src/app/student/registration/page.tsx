"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Printer, BookOpen, Layers } from "lucide-react";

interface CourseRow {
  code: string;
  title: string;
  type: "Core" | "Elective";
  structure: string;
  credits: number;
  prerequisites: string;
  selected: boolean;
}

export default function StudentRegistrationPage() {
  const [courses, setCourses] = useState<CourseRow[]>([
    {
      code: "24CS2201",
      title: "Design and Analysis of Algorithms",
      type: "Core",
      structure: "3-1-2-0-4",
      credits: 4,
      prerequisites: "24CS1102 (Cleared)",
      selected: true,
    },
    {
      code: "24CS2202",
      title: "Database Management Systems",
      type: "Core",
      structure: "3-0-2-2-5",
      credits: 5,
      prerequisites: "24CS1101 (Cleared)",
      selected: true,
    },
    {
      code: "24CS2203",
      title: "Operating Systems Principles",
      type: "Core",
      structure: "3-0-2-0-4",
      credits: 4,
      prerequisites: "24CS1203 (Cleared)",
      selected: true,
    },
    {
      code: "24CS2204",
      title: "Full Stack Web Engineering",
      type: "Core",
      structure: "2-0-4-2-5",
      credits: 5,
      prerequisites: "None",
      selected: true,
    },
    {
      code: "24CS3105",
      title: "Cloud Computing & DevOps",
      type: "Elective",
      structure: "3-0-2-0-4",
      credits: 4,
      prerequisites: "24CS2203 (Prerequisite Satisfied)",
      selected: false,
    },
    {
      code: "24CS3108",
      title: "Applied Machine Learning & Neural Networks",
      type: "Elective",
      structure: "3-0-2-0-4",
      credits: 4,
      prerequisites: "Linear Algebra & Python (Satisfied)",
      selected: false,
    },
  ]);

  const [registered, setRegistered] = useState(false);

  const toggleCourse = (code: string) => {
    if (registered) return;
    setCourses((prev) =>
      prev.map((c) => (c.code === code ? { ...c, selected: !c.selected } : c))
    );
  };

  const totalCredits = courses
    .filter((c) => c.selected)
    .reduce((sum, c) => sum + c.credits, 0);

  const maxCredits = 26;
  const minCredits = 16;
  const isCreditValid = totalCredits >= minCredits && totalCredits <= maxCredits;

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <PortalLayout role="student" userName="Aditya Verma" userIdentifier="2500040001">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Semester Course Registration</h1>
            <p className="text-xs text-text-muted mt-1">
              B.Tech CSE • Semester 6 (2024-2025 Even) • Min: {minCredits} Credits, Max: {maxCredits} Credits
            </p>
          </div>

          {registered && (
            <Button variant="secondary" onClick={handlePrintSlip} className="gap-2 text-xs">
              <Printer className="w-4 h-4" /> Print Registration Slip
            </Button>
          )}
        </div>

        {/* Credit Meter Card */}
        <Card className="border-azure-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Total Registered Credits
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-tabular text-foreground">{totalCredits}</span>
                <span className="text-xs text-text-muted">/ {maxCredits} Credits Allowed</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={isCreditValid ? "success" : "danger"}>
                {isCreditValid ? "Credit Limit Compliant" : "Credit Limit Violation"}
              </Badge>

              {!registered ? (
                <Button
                  variant="primary"
                  disabled={!isCreditValid}
                  onClick={() => setRegistered(true)}
                  className="text-xs"
                >
                  Confirm & Submit Registration
                </Button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Formally Registered & Locked
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Offered Courses Table */}
        <Card>
          <CardHeader
            title="Available Academic Curriculum Courses"
            subtitle="Select your elective choices and verify prerequisite clearance"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Select</th>
                  <th className="py-3 px-4">Course Code & Title</th>
                  <th className="py-3 px-4 text-center">Type</th>
                  <th className="py-3 px-4 text-center">Structure (L-T-P-S-C)</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-4">Prerequisite Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {courses.map((c) => (
                  <tr
                    key={c.code}
                    className={`hover:bg-surface-raised/50 transition-colors ${
                      c.selected ? "bg-azure-500/5" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={c.selected}
                        disabled={c.type === "Core" || registered}
                        onChange={() => toggleCourse(c.code)}
                        className="rounded border-surface-border text-azure-500 focus:ring-azure-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground font-mono">{c.code}</div>
                      <div className="text-[11px] text-text-muted">{c.title}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={c.type === "Core" ? "info" : "warning"}>{c.type}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">{c.structure}</td>
                    <td className="py-3 px-4 text-center font-tabular font-bold text-foreground">
                      {c.credits}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">{c.prerequisites}</td>
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
