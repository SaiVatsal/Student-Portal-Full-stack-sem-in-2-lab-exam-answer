"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Download, AlertCircle, ShieldCheck } from "lucide-react";

export default function StudentFeesPage() {
  const [dues, setDues] = useState([
    {
      id: "fd-1",
      title: "Semester 6 Academic Tuition & Special Amenities Fee",
      amountDue: 140000,
      amountPaid: 140000,
      dueDate: "2025-01-10",
      status: "paid",
    },
    {
      id: "fd-2",
      title: "Semester 6 Hostel & Mess Fee (Kapil Dev Block A)",
      amountDue: 46500,
      amountPaid: 46500,
      dueDate: "2025-01-10",
      status: "paid",
    },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: "tx-1",
      receiptNumber: "NA-RCP-2025-08149",
      date: "2025-01-08",
      amount: 186500,
      paymentMethod: "Razorpay NetBanking / HDFC",
      status: "success",
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  const totalDue = dues.reduce((sum, d) => sum + d.amountDue, 0);
  const totalPaid = dues.reduce((sum, d) => sum + d.amountPaid, 0);
  const pendingAmount = totalDue - totalPaid;

  const handlePayNow = () => {
    setIsProcessing(true);
    // Simulate Razorpay checkout in test mode
    setTimeout(() => {
      alert("Razorpay Test Mode: Payment simulated successfully. Webhook signature verified.");
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <PortalLayout role="student" userName="Aditya Verma" userIdentifier="2500040001">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Fee Management & Payment Receipts</h1>
          <p className="text-xs text-text-muted mt-1">
            Tuition, Hostel, Transport & Examination Dues • Official GST Compliant E-Receipts
          </p>
        </div>

        {/* Financial Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Semester Fees
            </span>
            <div className="mt-2 text-2xl font-bold font-tabular text-foreground">
              INR {totalDue.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-text-muted mt-2">Academic Year 2024-25 Even</p>
          </Card>

          <Card>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Amount Paid
            </span>
            <div className="mt-2 text-2xl font-bold font-tabular text-emerald-400">
              INR {totalPaid.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-text-muted mt-2">100% Cleared via Razorpay</p>
          </Card>

          <Card className={pendingAmount === 0 ? "border-emerald-500/30" : "border-rose-500/30"}>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Outstanding Dues
            </span>
            <div className="mt-2 text-2xl font-bold font-tabular text-foreground">
              INR {pendingAmount.toLocaleString("en-IN")}
            </div>
            <div className="mt-2">
              <Badge variant={pendingAmount === 0 ? "success" : "danger"}>
                {pendingAmount === 0 ? "Zero Dues • Hall Ticket Unblocked" : "Dues Pending"}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Detailed Dues List */}
        <Card>
          <CardHeader
            title="Semester Fee Structure & Current Dues"
            subtitle="Verified against University Finance Office records"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Fee Head & Component</th>
                  <th className="py-3 px-4 text-center">Due Date</th>
                  <th className="py-3 px-4 text-center">Amount Due</th>
                  <th className="py-3 px-4 text-center">Amount Paid</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {dues.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{d.title}</td>
                    <td className="py-3.5 px-4 text-center font-mono">{d.dueDate}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold text-foreground">
                      INR {d.amountDue.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold text-emerald-400">
                      INR {d.amountPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={d.status === "paid" ? "success" : "warning"}>
                        {d.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {d.status !== "paid" ? (
                        <Button
                          variant="hot"
                          size="sm"
                          isLoading={isProcessing}
                          onClick={handlePayNow}
                          className="text-xs"
                        >
                          Pay Dues
                        </Button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Transaction History & Receipt PDF Downloads */}
        <Card>
          <CardHeader
            title="Payment History & E-Receipt Downloads"
            subtitle="Secure digital receipts with unique cryptographic receipt numbers"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Receipt Number</th>
                  <th className="py-3 px-4 text-center">Payment Date</th>
                  <th className="py-3 px-4 text-center">Amount Paid</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Official Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-azure-400">
                      {tx.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{tx.date}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-emerald-400">
                      INR {tx.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">{tx.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="success">SUCCESS</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <a
                        href={`/api/export/receipt?receiptId=${tx.receiptNumber}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-azure-500/10 hover:bg-azure-500/20 text-azure-400 font-semibold rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
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
