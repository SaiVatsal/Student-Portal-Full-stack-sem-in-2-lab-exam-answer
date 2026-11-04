import { NextResponse } from "next/server";
import { AcademicService, getDatabase } from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId") || "e0000000-0000-0000-0000-000000000001";

  const gate = await AcademicService.checkHallTicketEligibility(studentId);

  if (!gate.eligible) {
    return new NextResponse(
      `<html><body style="font-family: sans-serif; padding: 40px; background: #0B1220; color: #fff;">
        <h2 style="color: #EF4444;">Hall Ticket Issuance Blocked</h2>
        <p>Your admit card cannot be released due to unfulfilled statutory criteria:</p>
        <ul>${gate.reasons.map((r) => `<li>${r}</li>`).join("")}</ul>
      </body></html>`,
      {
        status: 403,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  const store = getDatabase();
  const schedules = store.examSchedules;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>End-Semester Theory Examination Hall Ticket</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #000; margin: 40px; background: #fff; line-height: 1.4; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .header p { margin: 3px 0 0; font-size: 13px; color: #333; }
    .title { text-align: center; font-weight: bold; font-size: 14px; text-transform: uppercase; margin: 15px 0; background: #f0f0f0; padding: 6px; }
    .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; border: 1px solid #ccc; padding: 12px; border-radius: 4px; }
    .info-col { font-size: 12px; }
    .info-col p { margin: 4px 0; }
    .photo-box { width: 100px; height: 120px; border: 1px solid #000; display: flex; align-items: center; justify-content: center; font-size: 10px; text-align: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
    th, td { border: 1px solid #000; padding: 8px 10px; text-align: left; }
    th { background: #f4f4f4; text-transform: uppercase; font-size: 11px; }
    .instructions { margin-top: 30px; font-size: 10px; color: #444; border-top: 1px dashed #888; padding-top: 10px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 50px; font-size: 11px; font-weight: bold; }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #2F7BFF; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
      Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <h1>Nitro Azard University</h1>
    <p>Central Examination Cell • End-Semester Theory Examinations (2024-2025 Even Semester)</p>
  </div>

  <div class="title">Official Examination Hall Ticket (Admit Card)</div>

  <div class="student-info">
    <div class="info-col">
      <p><strong>Student Name:</strong> Aditya Verma</p>
      <p><strong>Registration Number:</strong> 2500040001</p>
      <p><strong>Program / Degree:</strong> B.Tech Computer Science & Engineering</p>
      <p><strong>Academic Semester:</strong> Semester 6 (Section 12)</p>
    </div>
    <div class="info-col">
      <p><strong>Attendance Percentage:</strong> 84.8% (Verified Eligible)</p>
      <p><strong>Fee Clearance Status:</strong> 100% Cleared (Zero Dues)</p>
      <p><strong>Examination Center:</strong> Main Academic Campus, Vijayawada</p>
      <p><strong>Allotted Desk:</strong> C-Block Desk #42</p>
    </div>
    <div class="photo-box">
      OFFICIAL DIGITALLY VERIFIED PHOTO
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Course Code</th>
        <th>Course Title</th>
        <th>Time & Session</th>
        <th>Hall & Desk</th>
        <th>Invigilator Sign</th>
      </tr>
    </thead>
    <tbody>
      ${schedules
        .map(
          (s) => `<tr>
          <td><strong>${s.examDate}</strong></td>
          <td>${s.courseCode}</td>
          <td>${s.courseTitle}</td>
          <td>${s.startTime} - ${s.endTime} (FN)</td>
          <td>${s.hall}</td>
          <td></td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="signatures">
    <div>Candidate Signature</div>
    <div>Controller of Examinations</div>
  </div>

  <div class="instructions">
    <strong>Instructions to Candidates:</strong><br>
    1. Candidates must occupy their designated examination desk 20 minutes prior to session commencement.<br>
    2. Possession of mobile phones, smartwatches, programmable calculators, or loose sheets is strictly prohibited under malpractice bylaws.<br>
    3. This admit card is digitally verified and requires no manual physical stamp.
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
