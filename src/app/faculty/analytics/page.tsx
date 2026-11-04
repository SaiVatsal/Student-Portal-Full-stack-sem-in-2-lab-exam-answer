import React from "react";
import { getSession } from "@/lib/security/session";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Layers, Award } from "lucide-react";

export default async function FacultyAnalyticsPage() {
  const session = await getSession();
  const facultyName = session?.fullName || "Dr. Rajesh Kumar";
  const identifier = session?.identifier || "KLU1042";

  const coAttainments = [
    {
      code: "CO1",
      desc: "Analyze asymptotic complexity of iterative and recursive algorithms",
      target: 70,
      attained: 78.4,
      level: 3,
      status: "Exceeded Target",
    },
    {
      code: "CO2",
      desc: "Design optimal divide-and-conquer and dynamic programming solutions",
      target: 70,
      attained: 74.2,
      level: 3,
      status: "Target Attained",
    },
    {
      code: "CO3",
      desc: "Implement advanced graph algorithms for network flow and traversal",
      target: 70,
      attained: 71.8,
      level: 2,
      status: "Target Attained",
    },
    {
      code: "CO4",
      desc: "Classify intractable computational problems into P and NP classes",
      target: 70,
      attained: 66.5,
      level: 2,
      status: "Action Plan Needed (<70%)",
    },
  ];

  return (
    <PortalLayout role="faculty" userName={facultyName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Course Outcome (CO) Attainment Report</h1>
          <p className="text-xs text-text-muted mt-1">
            NBA / NAAC Quality Accreditation Metrics • Direct Assessment Mapping across Mid-1, Mid-2, Lab and End-Sem
          </p>
        </div>

        {/* CO Attainment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coAttainments.map((co) => (
            <Card key={co.code}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-azure-400">{co.code}</span>
                <Badge variant={co.attained >= co.target ? "success" : "warning"}>
                  Level {co.level} Attainment
                </Badge>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-tabular text-foreground">{co.attained}%</span>
                <span className="text-xs text-text-muted">Target: {co.target}%</span>
              </div>
              <p className="text-[11px] text-text-muted mt-2 line-clamp-2">{co.desc}</p>
            </Card>
          ))}
        </div>

        {/* Attainment Calculation Matrix */}
        <Card>
          <CardHeader
            title="Outcome Assessment Detailed Matrix"
            subtitle="Course: 24CS2201 (Design & Analysis of Algorithms) • Section 12"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">CO Code</th>
                  <th className="py-3 px-4">Statement & Bloom Level</th>
                  <th className="py-3 px-4 text-center">In-Sem Attainment (60%)</th>
                  <th className="py-3 px-4 text-center">End-Sem Attainment (40%)</th>
                  <th className="py-3 px-4 text-center">Overall Attainment</th>
                  <th className="py-3 px-4 text-center">Accreditation Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {coAttainments.map((c) => (
                  <tr key={c.code} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-azure-400">{c.code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{c.desc}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-medium text-text-secondary">
                      {(c.attained * 0.98).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-medium text-text-secondary">
                      {(c.attained * 1.02).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-sm text-emerald-400">
                      {c.attained}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={c.attained >= c.target ? "success" : "warning"}>
                        {c.status}
                      </Badge>
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
