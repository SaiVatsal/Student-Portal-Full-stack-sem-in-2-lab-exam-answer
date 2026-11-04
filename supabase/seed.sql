-- Nitro Azard University ERP Seed Data
-- Comprehensive realistic Indian university academic dataset

-- Static UUIDs for deterministic foreign key relationships
-- Users
-- Student: Aditya Verma (ID: 2500040001) -> e0000000-0000-0000-0000-000000000001
-- Student 2: Ananya Sharma (ID: 2500040002) -> e0000000-0000-0000-0000-000000000002
-- Faculty: Dr. Rajesh Kumar (ID: KLU1042) -> e0000000-0000-0000-0000-000000000003
-- Faculty 2: Dr. Priya Sundaram (ID: KLU1088) -> e0000000-0000-0000-0000-000000000004
-- Admin: Dr. K. Venkat Rao (ID: KLU_ADMIN_01) -> e0000000-0000-0000-0000-000000000005
-- Parent: Suresh Verma (Parent of Aditya) -> e0000000-0000-0000-0000-000000000006

INSERT INTO profiles (id, email, full_name, phone, role, identifier, linked_student_id, mfa_enabled)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'aditya.verma@student.nitroazard.edu.in', 'Aditya Verma', '+91 98480 12345', 'student', '2500040001', NULL, false),
  ('e0000000-0000-0000-0000-000000000002', 'ananya.sharma@student.nitroazard.edu.in', 'Ananya Sharma', '+91 98480 23456', 'student', '2500040002', NULL, false),
  ('e0000000-0000-0000-0000-000000000003', 'rajesh.kumar@faculty.nitroazard.edu.in', 'Dr. Rajesh Kumar', '+91 94401 56789', 'faculty', 'KLU1042', NULL, true),
  ('e0000000-0000-0000-0000-000000000004', 'priya.sundaram@faculty.nitroazard.edu.in', 'Dr. Priya Sundaram', '+91 94402 67890', 'faculty', 'KLU1088', NULL, true),
  ('e0000000-0000-0000-0000-000000000005', 'admin.academics@nitroazard.edu.in', 'Dr. K. Venkat Rao', '+91 94400 00001', 'admin', 'KLU_ADMIN_01', NULL, true),
  ('e0000000-0000-0000-0000-000000000224', '2500040224@nitroazard.edu.in', 'Super Administrator', '+91 99999 00224', 'admin', '2500040224', NULL, false),
  ('e0000000-0000-0000-0000-000000000006', 'suresh.verma@parents.nitroazard.edu.in', 'Suresh Verma', '+91 98480 99999', 'parent', 'PARENT_2500040001', 'e0000000-0000-0000-0000-000000000001', false)
ON CONFLICT (id) DO NOTHING;

-- Departments
INSERT INTO departments (id, code, name, school) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'CSE', 'Computer Science & Engineering', 'School of Computing'),
  ('d0000000-0000-0000-0000-000000000002', 'ECE', 'Electronics & Communication Engineering', 'School of Electrical Sciences')
ON CONFLICT (code) DO NOTHING;

-- Programs
INSERT INTO programs (id, department_id, code, name, degree, duration_years, total_credits) VALUES
  ('p0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'BTECH-CSE', 'Bachelor of Technology in Computer Science and Engineering', 'B.Tech', 4, 160)
ON CONFLICT (code) DO NOTHING;

-- Batches
INSERT INTO batches (id, program_id, name, start_year, end_year) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Batch 2022-2026', 2022, 2026)
ON CONFLICT DO NOTHING;

-- Semesters
INSERT INTO semesters (id, batch_id, semester_number, academic_year, is_current, registration_open, start_date, end_date) VALUES
  ('s0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 5, '2024-2025 Odd', false, false, '2024-07-01', '2024-11-30'),
  ('s0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 6, '2024-2025 Even', true, true, '2024-12-15', '2025-05-10')
ON CONFLICT DO NOTHING;

-- Sections
INSERT INTO sections (id, semester_id, name, room_number) VALUES
  ('sec00000-0000-0000-0000-000000000012', 's0000000-0000-0000-0000-000000000006', 'Section 12', 'C-Block 402')
ON CONFLICT DO NOTHING;

-- Students
INSERT INTO students (id, student_id, program_id, batch_id, current_semester_id, section_id, mentor_id, cgpa, sgpa, hostel_room, bus_route) VALUES
  ('e0000000-0000-0000-0000-000000000001', '2500040001', 'p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000006', 'sec00000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000003', 8.84, 8.92, 'Kapil Dev Block A-304', 'Route 14 (Vijayawada Benz Circle)'),
  ('e0000000-0000-0000-0000-000000000002', '2500040002', 'p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000006', 'sec00000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000003', 9.15, 9.20, 'Gargi Block B-212', 'Route 22 (Guntur Lakshmipuram)')
ON CONFLICT (id) DO NOTHING;

-- Faculty
INSERT INTO faculty (id, employee_id, department_id, designation, cabin) VALUES
  ('e0000000-0000-0000-0000-000000000003', 'KLU1042', 'd0000000-0000-0000-0000-000000000001', 'Professor', 'C-Block 312'),
  ('e0000000-0000-0000-0000-000000000004', 'KLU1088', 'd0000000-0000-0000-0000-000000000001', 'Associate Professor', 'C-Block 315')
ON CONFLICT (id) DO NOTHING;

-- Courses (L-T-P-S-C)
INSERT INTO courses (id, code, title, department_id, lecture_hours, tutorial_hours, practical_hours, skilling_hours, credits, syllabus, course_outcomes) VALUES
  ('c0000000-0000-0000-0000-000000000001', '24CS2201', 'Design and Analysis of Algorithms', 'd0000000-0000-0000-0000-000000000001', 3, 1, 2, 0, 4,
   'Asymptotic notations, Divide and Conquer, Greedy algorithms, Dynamic programming, Graph algorithms, NP-Completeness',
   '[{"code":"CO1","desc":"Analyze time complexity using asymptotic bounds","bloom":"Analyze"},{"code":"CO2","desc":"Formulate dynamic programming and greedy strategies","bloom":"Apply"},{"code":"CO3","desc":"Synthesize graph algorithms for optimization problems","bloom":"Create"},{"code":"CO4","desc":"Classify P, NP, and NP-Complete complexity classes","bloom":"Evaluate"}]'::jsonb),

  ('c0000000-0000-0000-0000-000000000002', '24CS2202', 'Database Management Systems', 'd0000000-0000-0000-0000-000000000001', 3, 0, 2, 2, 5,
   'Relational model, SQL, Normalization (1NF to BCNF), Transaction management, ACID properties, Indexing and NoSQL',
   '[{"code":"CO1","desc":"Design ER diagrams and convert into relational schemas","bloom":"Create"},{"code":"CO2","desc":"Construct complex SQL queries with joins and subqueries","bloom":"Apply"},{"code":"CO3","desc":"Normalize database tables to eliminate anomalies","bloom":"Analyze"},{"code":"CO4","desc":"Implement concurrent transaction schedules with serializability","bloom":"Apply"}]'::jsonb),

  ('c0000000-0000-0000-0000-000000000003', '24CS2203', 'Operating Systems Principles', 'd0000000-0000-0000-0000-000000000001', 3, 0, 2, 0, 4,
   'Processes and threads, CPU scheduling, Synchronization primitives, Deadlock handling, Virtual memory and Paging',
   '[{"code":"CO1","desc":"Explain OS structure and kernel architecture","bloom":"Understand"},{"code":"CO2","desc":"Evaluate CPU scheduling algorithms under load","bloom":"Evaluate"},{"code":"CO3","desc":"Solve synchronization problems with semaphores and mutexes","bloom":"Apply"},{"code":"CO4","desc":"Analyze page replacement policies and virtual memory","bloom":"Analyze"}]'::jsonb),

  ('c0000000-0000-0000-0000-000000000004', '24CS2204', 'Full Stack Web Engineering', 'd0000000-0000-0000-0000-000000000001', 2, 0, 4, 2, 5,
   'React, Next.js App Router, TypeScript, REST & GraphQL APIs, Postgres, Authentication & Secure State Management',
   '[{"code":"CO1","desc":"Build responsive component-driven modern frontends","bloom":"Create"},{"code":"CO2","desc":"Implement RESTful microservices with schema validation","bloom":"Apply"},{"code":"CO3","desc":"Enforce authentication and role-based access control","bloom":"Apply"},{"code":"CO4","desc":"Deploy production containerized web applications","bloom":"Evaluate"}]'::jsonb),

  ('c0000000-0000-0000-0000-000000000005', '24UC0009', 'Professional Communication & Soft Skills', 'd0000000-0000-0000-0000-000000000001', 1, 0, 2, 0, 2,
   'Corporate etiquette, Technical writing, Group discussions, Interview preparation, Verbal aptitude',
   '[{"code":"CO1","desc":"Demonstrate technical presentation skills","bloom":"Apply"},{"code":"CO2","desc":"Draft professional emails and technical reports","bloom":"Create"}]'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- Course Offerings for Semester 6, Section 12
INSERT INTO course_offerings (id, semester_id, course_id, faculty_id, section_id, capacity) VALUES
  ('o0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'sec00000-0000-0000-0000-000000000012', 65),
  ('o0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000004', 'sec00000-0000-0000-0000-000000000012', 65),
  ('o0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', 'sec00000-0000-0000-0000-000000000012', 65),
  ('o0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000004', 'sec00000-0000-0000-0000-000000000012', 65),
  ('o0000000-0000-0000-0000-000000000005', 's0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000003', 'sec00000-0000-0000-0000-000000000012', 65)
ON CONFLICT DO NOTHING;

-- Course Registrations for Aditya Verma (Student 1)
INSERT INTO course_registrations (student_id, offering_id, status) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'registered'),
  ('e0000000-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000001', 'registered'),
  ('e0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000002', 'registered'),
  ('e0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000003', 'registered'),
  ('e0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000004', 'registered'),
  ('e0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000005', 'registered')
ON CONFLICT DO NOTHING;

-- Realistic Attendance Sessions and Attendance records
-- 24CS2201 (Algorithms): 40 sessions, Aditya attended 34 (85.0% - Eligible)
-- 24CS2202 (DBMS): 38 sessions, Aditya attended 31 (81.5% - Eligible)
-- 24CS2203 (OS): 36 sessions, Aditya attended 26 (72.2% - Condonation Needed, <75% and >=65%)
-- 24CS2204 (Full Stack): 42 sessions, Aditya attended 38 (90.4% - Eligible)
-- 24UC0009 (Soft Skills): 20 sessions, Aditya attended 18 (90.0% - Eligible)

-- Assessments for 24CS2201 (Algorithms)
INSERT INTO assessments (id, offering_id, title, category, max_marks, weightage, is_published, co_mapped) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'In-Sem Mid-1 Examination', 'in_sem_mid1', 100.00, 20.00, true, ARRAY['CO1', 'CO2']),
  ('a0000000-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000001', 'In-Sem Mid-2 Examination', 'in_sem_mid2', 100.00, 20.00, true, ARRAY['CO3', 'CO4']),
  ('a0000000-0000-0000-0000-000000000003', 'o0000000-0000-0000-0000-000000000001', 'Continuous Assessment 1 (Greedy / DP)', 'in_sem_assignment', 100.00, 10.00, true, ARRAY['CO2']),
  ('a0000000-0000-0000-0000-000000000004', 'o0000000-0000-0000-0000-000000000001', 'Lab Record & Practical Execution', 'in_sem_lab', 100.00, 10.00, true, ARRAY['CO3']),
  ('a0000000-0000-0000-0000-000000000005', 'o0000000-0000-0000-0000-000000000001', 'End-Semester Theory Examination', 'end_sem', 100.00, 40.00, true, ARRAY['CO1', 'CO2', 'CO3', 'CO4'])
ON CONFLICT DO NOTHING;

-- Student Marks for Aditya Verma in 24CS2201
INSERT INTO student_marks (assessment_id, student_id, marks_obtained, feedback, entered_by, locked) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 88.50, 'Excellent formulation in dynamic programming problem', 'e0000000-0000-0000-0000-000000000003', true),
  ('a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 84.00, 'Good graph reductions, minor proof gap in NP reduction', 'e0000000-0000-0000-0000-000000000003', true),
  ('a0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 95.00, 'Optimal C++ code implementation submitted on time', 'e0000000-0000-0000-0000-000000000003', true),
  ('a0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 92.00, 'Demonstrated Dijkstra and Bellman-Ford effectively', 'e0000000-0000-0000-0000-000000000003', true),
  ('a0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 86.00, 'Comprehensive answers across all CO sections', 'e0000000-0000-0000-0000-000000000003', true)
ON CONFLICT DO NOTHING;

-- Semester Results for Previous Semester 5
INSERT INTO semester_results (student_id, semester_id, course_id, in_sem_score, end_sem_score, total_score, grade, grade_points, credits, is_published) VALUES
  ('e0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 53.20, 34.40, 87.60, 'A+', 9, 4, true),
  ('e0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 55.40, 36.80, 92.20, 'O', 10, 5, true),
  ('e0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 50.10, 31.00, 81.10, 'A', 8, 4, true),
  ('e0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004', 57.00, 38.00, 95.00, 'O', 10, 5, true),
  ('e0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 46.00, 35.00, 81.00, 'A', 8, 2, true)
ON CONFLICT DO NOTHING;

-- Fee Structures
INSERT INTO fee_structures (id, program_id, batch_id, semester_number, title, tuition_fee, special_fee, exam_fee, hostel_fee, transport_fee, total_fee) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 6, 'Even Semester 2024-2025 Tuition & Amenities', 125000.00, 15000.00, 4500.00, 42000.00, 0.00, 186500.00)
ON CONFLICT DO NOTHING;

-- Fee Dues
INSERT INTO student_fee_dues (id, student_id, semester_id, title, amount_due, amount_paid, due_date, status) VALUES
  ('fd000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000006', 'Semester 6 Academic & Hostel Fee', 186500.00, 186500.00, '2025-01-10', 'paid'),
  ('fd000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000006', 'Semester 6 Academic & Bus Fee', 154500.00, 120000.00, '2025-01-10', 'partial')
ON CONFLICT DO NOTHING;

-- Fee Transaction Receipts
INSERT INTO fee_transactions (due_id, student_id, amount, receipt_number, payment_method, razorpay_payment_id, status) VALUES
  ('fd000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 186500.00, 'NA-RCP-2025-08149', 'Razorpay NetBanking / UPI', 'pay_Ox8jK9Pq2LzM5', 'success')
ON CONFLICT DO NOTHING;

-- Notices
INSERT INTO notices (title, content, category, target_audience, is_pinned, author_id) VALUES
  ('End-Semester Theory Examinations Schedule Announced', 'The End-Semester Theory Examinations for B.Tech Even Semester 2024-25 are scheduled to commence from 24th April 2025. Hall tickets will be issued only to candidates having no pending fee dues and minimum 75% attendance.', 'examination', 'all', true, 'e0000000-0000-0000-0000-000000000005'),
  ('Annual Technical Symposium - NIRVANA 2025', 'Department of Computer Science & Engineering invites student papers and hackathon registrations for NIRVANA 2025 scheduled on March 28-29, 2025. Exciting prize pool of INR 5,00,000.', 'event', 'students', true, 'e0000000-0000-0000-0000-000000000003'),
  ('Attendance Condonation Window Open', 'Students with attendance between 65.0% and 74.9% due to medical reasons or sanctioned On-Duty representation may submit applications with certified supporting documents to Dean Academics before 15th April 2025.', 'academic', 'students', false, 'e0000000-0000-0000-0000-000000000005');
