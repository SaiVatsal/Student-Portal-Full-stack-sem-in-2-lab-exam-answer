# Nitro Azard • University Academic ERP Portal

> **Production-grade academic ERP system for deemed universities**, modeled on the workflows, vocabulary, and regulations of KL University ERP (KLU ERP) with modern design and speed.

---

## Key Features & Academic Architecture

- **Academic Credit Hierarchy:** Programs, Departments, Batches, Semesters, Sections, and Courses configured with Indian standard **L-T-P-S-C** credit structures (Lecture, Tutorial, Practical, Skilling, Credits).
- **Assessment Split:** 60% In-Sem Continuous Assessment (Mid-1 20%, Mid-2 20%, Continuous Assignments 10%, Lab Execution 10%) + 40% End-Sem Examination with 10-point relative SGPA/CGPA calculation.
- **Attendance & Hall Ticket Clearance Gate:** Automated enforcement of 75% regulatory threshold. Hall ticket is released only when pending fee dues = 0 AND attendance >= 75% (or sanctioned condonation).
- **Role-Gated Portals:**
  - **Student:** Live attendance breakdown & shortage calculator ("can skip N classes"), exam schedule, hall ticket PDF, In-Sem marks & End-Sem grade sheets, fee receipts, course registration, library borrowing, hostel & transport details, leave/OD requests, grievance tickets.
  - **Faculty:** Keyboard-driven session attendance marking with 24h edit window, In-Sem mark entry and publication locking, student lookup roster, study material distribution, leave & OD approvals, and Course Outcome (CO) attainment reports.
  - **Admin:** Student & faculty user management, bulk CSV roster ingestion with row-level error reporting, clash-free timetable scheduler, End-Sem result processing and freezing, fee structures & Razorpay reconciliation, university circulars, and immutable audit logs.
  - **Parent:** Scoped, read-only oversight of ward's attendance, examination marks, fee dues, and timetable.
- **Universal Command Search (Ctrl+K):** Instant global search across courses, circulars, fees, and services.

---

## Security Highlights

- **Dual-Layer Authorization:** Next.js Edge Middleware route guards + PostgreSQL Row Level Security (RLS) on all tables.
- **Authentication & MFA:** Support for Student ID or institutional email login; mandatory RFC 6238 TOTP two-factor authentication for Faculty & Admin with backup recovery keys.
- **Session Protection:** Encrypted httpOnly, SameSite=Lax cookie sessions with idle (30m) and absolute (12h) timeouts; re-authentication freshness checks for sensitive operations.
- **Rate Limiting:** IP and account brute-force lockout after 5 consecutive failures with generic error responses to prevent account enumeration.
- **OWASP Top 10 Hardened:** Strict Content Security Policy (CSP), HSTS, X-Frame-Options DENY, CSRF checks, and append-only audit logging.

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy the sample environment file:
```bash
cp .env.example .env.local
```
*(When running locally without a cloud Supabase database, `STANDALONE_DEV_MODE=true` is enabled by default with realistic seed records).*

### 3. Run Automated Tests & RLS Verification
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Default Test Accounts & Credentials

| Role | Login Identifier | Demo Password | MFA Code |
| :--- | :--- | :--- | :--- |
| **Student** | `2500040001` (or `aditya.verma@student.nitroazard.edu.in`) | `NitroStudent2025!` | *Not required* |
| **Faculty** | `KLU1042` (or `rajesh.kumar@faculty.nitroazard.edu.in`) | `NitroFaculty2025!` | `123456` |
| **Admin** | `KLU_ADMIN_01` (or `admin.academics@nitroazard.edu.in`) | `NitroAdmin2025!` | `123456` |
| **Parent** | `suresh.verma@parents.nitroazard.edu.in` | `NitroParent2025!` | *Not required* |

*(The login screen also provides one-click quick login buttons for all roles).*

---

## Supabase Database Deployment

1. Create a project in [Supabase](https://supabase.com).
2. Execute the migrations in order:
   - `supabase/migrations/20240101000000_schema.sql` (Tables & Relations)
   - `supabase/migrations/20240101000001_rls_policies.sql` (Row Level Security)
   - `supabase/seed.sql` (Realistic Indian deemed university seed dataset)
3. Set your production keys in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   SESSION_SECRET=<32_char_cryptographic_secret>
   ```

---

## Vercel Deployment

1. Push your repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. In Project Settings > Environment Variables, populate all variables from `.env.example`.
4. Deploy. Next.js App Router and Edge Middleware will build automatically.
