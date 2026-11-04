"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Lock, Upload, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AdminGradesPage() {
  const [isProcessed, setIsProcessed] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

  const handleProcessResults = () => {
    setIsProcessed(true);
    alert("Result processing algorithm executed: 60% In-Sem + 40% End-Sem aggregated. 10-point relative grades generated.");
  };

  const handleFreezeResults = () => {
    if (confirm("Are you sure you want to freeze these semester results? Once frozen, no grades can be edited by any faculty or admin without Academic Council override.")) {
      setIsFrozen(true);
      alert("Results frozen and locked in official university transcripts.");
    }
  };

  return (
    <PortalLayout role="admin" userName="Polimera Sai Vatsal" userIdentifier="2500040224">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Examination Grade Processing & Result Freezing</h1>
            <p className="text-xs text-text-muted mt-1">
              End-Semester Theory Aggregation • Relative Grading Normalization • SGPA/CGPA Compilation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleProcessResults}
              className="text-xs gap-1.5"
            >
              <Award className="w-3.5 h-3.5" /> Re-Compute SGPA/CGPA
            </Button>

            {!isFrozen ? (
              <Button
                variant="hot"
                size="sm"
                onClick={handleFreezeResults}
                className="text-xs gap-1.5 font-bold"
              >
                <Lock className="w-3.5 h-3.5" /> Freeze & Publish Results
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Official Results Frozen
              </div>
            )}
          </div>
        </div>

        {/* Processing State Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <Card>
            <span className="text-text-muted uppercase">Processed Candidates</span>
            <div className="text-2xl font-bold font-tabular text-foreground mt-1">1,240 Students</div>
            <p className="text-[11px] text-emerald-400 mt-1">B.Tech Semester 6</p>
          </Card>
          <Card>
            <span className="text-text-muted uppercase">Passing Percentage</span>
            <div className="text-2xl font-bold font-tabular text-emerald-400 mt-1">96.8%</div>
            <p className="text-[11px] text-text-muted mt-1">Threshold: &gt;= 40% Total</p>
          </Card>
          <Card>
            <span className="text-text-muted uppercase">Mean Cohort SGPA</span>
            <div className="text-2xl font-bold font-tabular text-azure-400 mt-1">8.42</div>
            <p className="text-[11px] text-text-muted mt-1">Standard Dev: 0.84</p>
          </Card>
          <Card>
            <span className="text-text-muted uppercase">Revaluation Requests</span>
            <div className="text-2xl font-bold font-tabular text-amber-400 mt-1">14 Pending</div>
            <p className="text-[11px] text-text-muted mt-1">Assigned to second examiners</p>
          </Card>
        </div>

        {/* Grade Distribution Matrix */}
        <Card>
          <CardHeader
            title="10-Point Relative Grading Scale Curve"
            subtitle="Conforming to statutory deemed university accreditation norms"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Qualitative Description</th>
                  <th className="py-3 px-4 text-center">Grade Points</th>
                  <th className="py-3 px-4 text-center">Mark Range (out of 100)</th>
                  <th className="py-3 px-4 text-center">Cohort Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                <tr className="hover:bg-surface-raised/50">
                  <td className="py-3 px-4 font-bold text-emerald-400">O</td>
                  <td className="py-3 px-4 text-foreground">Outstanding (Top 10% exceptional mastery)</td>
                  <td className="py-3 px-4 text-center font-bold">10</td>
                  <td className="py-3 px-4 text-center font-mono">90 - 100</td>
                  <td className="py-3 px-4 text-center font-tabular">12%</td>
                </tr>
                <tr className="hover:bg-surface-raised/50">
                  <td className="py-3 px-4 font-bold text-emerald-400">A+</td>
                  <td className="py-3 px-4 text-foreground">Excellent</td>
                  <td className="py-3 px-4 text-center font-bold">9</td>
                  <td className="py-3 px-4 text-center font-mono">80 - 89</td>
                  <td className="py-3 px-4 text-center font-tabular">28%</td>
                </tr>
                <tr className="hover:bg-surface-raised/50">
                  <td className="py-3 px-4 font-bold text-azure-400">A</td>
                  <td className="py-3 px-4 text-foreground">Very Good</td>
                  <td className="py-3 px-4 text-center font-bold">8</td>
                  <td className="py-3 px-4 text-center font-mono">70 - 79</td>
                  <td className="py-3 px-4 text-center font-tabular">34%</td>
                </tr>
                <tr className="hover:bg-surface-raised/50">
                  <td className="py-3 px-4 font-bold text-azure-400">B+</td>
                  <td className="py-3 px-4 text-foreground">Good</td>
                  <td className="py-3 px-4 text-center font-bold">7</td>
                  <td className="py-3 px-4 text-center font-mono">60 - 69</td>
                  <td className="py-3 px-4 text-center font-tabular">16%</td>
                </tr>
                <tr className="hover:bg-surface-raised/50">
                  <td className="py-3 px-4 font-bold text-amber-400">B</td>
                  <td className="py-3 px-4 text-foreground">Above Average</td>
                  <td className="py-3 px-4 text-center font-bold">6</td>
                  <td className="py-3 px-4 text-center font-mono">50 - 59</td>
                  <td className="py-3 px-4 text-center font-tabular">7%</td>
                </tr>
                <tr className="hover:bg-surface-raised/50">
                  <td className="py-3 px-4 font-bold text-rose-400">F</td>
                  <td className="py-3 px-4 text-foreground">Fail / Arrear (Must reappear)</td>
                  <td className="py-3 px-4 text-center font-bold">0</td>
                  <td className="py-3 px-4 text-center font-mono">&lt; 40</td>
                  <td className="py-3 px-4 text-center font-tabular text-rose-400 font-bold">3.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
