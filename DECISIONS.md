# Architectural & Functional Decisions

1. Adopted L-T-P-S-C credit structure (Lecture, Tutorial, Practical, Skilling, Credits) reflecting Indian deemed university academic regulations.
2. In-Sem marks calculated with 60% weight (Mid-1 20%, Mid-2 20%, Continuous Assessments/Assignments 10%, Lab/Skilling 10%) and End-Sem with 40% weight.
3. Strict 75% attendance rule implemented: >=75% eligible, 65%-74.9% requires condonation with medical/OD proof and fine, <65% detained (hall ticket blocked).
4. Hall ticket issuance blocked atomically if pending fee dues > 0 or attendance eligibility condition fails.
5. Role authorization enforced at edge via Next.js Middleware and at data persistence layer via PostgreSQL Row Level Security (RLS).
6. Dual-mode data architecture: supports production live Supabase PostgreSQL instances and local offline standalone seed execution for zero-latency review.
7. TOTP MFA enforcement requires 6-digit RFC 6238 time-based tokens for Faculty and Admin with 8 backup recovery codes.
8. Sensitive actions (password change, bank/fee transactions, grade publication) require re-authentication within a 5-minute freshness window.
9. Audit logs use an append-only table with SHA-256 fingerprinting for high-impact mutations (marks, publish, fee receipt, role promotion).
10. Global command search (Ctrl+K) indexes registered courses, active notices, university services, and quick navigation routes.

