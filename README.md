## Features & Overview
Credit Based Academic System

Academic Programmes are divided into Departments, Batches, Semesters, Sections and Courses. All follow the Indian standard L-T-P-S-C system.
Assessment Based
In Semester assessments are split into 60% Continuous Evaluation (20% Mid-1, 20% Mid-2, 10% Continuous Assignments, 10% Lab Implementation). End Seminars are worth 40%. The SGPA/CGPA are calculated using a 10-point scale.
Attendance & Hall Ticket Check
Automatic 75% attendance check. Hall tickets can only be issued if Fee Dues are 0, and attendance is at least 75% (or condoned).
User-Role Based
Students
View real-time attendance summary. Calculate how many classes can be missed. View exams, download hall ticket. View In Semester grades. View End Semester grading sheet. View Fee receipts. Register for courses. View library loans. View Hostel and Transport details. Submit Leave/OD request. Raise Grievance tickets.
Staff
Keyboard input attendance with 24 hour editing period. Enter In Semester grades. Lock grades. View students. Distribute study material. Approve Leave/OD. View Course Outcome (CO) achievement.
Admin
Manage students & staff. Bulk upload CSV list of students with error messages per row. Schedule non-clashing Timetable. Process & lock End Semester results. Manage Fee structure and reconcile with Razorpay. View Circulars. View read-only audit logs.
Parent
View limited read-only information regarding their child's attendance, exam grades, Fee dues, and timetable.
Global Search (Ctrl + K)
Quick search for courses, circulars, fees and more.

## Security

Next.js Edge Middleware Route Guards & PostgreSQL Row Level Security (RLS) on all tables.
Use Student ID or Email to login. Staff/Admin must use 2-Factor Authentication using TOTP (RFC 6238). These users have a recovery key.
Encrypted httpOnly cookies with SameSite=Lax. Session times out after 30 mins of inactivity or 12 hours. All sensitive actions require re-authentication.
Brute force protection. If an IP or account tries to login 5 times in a row they are locked out. Generic error messages.
OWASP Top 10 Security. Strict Content Security Policy (CSP), HSTS, X-Frame-Options DENY, CSRF, and Audit Logs (Append Only).
## Getting Started (Local)

Install dependencies:
npm install

Create environment file:
cp .env.example .env.local
Setup your environment (If you are running this locally without a Supabase DB then STANDALONE_DEV_MODE will be true by default and realistic records will be seeded):

Run tests & RLS:
npm test

Start development server:
npm run dev
Navigate to http://localhost:3000.

## Testing Accounts ##

| Role | Username | Password | MFA |
|--- |--- |--- |--- |
| Student | 2500040001 (aditya.verma@student.nitroazard.edu.in) | NitroStudent2025! | - |
| Staff | KLU1042 (rajesh.kumar@faculty.nitroazard.edu.in) | NitroFaculty2025! | 123456 |
| Admin | KLU_ADMIN_01 (admin.academics@nitroazard.edu.in) | NitroAdmin2025! | 123456 |
| Parent | suresh.verma@parents.nitroazard.edu.in | NitroParent2025! | - |

You can also use the quick login buttons on the login page.

## Supabase DB Setup ######
Make an account on Supabase.

Run the migrations in the following order,
supabase/migrations/20240101000000_schema.sql (Tables & Relationships)
supabase/migrations/20240101000001_rls_policies.sql (RLS)
supabase/seed.sql (Seed data with realistic data for an Indian Deemed University)
Set your keys in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_SECRET=<32_char_cryptographic_secret>

## Vercel Setup ###

Push your code to GitHub/GitLab.
Import your project onto Vercel.
Go to Project Settings > Environment Variables and fill in all the variables from .env.example.
Deploy. The Next.js App Router & Edge Middleware will be built for you.