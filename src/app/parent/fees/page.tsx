import React from "react";
import { getSession } from "@/lib/security/session";
import { getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ParentFeesPage() {
  const session = await getSession();
  const parentName = session?.fullName || "Suresh Verma";
  const identifier = session?.identifier || "PARENT_2500040001";
  const studentId = "e0000000-0000-0000-0000-000000000001";

  const store = getDatabase();
  const dues = store.feeDues.get(studentId) || [];
  const transactions = store.feeTransactions.get(studentId) || [];

  return (
    <PortalLayout role="parent" userName={parentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Ward Fee Dues & Receipts</h1>
          <p className="text-xs text-text-muted mt-1">
            Ward: Aditya Verma (Roll: 2500040001) • Payment Status & Official Receipts
          </p>
        </div>

        <Card>
          <CardHeader title="Fee Schedule" subtitle="Semester 6 Academic Year 2024-25 Even" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Fee Head</th>
                  <th className="py-3 px-4 text-center">Amount Due</th>
                  <th className="py-3 px-4 text-center">Amount Paid</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {dues.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-raised/50">
                    <td className="py-3.5 px-4 font-bold text-foreground">{d.title}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold">INR {d.amountDue.toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-emerald-400">INR {d.amountPaid.toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="success">PAID</Badge>
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
