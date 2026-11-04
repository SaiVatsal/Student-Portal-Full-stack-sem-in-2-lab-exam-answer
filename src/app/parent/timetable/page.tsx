import React from "react";
import { getSession } from "@/lib/security/session";
import { getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";

export default async function ParentTimetablePage() {
  const session = await getSession();
  const parentName = session?.fullName || "Suresh Verma";
  const identifier = session?.identifier || "PARENT_2500040001";

  const store = getDatabase();
  const timetable = store.timetable;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <PortalLayout role="parent" userName={parentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Ward Weekly Timetable</h1>
          <p className="text-xs text-text-muted mt-1">
            Section 12 Schedule • Room C-402 • Academic Year 2024-25 Even
          </p>
        </div>

        <div className="space-y-4">
          {days.map((day) => {
            const daySlots = timetable.filter((t) => t.dayOfWeek === day);
            return (
              <Card key={day}>
                <CardHeader title={day} subtitle={`${daySlots.length} Classes`} />
                <div className="divide-y divide-surface-border/50 text-xs">
                  {daySlots.map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-azure-400">{s.courseCode}</span>
                        <span className="font-semibold text-foreground ml-2">{s.courseTitle}</span>
                        <p className="text-[11px] text-text-muted mt-0.5">Faculty: {s.facultyName} • Room: {s.room}</p>
                      </div>
                      <span className="font-mono font-bold text-foreground">
                        {s.startTime} - {s.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
