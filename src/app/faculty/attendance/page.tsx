"use client";

import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, ShieldCheck, Clock, Save, CheckCircle2 } from "lucide-react";

interface StudentAttendanceEntry {
  id: string;
  studentId: string;
  name: string;
  status: "present" | "absent" | "on_duty";
}

export default function FacultyAttendancePage() {
  const [topic, setTopic] = useState("Edmonds-Karp Residual Graphs & Augmenting Paths");
  const [period, setPeriod] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSaved, setIsSaved] = useState(false);

  const [students, setStudents] = useState<StudentAttendanceEntry[]>([
    { id: "e0000000-0000-0000-0000-000000000001", studentId: "2500040001", name: "Aditya Verma", status: "present" },
    { id: "e0000000-0000-0000-0000-000000000002", studentId: "2500040002", name: "Ananya Sharma", status: "present" },
    { id: "s-3", studentId: "2500040003", name: "Rohan Patel", status: "present" },
    { id: "s-4", studentId: "2500040004", name: "Kavya Nair", status: "absent" },
    { id: "s-5", studentId: "2500040005", name: "Siddharth Rao", status: "on_duty" },
    { id: "s-6", studentId: "2500040006", name: "Pooja Hegde", status: "present" },
    { id: "s-7", studentId: "2500040007", name: "Varun Reddy", status: "present" },
  ]);

  // Keyboard shortcut listener: P for Present, A for Absent, O for On-Duty
  const setStatus = (index: number, status: "present" | "absent" | "on_duty") => {
    setStudents((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, status } : s))
    );
    setIsSaved(false);
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "present" })));
    setIsSaved(false);
  };

  const handleSaveAttendance = () => {
    setIsSaved(true);
    alert(
      "Attendance session recorded and committed to audit log. 24-hour faculty modification window initiated."
    );
  };

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const odCount = students.filter((s) => s.status === "on_duty").length;

  return (
    <PortalLayout role="faculty" userName="Dr. Rajesh Kumar" userIdentifier="KLU1042">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Record Session Attendance</h1>
            <p className="text-xs text-text-muted mt-1">
              Course: 24CS2201 (Algorithms) • Section 12 • 24-Hour Edit Window Policy • Audit Logged
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={markAllPresent} size="sm" className="text-xs">
              Mark All Present
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveAttendance}
              size="sm"
              className="gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
            >
              <Save className="w-4 h-4" /> Save & Commit Session
            </Button>
          </div>
        </div>

        {/* Session Meta Inputs & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-text-secondary font-medium mb-1">Session Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs"
                />
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">Timetable Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs"
                >
                  <option value={1}>Period 1 (09:00 - 09:50 AM)</option>
                  <option value={2}>Period 2 (09:50 - 10:40 AM)</option>
                  <option value={3}>Period 3 (11:00 - 11:50 AM)</option>
                  <option value={4}>Period 4 (11:50 - 12:40 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">Topic Covered</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs"
                />
              </div>
            </div>
          </Card>

          <Card>
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
              Session Live Tally
            </span>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-emerald-400 font-bold">{presentCount} Present</span>
              <span className="text-rose-400 font-bold">{absentCount} Absent</span>
              <span className="text-purple-400 font-bold">{odCount} On-Duty</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-text-muted">
              <Clock className="w-3.5 h-3.5 text-azure-400" />
              <span>Edit window: 23 hrs 48 mins remaining</span>
            </div>
          </Card>
        </div>

        {/* Attendance Roster Table */}
        <Card>
          <CardHeader
            title="Class Attendance Roll"
            subtitle="Click or use keyboard shortcuts (P: Present, A: Absent, O: On-Duty) to toggle student state"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Current State</th>
                  <th className="py-3 px-4 text-center">Quick Toggle Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {students.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-text-muted">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-azure-400">{s.studentId}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground">{s.name}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={
                          s.status === "present"
                            ? "success"
                            : s.status === "absent"
                            ? "danger"
                            : "info"
                        }
                      >
                        {s.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex rounded-lg border border-surface-border overflow-hidden p-0.5 bg-surface-subtle">
                        <button
                          type="button"
                          onClick={() => setStatus(idx, "present")}
                          className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                            s.status === "present"
                              ? "bg-emerald-500 text-black shadow-xs"
                              : "text-text-muted hover:text-foreground"
                          }`}
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(idx, "absent")}
                          className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                            s.status === "absent"
                              ? "bg-rose-500 text-white shadow-xs"
                              : "text-text-muted hover:text-foreground"
                          }`}
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(idx, "on_duty")}
                          className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                            s.status === "on_duty"
                              ? "bg-purple-500 text-white shadow-xs"
                              : "text-text-muted hover:text-foreground"
                          }`}
                        >
                          OD
                        </button>
                      </div>
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
