"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck2, Check, X, Clock, AlertCircle } from "lucide-react";

interface MenteeRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  reason: string;
  dates: string;
  status: "pending" | "approved" | "rejected";
}

export default function FacultyRequestsPage() {
  const [requests, setRequests] = useState<MenteeRequest[]>([
    {
      id: "req-101",
      studentId: "2500040001",
      studentName: "Aditya Verma",
      type: "On-Duty Application (OD)",
      reason: "Smart India Hackathon 2025 Grand Finale representation at IIT Kharagpur.",
      dates: "2025-02-18 to 2025-02-22",
      status: "approved",
    },
    {
      id: "req-102",
      studentId: "2500040003",
      studentName: "Rohan Patel",
      type: "Medical Leave Application",
      reason: "Viral fever with medical prescription attached.",
      dates: "2025-03-12 to 2025-03-15",
      status: "pending",
    },
  ]);

  const handleAction = (id: string, status: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    alert(`Request ${status === "approved" ? "recommended and forwarded to Dean Academics" : "rejected"}.`);
  };

  return (
    <PortalLayout role="faculty" userName="Dr. Rajesh Kumar" userIdentifier="KLU1042">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Mentee Requests & Leave Approvals</h1>
          <p className="text-xs text-text-muted mt-1">
            Faculty Mentor Endorsement Desk • On-Duty Attendance Credits & Medical Leaves
          </p>
        </div>

        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-surface-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-azure-400">{r.studentId}</span>
                    <span className="text-xs font-semibold text-foreground">• {r.studentName}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mt-1">{r.type}</h3>
                  <span className="text-[11px] text-text-muted font-mono">Duration: {r.dates}</span>
                </div>

                <Badge
                  variant={
                    r.status === "approved"
                      ? "success"
                      : r.status === "rejected"
                      ? "danger"
                      : "warning"
                  }
                >
                  {r.status === "approved"
                    ? "Mentor Recommended"
                    : r.status === "rejected"
                    ? "Rejected"
                    : "Pending Recommendation"}
                </Badge>
              </div>

              <div className="mt-3 text-xs">
                <span className="text-text-muted">Student Statement:</span>
                <p className="text-foreground mt-0.5">{r.reason}</p>
              </div>

              {r.status === "pending" && (
                <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-end gap-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleAction(r.id, "rejected")}
                    className="gap-1.5 text-xs"
                  >
                    <X className="w-3.5 h-3.5" /> Reject Request
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAction(r.id, "approved")}
                    className="gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
                  >
                    <Check className="w-3.5 h-3.5" /> Endorse & Recommend to Dean
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
