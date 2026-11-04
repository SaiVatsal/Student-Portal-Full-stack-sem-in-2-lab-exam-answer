import React from "react";
import { getSession } from "@/lib/security/session";
import { getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Download, Clock, MapPin, User } from "lucide-react";

export default async function StudentTimetablePage() {
  const session = await getSession();
  const studentName = session?.fullName || "Aditya Verma";
  const identifier = session?.identifier || "2500040001";

  const store = getDatabase();
  const timetable = store.timetable;

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <PortalLayout role="student" userName={studentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Academic Timetable</h1>
            <p className="text-xs text-text-muted mt-1">
              Section 12 • Room C-402 • 8 Periods Daily Schedule • Synchronized with Academic Calendar
            </p>
          </div>

          <a
            href="/api/export/ics"
            download="timetable.ics"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-subtle hover:bg-surface-raised border border-surface-border text-foreground text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-azure-400" />
            <span>Export to Apple / Google Calendar (.ics)</span>
          </a>
        </div>

        {/* Desktop Weekly Grid Table */}
        <div className="hidden lg:block overflow-x-auto">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-subtle border-b border-surface-border font-mono text-text-secondary">
                <tr>
                  <th className="py-3 px-4 w-28 border-r border-surface-border">Day</th>
                  <th className="py-3 px-4 border-r border-surface-border text-center">Period 1 (09:00 - 09:50)</th>
                  <th className="py-3 px-4 border-r border-surface-border text-center">Period 2 (09:50 - 10:40)</th>
                  <th className="py-3 px-4 border-r border-surface-border text-center">Period 3 (11:00 - 11:50)</th>
                  <th className="py-3 px-4 border-r border-surface-border text-center">Period 4 (11:50 - 12:40)</th>
                  <th className="py-3 px-4 border-r border-surface-border text-center">Period 5 (01:30 - 02:20)</th>
                  <th className="py-3 px-4 text-center">Period 6 (02:20 - 03:10)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {days.map((day) => {
                  const daySlots = timetable.filter((t) => t.dayOfWeek === day);
                  return (
                    <tr key={day} className="hover:bg-surface-raised/30">
                      <td className="py-4 px-4 font-bold font-display text-azure-400 bg-surface-subtle/50 border-r border-surface-border">
                        {day}
                      </td>
                      {[1, 2, 3, 4, 5, 6].map((p) => {
                        const slot = daySlots.find((s) => s.period === p);
                        return (
                          <td
                            key={p}
                            className={`p-2.5 border-r border-surface-border text-center align-top ${
                              slot ? "bg-azure-500/5" : ""
                            }`}
                          >
                            {slot ? (
                              <div className="p-2 rounded-lg bg-surface border border-surface-border/70 text-left">
                                <div className="font-mono font-bold text-azure-400 text-[11px]">
                                  {slot.courseCode}
                                </div>
                                <div className="text-[10px] font-medium text-foreground truncate mt-0.5">
                                  {slot.courseTitle}
                                </div>
                                <div className="text-[9px] text-text-muted mt-1 flex items-center justify-between">
                                  <span>{slot.room}</span>
                                  <span>{slot.facultyName.split(" ")[1]}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-text-muted text-[10px]">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Mobile / Tablet Day List View */}
        <div className="lg:hidden space-y-4">
          {days.slice(0, 5).map((day) => {
            const daySlots = timetable.filter((t) => t.dayOfWeek === day);
            return (
              <Card key={day}>
                <CardHeader title={day} subtitle={`${daySlots.length} Scheduled Periods`} />
                {daySlots.length === 0 ? (
                  <p className="text-xs text-text-muted italic">No classes scheduled.</p>
                ) : (
                  <div className="divide-y divide-surface-border/60">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="py-2.5 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-azure-400 text-xs">
                              {slot.courseCode}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono">
                              Period {slot.period} ({slot.startTime} - {slot.endTime})
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-foreground mt-0.5">
                            {slot.courseTitle}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-text-muted mt-1">
                            <span>Room: {slot.room}</span>
                            <span>{slot.facultyName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
