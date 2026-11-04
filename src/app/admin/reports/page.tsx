"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileSpreadsheet, ShieldCheck } from "lucide-react";

export default function AdminReportsPage() {
  const downloadReport = (reportName: string) => {
    // Generate CSV content
    const csvContent =
      "Student_ID,Full_Name,Program,Semester,Section,Attendance_Pct,Eligibility_Status,Pending_Dues\n" +
      "2500040001,Aditya Verma,BTECH-CSE,6,Section 12,85.0%,Eligible,0\n" +
      "2500040002,Ananya Sharma,BTECH-CSE,6,Section 12,88.0%,Eligible,50000\n" +
      "2500040003,Rohan Patel,BTECH-CSE,6,Section 12,78.5%,Eligible,0\n" +
      "2500040004,Kavya Nair,BTECH-CSE,6,Section 12,71.0%,Condonation_Needed,0\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportName}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PortalLayout role="admin" userName="Polimera Sai Vatsal" userIdentifier="2500040224">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">University Academic & Financial Reports</h1>
          <p className="text-xs text-text-muted mt-1">
            Generate and export institutional CSV reports for statutory accreditation and auditing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-xl bg-azure-500/10 text-azure-400">
                <FileSpreadsheet className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">Attendance & Hall Ticket Eligibility</h3>
                <p className="text-xs text-text-muted mt-0.5">Section-wise 75% cutoff report</p>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4 leading-relaxed">
              Includes student roll numbers, total conducted periods, attended periods, condonation candidates, and detention lists.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadReport("attendance_eligibility_report")}
              className="w-full mt-4 gap-2 text-xs"
            >
              <Download className="w-4 h-4 text-azure-400" /> Export CSV Report
            </Button>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">Semester Results & SGPA Master</h3>
                <p className="text-xs text-text-muted mt-0.5">Official 10-point grades distribution</p>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4 leading-relaxed">
              Consolidated course-wise marks (In-Sem + End-Sem), relative grades (O, A+, A, B+, B, C, F), and cumulative CGPA.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadReport("semester_results_master")}
              className="w-full mt-4 gap-2 text-xs"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export CSV Report
            </Button>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <FileSpreadsheet className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">Fee Collection & Dues Defaulters</h3>
                <p className="text-xs text-text-muted mt-0.5">Payment gateway reconciliation</p>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4 leading-relaxed">
              Real-time payment logs, cleared transactions, concession waivers, and outstanding dues list per batch.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadReport("fee_collection_reconciliation")}
              className="w-full mt-4 gap-2 text-xs"
            >
              <Download className="w-4 h-4 text-amber-400" /> Export CSV Report
            </Button>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
