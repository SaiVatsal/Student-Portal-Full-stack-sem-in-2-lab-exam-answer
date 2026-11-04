import { NextResponse } from "next/server";
import { getDatabase } from "@/server/db";

export async function GET() {
  const store = getDatabase();
  const timetable = store.timetable;

  // Build standard iCalendar format
  let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Nitro Azard ERP//University Timetable//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";

  const dayOffsets: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
  };

  timetable.forEach((slot, idx) => {
    const startTimeFormatted = slot.startTime.replace(":", "") + "00";
    const endTimeFormatted = slot.endTime.replace(":", "") + "00";

    ics += "BEGIN:VEVENT\r\n";
    ics += `UID:nitro-class-${idx}-${Date.now()}@nitroazard.edu.in\r\n`;
    ics += `SUMMARY:${slot.courseCode} - ${slot.courseTitle}\r\n`;
    ics += `DESCRIPTION:Faculty: ${slot.facultyName}\\nRoom: ${slot.room}\r\n`;
    ics += `LOCATION:${slot.room}\r\n`;
    ics += `RRULE:FREQ=WEEKLY;BYDAY=${slot.dayOfWeek.slice(0, 2).toUpperCase()}\r\n`;
    ics += `DTSTART;TZID=Asia/Kolkata:20250106T${startTimeFormatted}\r\n`;
    ics += `DTEND;TZID=Asia/Kolkata:20250106T${endTimeFormatted}\r\n`;
    ics += "END:VEVENT\r\n";
  });

  ics += "END:VCALENDAR\r\n";

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="timetable.ics"',
    },
  });
}
