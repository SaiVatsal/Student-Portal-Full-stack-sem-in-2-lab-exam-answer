import React from "react";
import { getSession } from "@/lib/security/session";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, User, Award, CheckCircle2 } from "lucide-react";

export default async function FacultyStudentsPage() {
  const session = await getSession();
  const facultyName = session?.fullName || "Dr. Rajesh Kumar";
  const identifier = session?.identifier || "KLU1042";

  const students = [
    {
      id: "e0000000-0000-0000-0000-000000000001",
      studentId: "2500040001",
      name: "Aditya Verma",
      email: "aditya.verma@student.nitroazard.edu.in",
      attendance: 85.0,
      inSemTotal: 53.2,
      cgpa: 8.84,
      status: "Eligible",
    },
    {
      id: "e0000000-0000-0000-0000-000000000002",
      studentId: "2500040002",
      name: "Ananya Sharma",
      email: "ananya.sharma@student.nitroazard.edu.in",
      attendance: 88.0,
      inSemTotal: 55.4,
      cgpa: 9.15,
      status: "Eligible",
    },
    {
      id: "s-3",
      studentId: "2500040003",
      name: "Rohan Patel",
      email: "rohan.patel@student.nitroazard.edu.in",
      attendance: 78.5,
      inSemTotal: 46.5,
      cgpa: 7.92,
      status: "Eligible",
    },
    {
      id: "s-4",
      studentId: "2500040004",
      name: "Kavya Nair",
      email: "kavya.nair@student.nitroazard.edu.in",
      attendance: 71.0,
      inSemTotal: 49.0,
      cgpa: 8.30,
      status: "Condonation Needed",
    },
  ];

  return (
    <PortalLayout role="faculty" userName={facultyName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Section Student Roster & Academic Records</h1>
          <p className="text-xs text-text-muted mt-1">
            Section 12 • Direct inspection of individual attendance logs, In-Sem assessments, and End-Sem results
          </p>
        </div>

        <Card>
          <CardHeader
            title="Enrolled Section 12 Candidates"
            subtitle="View student performance profiles and check hall ticket qualification status"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Student Name & Email</th>
                  <th className="py-3 px-4 text-center">Section Attendance</th>
                  <th className="py-3 px-4 text-center">In-Sem Score (60M)</th>
                  <th className="py-3 px-4 text-center">CGPA</th>
                  <th className="py-3 px-4 text-center">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-azure-400">{st.studentId}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{st.name}</div>
                      <div className="text-[11px] text-text-muted font-mono">{st.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-emerald-400">
                      {st.attendance}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-foreground">
                      {st.inSemTotal}
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-azure-400">
                      {st.cgpa}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={st.status === "Eligible" ? "success" : "warning"}>
                        {st.status}
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
