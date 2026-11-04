"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, AlertTriangle, CheckCircle2, ShieldCheck, Plus } from "lucide-react";

export default function AdminTimetablePage() {
  const [clashFound, setClashFound] = useState(false);

  const testClashEngine = () => {
    setClashFound(true);
  };

  return (
    <PortalLayout role="admin" userName="Polimera Sai Vatsal" userIdentifier="2500040224">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Timetable Builder & Clash Engine</h1>
            <p className="text-xs text-text-muted mt-1">
              Classroom Resource Allocation • Faculty Double-Booking Prevention • Exam Seating Optimizer
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={testClashEngine}
            className="text-xs gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Run Automated Clash Test
          </Button>
        </div>

        {clashFound ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-300">Classroom Clash Detected</h4>
              <p className="text-xs text-text-muted mt-0.5">
                Room <strong>C-Block 402</strong> has a concurrent booking request on <strong>Monday Period 2</strong>:
                24CS2202 (Section 12) vs 24EC2104 (Section 8). Shift section to C-Block 404 to resolve.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-300">All Schedules Validated: Zero Clashes</span>
              <p className="text-text-muted mt-0.5">Checked 120 sections across 4 academic blocks. Faculty hours compliant with UGC norms.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Classroom Capacity Matrix"
              subtitle="C-Block Infrastructure Allocations"
            />
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-subtle flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground">Room C-Block 402</span>
                  <span className="text-[11px] text-text-muted block">Capacity: 70 Seats • Smart Projector</span>
                </div>
                <Badge variant="success">Allotted (Sec 12)</Badge>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground">Room C-Block 404</span>
                  <span className="text-[11px] text-text-muted block">Capacity: 70 Seats • Smart Projector</span>
                </div>
                <Badge variant="neutral">Available</Badge>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground">Computer Lab C-302</span>
                  <span className="text-[11px] text-text-muted block">Capacity: 65 High-End Terminals</span>
                </div>
                <Badge variant="success">Allotted (Web Lab)</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="End-Sem Exam Hall Seating Optimization"
              subtitle="Arranged in alternating rolls to enforce exam integrity"
            />
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-subtle flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground">Main Examination Hall (Desk 1 - 65)</span>
                  <span className="text-[11px] text-text-muted block">CSE 24CS2201 interleaved with ECE 24EC2201</span>
                </div>
                <Badge variant="info">Seating Frozen</Badge>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground">Computer Center Lab 1 (Terminal 1 - 65)</span>
                  <span className="text-[11px] text-text-muted block">Lab Practical Exam Session</span>
                </div>
                <Badge variant="info">Seating Frozen</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
