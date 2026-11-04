import React from "react";
import { getSession } from "@/lib/security/session";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";

export default async function AdminFeesPage() {
  const session = await getSession();
  const adminName = session?.fullName || "Polimera Sai Vatsal";
  const identifier = session?.identifier || "2500040224";

  const collections = [
    { head: "Tuition & Academic Fees", target: "₹ 14.8 Cr", collected: "₹ 14.5 Cr", compliance: "98.0%" },
    { head: "Hostel & Dining Infrastructure", target: "₹ 4.2 Cr", collected: "₹ 4.1 Cr", compliance: "97.6%" },
    { head: "Transportation Fleet Passes", target: "₹ 1.6 Cr", collected: "₹ 1.58 Cr", compliance: "98.7%" },
    { head: "Examination & Evaluation Fees", target: "₹ 55 Lakh", collected: "₹ 54.2 Lakh", compliance: "98.5%" },
  ];

  return (
    <PortalLayout role="admin" userName={adminName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Fee Structures & Reconciliation Console</h1>
          <p className="text-xs text-text-muted mt-1">
            Institutional Fee Structures • Payment Gateway Settlement (Razorpay Webhook) • Concession Auditing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((col, idx) => (
            <Card key={idx}>
              <span className="text-xs font-semibold text-text-secondary">{col.head}</span>
              <div className="mt-2 text-xl font-bold font-tabular text-foreground">{col.collected}</div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-text-muted">Target: {col.target}</span>
                <Badge variant="success">{col.compliance}</Badge>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader
            title="Active University Fee Structures (2024-2025 Even Semester)"
            subtitle="Configured per academic program, branch, and residential accommodation tier"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Program & Batch</th>
                  <th className="py-3 px-4 text-center">Semester</th>
                  <th className="py-3 px-4 text-center">Tuition Fee</th>
                  <th className="py-3 px-4 text-center">Special Amenities</th>
                  <th className="py-3 px-4 text-center">Exam Fee</th>
                  <th className="py-3 px-4 text-center">Total Term Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                <tr className="hover:bg-surface-raised/50">
                  <td className="py-3.5 px-4 font-bold text-foreground">B.Tech Computer Science & Engineering (Batch 2022-26)</td>
                  <td className="py-3.5 px-4 text-center font-mono">Sem 6</td>
                  <td className="py-3.5 px-4 text-center font-tabular font-semibold">₹ 1,25,000</td>
                  <td className="py-3.5 px-4 text-center font-tabular">₹ 15,000</td>
                  <td className="py-3.5 px-4 text-center font-tabular">₹ 4,500</td>
                  <td className="py-3.5 px-4 text-center font-tabular font-bold text-azure-400 text-sm">₹ 1,44,500</td>
                </tr>
                <tr className="hover:bg-surface-raised/50">
                  <td className="py-3.5 px-4 font-bold text-foreground">B.Tech Electronics & Communication (Batch 2022-26)</td>
                  <td className="py-3.5 px-4 text-center font-mono">Sem 6</td>
                  <td className="py-3.5 px-4 text-center font-tabular font-semibold">₹ 1,15,000</td>
                  <td className="py-3.5 px-4 text-center font-tabular">₹ 15,000</td>
                  <td className="py-3.5 px-4 text-center font-tabular">₹ 4,500</td>
                  <td className="py-3.5 px-4 text-center font-tabular font-bold text-azure-400 text-sm">₹ 1,34,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
