"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { FileCheck2, Clock, CheckCircle2, XCircle, Plus } from "lucide-react";

interface RequestItem {
  id: string;
  type: string;
  reason: string;
  startDate?: string;
  endDate?: string;
  status: "pending" | "approved_by_faculty" | "approved_by_admin" | "rejected";
  facultyRemarks?: string;
  adminRemarks?: string;
  createdAt: string;
}

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: "req-1",
      type: "On-Duty Application (OD)",
      reason: "Smart India Hackathon 2025 Grand Finale representation at IIT Kharagpur.",
      startDate: "2025-02-18",
      endDate: "2025-02-22",
      status: "approved_by_admin",
      facultyRemarks: "Recommended. Certified finalist participant.",
      adminRemarks: "Sanctioned On-Duty attendance credit granted.",
      createdAt: "2025-02-10",
    },
    {
      id: "req-2",
      type: "Bonafide Certificate",
      reason: "Application for passport renewal and educational bank loan certification.",
      status: "approved_by_admin",
      facultyRemarks: "Verified current bonafide 6th semester enrollment.",
      adminRemarks: "Signed certificate issued to student email.",
      createdAt: "2025-03-01",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState("bonafide");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabels: Record<string, string> = {
      bonafide: "Bonafide Certificate",
      transcript: "Official Transcript",
      noc: "No Objection Certificate (NOC)",
      leave: "Medical Leave Application",
      on_duty: "On-Duty Application (OD)",
    };

    const newReq: RequestItem = {
      id: `req-${Date.now()}`,
      type: typeLabels[requestType] || "General Request",
      reason,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    setReason("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <PortalLayout role="student" userName="Aditya Verma" userIdentifier="2500040001">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Student Academic Requests & NOC</h1>
            <p className="text-xs text-text-muted mt-1">
              Apply for Bonafide, Transcripts, NOC, Medical Leave, and On-Duty Attendance Sanctions
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="gap-2 text-xs">
            <Plus className="w-4 h-4" /> New Academic Request
          </Button>
        </div>

        {/* Requests List with Approval Trail */}
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
                <div>
                  <span className="font-mono text-[10px] text-azure-400 uppercase font-bold block">
                    ID: {req.id} • Submitted on {req.createdAt}
                  </span>
                  <h3 className="text-sm font-bold text-foreground mt-0.5">{req.type}</h3>
                </div>

                <Badge
                  variant={
                    req.status === "approved_by_admin"
                      ? "success"
                      : req.status === "rejected"
                      ? "danger"
                      : "warning"
                  }
                >
                  {req.status === "approved_by_admin"
                    ? "Sanctioned & Approved"
                    : req.status === "approved_by_faculty"
                    ? "Pending Admin Approval"
                    : req.status === "rejected"
                    ? "Rejected"
                    : "Under Faculty Mentor Review"}
                </Badge>
              </div>

              <div className="mt-3 text-xs">
                <span className="text-text-muted">Purpose / Justification:</span>
                <p className="text-foreground font-medium mt-0.5">{req.reason}</p>
                {req.startDate && (
                  <p className="text-text-muted mt-1 font-mono">
                    Duration: {req.startDate} to {req.endDate}
                  </p>
                )}
              </div>

              {/* Approval Timeline Trail */}
              <div className="mt-4 pt-3 border-t border-surface-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-subtle">
                  <span className="text-text-muted block text-[11px]">Faculty Mentor Review:</span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {req.facultyRemarks || "Awaiting mentor sign-off"}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-subtle">
                  <span className="text-text-muted block text-[11px]">Dean Academics / HoD Decision:</span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {req.adminRemarks || "Pending administrative clearance"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal for New Request */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Submit New Academic Request"
          description="Your request will be routed to your assigned faculty mentor and Dean Academics."
        >
          <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
            <div>
              <label className="block text-text-secondary font-medium mb-1">Request Type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full h-10 px-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs focus:outline-none focus:border-azure-500"
              >
                <option value="bonafide">Bonafide Certificate</option>
                <option value="transcript">Official Academic Transcript</option>
                <option value="noc">No Objection Certificate (Internship / Contest)</option>
                <option value="leave">Medical Leave Application</option>
                <option value="on_duty">On-Duty Attendance Sanction (OD)</option>
              </select>
            </div>

            {(requestType === "leave" || requestType === "on_duty") && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-text-secondary font-medium mb-1">Detailed Reason & Supporting Information</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State your justification clearly..."
                className="w-full p-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs focus:outline-none focus:border-azure-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Request
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PortalLayout>
  );
}
