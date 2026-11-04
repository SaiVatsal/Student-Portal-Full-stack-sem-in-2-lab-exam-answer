# Nitro Azard Security Architecture & OWASP Top 10 Audit

This document details the security mitigations, threat modeling, and defensive controls implemented across Nitro Azard ERP.

---

## OWASP Top 10 Compliance Verification

### 1. A01:2021 - Broken Access Control
- **Mitigation:** Enforced via dual authorization boundaries:
  - **Edge / Application Layer:** Next.js Edge Middleware checks cryptographically signed session tokens and verifies role (`student`, `faculty`, `admin`, `parent`) before route dispatch.
  - **Database Persistence Layer:** PostgreSQL Row Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) is activated on all tables. A student cannot read another student's marks, attendance, or financial records even if application logic is bypassed. Parents have queries scoped strictly to their `linked_student_id`.
- **Verification:** Proven in automated test suite `tests/rls.test.ts`.

### 2. A02:2021 - Cryptographic Failures
- **Mitigation:**
  - Sessions stored strictly in `httpOnly`, `Secure`, `SameSite=Lax` cookies with SHA-256 HMAC signatures (`src/lib/security/session.ts`).
  - Sensitive environment secrets checked at process launch (`src/lib/env.ts`), requiring `SESSION_SECRET` entropy >= 32 characters.
  - Razorpay payment webhooks validated using HMAC-SHA256 signature matching against `RAZORPAY_WEBHOOK_SECRET`.

### 3. A03:2021 - Injection
- **Mitigation:**
  - 100% parameterised queries across database and Supabase clients.
  - Server actions validate all payloads with strict Zod schemas before database processing.
  - Input fields sanitized against HTML and script injection.

### 4. A04:2021 - Insecure Design
- **Mitigation:**
  - Hall ticket issuance cannot be overridden on client: server-side gate enforces zero pending fee dues AND minimum 75% attendance threshold.
  - Re-authentication timestamp required within 5 minutes for high-risk actions (password changes, payment triggers, grade publication).
  - Deemed university relative 10-point scale calculations performed server-side.

### 5. A05:2021 - Security Misconfiguration
- **Mitigation:** Strict HTTP security headers configured in `src/middleware.ts`:
  - `Content-Security-Policy`: Restricts scripts, styles, fonts, and network targets.
  - `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`
  - `X-Frame-Options`: `DENY`
  - `X-Content-Type-Options`: `nosniff`
  - `Referrer-Policy`: `strict-origin-when-cross-origin`
  - `Permissions-Policy`: Restricts microphone, camera, and geolocation.

### 6. A06:2021 - Vulnerable and Outdated Components
- **Mitigation:** Clean modern dependency graph audited with npm; no unverified third-party scripts.

### 7. A07:2021 - Identification and Authentication Failures
- **Mitigation:**
  - Multi-Factor Authentication (RFC 6238 TOTP) mandatory for Faculty and Admin with backup recovery codes.
  - Password strength validation: minimum 10 characters, checks against known breached password lists, and evaluates zxcvbn score (>= 3 required).
  - Rate limiting with 30-minute lockout after 5 consecutive failures per IP and per account (`src/lib/security/rate-limiter.ts`), using generic error messages to eliminate user enumeration.
  - Idle session timeout (30 min) and absolute session timeout (12 hours).

### 8. A08:2021 - Software and Data Integrity Failures
- **Mitigation:**
  - File uploads allowlist MIME extensions (.pdf, .zip) and inspect file metadata.
  - Payment webhooks enforce event idempotency (`processedEvents`) to prevent double-crediting fees.

### 9. A09:2021 - Security Logging and Monitoring Failures
- **Mitigation:**
  - Dedicated append-only `audit_logs` table (`src/server/db.ts`) capturing: actor ID, action type, target entity, timestamp, and client IP.
  - Comprehensive Audit Log Viewer for Administrators (`src/app/admin/audit-logs/page.tsx`).

### 10. A10:2021 - Server-Side Request Forgery (SSRF)
- **Mitigation:**
  - Service role key strictly prohibited from client bundles (`src/lib/supabase/admin.ts`).
  - Outbound network requests constrained to verified Supabase and Razorpay API origins.
