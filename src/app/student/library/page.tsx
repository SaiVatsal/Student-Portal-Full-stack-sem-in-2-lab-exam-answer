import React from "react";
import { getSession } from "@/lib/security/session";
import { getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Library, BookOpen, Clock, Search, MapPin } from "lucide-react";

export default async function StudentLibraryPage() {
  const session = await getSession();
  const studentId = session?.userId || "e0000000-0000-0000-0000-000000000001";
  const studentName = session?.fullName || "Aditya Verma";
  const identifier = session?.identifier || "2500040001";

  const store = getDatabase();
  const books = store.libraryBooks;
  const borrowings = store.libraryBorrowings.get(studentId) || [];

  return (
    <PortalLayout role="student" userName={studentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Central University Library</h1>
          <p className="text-xs text-text-muted mt-1">
            Automated RFID Catalog, Borrowing History, Fine Auditing & Book Reservation
          </p>
        </div>

        {/* Active Issued Books */}
        <Card>
          <CardHeader
            title="Currently Issued Books & Return Deadlines"
            subtitle="Standard borrowing allowance: 3 books for 15 days • Overdue fine: INR 5/day"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Book Title & ISBN</th>
                  <th className="py-3 px-4 text-center">Issue Date</th>
                  <th className="py-3 px-4 text-center">Due Return Date</th>
                  <th className="py-3 px-4 text-center">Outstanding Fine</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {borrowings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{b.bookTitle}</div>
                      <div className="text-[11px] font-mono text-text-muted">{b.isbn}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{b.issuedAt}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-azure-400">
                      {b.dueDate}
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold text-emerald-400">
                      INR {b.fineAmount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="success">ISSUED</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Central Library Catalogue Search */}
        <Card>
          <CardHeader
            title="Library Catalogue & Stack Availability"
            subtitle="Search across 45,000+ volumes, engineering journals, and reference works"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-y border-surface-border text-text-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Book Title & Author</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stack & Shelf Location</th>
                  <th className="py-3 px-4 text-center">Available / Total</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {books.map((bk) => (
                  <tr key={bk.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{bk.title}</div>
                      <div className="text-[11px] text-text-muted">Author: {bk.author}</div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">{bk.category}</td>
                    <td className="py-3.5 px-4 font-mono text-azure-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{bk.shelfLocation}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-tabular font-bold text-emerald-400">
                      {bk.availableCopies} / {bk.totalCopies}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => alert(`Reserved copy of "${bk.title}". Collect from Circulation Desk.`)}
                        className="px-3 py-1 bg-surface-raised hover:bg-surface-subtle border border-surface-border rounded text-[11px] font-semibold text-foreground transition-colors"
                      >
                        Reserve Copy
                      </button>
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
