
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Core User Records
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin', 'parent')),
  identifier TEXT UNIQUE NOT NULL, -- Student ID (e.g. 2500040001) or Faculty Employee ID (e.g. KLU1042)
  linked_student_id UUID REFERENCES profiles(id), -- For parent role
  avatar_url TEXT,
  force_password_change BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret TEXT,
  recovery_codes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Academic Hierarchy
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g. CSE, ECE, MECH, MBA
  name TEXT NOT NULL,
  school TEXT NOT NULL, -- e.g. School of Computing, School of Engineering
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL, -- e.g. BTECH-CSE, BTECH-ECE, BCA
  name TEXT NOT NULL,
  degree TEXT NOT NULL, -- B.Tech, M.Tech, BCA, MBA
  duration_years INT NOT NULL DEFAULT 4,
  total_credits INT NOT NULL DEFAULT 160,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. 2022-2026 Batch
  start_year INT NOT NULL,
  end_year INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semesters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  semester_number INT NOT NULL CHECK (semester_number BETWEEN 1 AND 8),
  academic_year TEXT NOT NULL, -- e.g. 2025-2026 Even Semester
  is_current BOOLEAN DEFAULT FALSE,
  registration_open BOOLEAN DEFAULT FALSE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Section 1, Section 2, etc.
  room_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Student & Faculty Entities
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL, -- e.g. 2500040001
  program_id UUID REFERENCES programs(id),
  batch_id UUID REFERENCES batches(id),
  current_semester_id UUID REFERENCES semesters(id),
  section_id UUID REFERENCES sections(id),
  mentor_id UUID REFERENCES profiles(id),
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cgpa NUMERIC(4, 2) DEFAULT 0.00,
  sgpa NUMERIC(4, 2) DEFAULT 0.00,
  hostel_room TEXT,
  bus_route TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL, -- e.g. KLU1042
  department_id UUID REFERENCES departments(id),
  designation TEXT NOT NULL, -- Professor, Assoc. Professor, Asst. Professor
  cabin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Courses and Curriculum (L-T-P-S-C)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g. 24CS2201
  title TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  lecture_hours INT NOT NULL DEFAULT 3,   -- L
  tutorial_hours INT NOT NULL DEFAULT 0,  -- T
  practical_hours INT NOT NULL DEFAULT 2, -- P
  skilling_hours INT NOT NULL DEFAULT 0,  -- S
  credits INT NOT NULL DEFAULT 4,         -- C
  syllabus TEXT,
  course_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. [{"code":"CO1", "desc":"Understand fundamentals", "bloom":"Understand"}]
  prerequisites JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_offerings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES profiles(id),
  section_id UUID REFERENCES sections(id),
  capacity INT NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (semester_id, course_id, section_id)
);

CREATE TABLE IF NOT EXISTS course_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'dropped', 'pending')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, offering_id)
);

-- 5. Attendance (75% Threshold, Condonation & Shortage)
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period INT NOT NULL CHECK (period BETWEEN 1 AND 8),
  topic TEXT NOT NULL,
  taken_by UUID REFERENCES profiles(id),
  locked_at TIMESTAMPTZ, -- 24h edit window lock
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'on_duty')),
  remark TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, student_id)
);

-- 6. Assessments and Marks (In-Sem Mid-1/2, Quizzes, Lab, End-Sem)
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- e.g. Mid-1 Examination, Continuous Assessment 1
  category TEXT NOT NULL CHECK (category IN ('in_sem_mid1', 'in_sem_mid2', 'in_sem_assignment', 'in_sem_lab', 'end_sem')),
  max_marks NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
  weightage NUMERIC(5, 2) NOT NULL DEFAULT 20.00, -- Percentage weight
  co_mapped TEXT[] DEFAULT ARRAY[]::TEXT[], -- e.g. ARRAY['CO1', 'CO2']
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  marks_obtained NUMERIC(5, 2) NOT NULL CHECK (marks_obtained >= 0),
  feedback TEXT,
  entered_by UUID REFERENCES profiles(id),
  locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (assessment_id, student_id)
);

-- 7. Semester Results & Grade Sheets
CREATE TABLE IF NOT EXISTS semester_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  in_sem_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00, -- Weighted In-Sem (out of 60)
  end_sem_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00, -- Weighted End-Sem (out of 40)
  total_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00, -- out of 100
  grade TEXT NOT NULL CHECK (grade IN ('O', 'A+', 'A', 'B+', 'B', 'C', 'F', 'AB')),
  grade_points INT NOT NULL CHECK (grade_points BETWEEN 0 AND 10),
  credits INT NOT NULL DEFAULT 4,
  is_published BOOLEAN DEFAULT FALSE,
  revaluation_status TEXT DEFAULT 'none' CHECK (revaluation_status IN ('none', 'applied', 'revised', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, semester_id, course_id)
);

-- 8. Timetable
CREATE TABLE IF NOT EXISTS timetable_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  period INT NOT NULL CHECK (period BETWEEN 1 AND 8),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Examinations, Seating & Hall Tickets
CREATE TABLE IF NOT EXISTS exam_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('mid1', 'mid2', 'end_sem')),
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  hall TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Fees & Payments
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  semester_number INT NOT NULL,
  title TEXT NOT NULL,
  tuition_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  special_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  exam_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  hostel_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  transport_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_fee_dues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount_due NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'partial', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  due_id UUID REFERENCES student_fee_dues(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  receipt_number TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Student Requests (Bonafide, NOC, Leave, OD)
CREATE TABLE IF NOT EXISTS student_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('bonafide', 'transcript', 'noc', 'leave', 'on_duty')),
  reason TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  supporting_doc_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved_by_faculty', 'approved_by_admin', 'rejected')),
  faculty_remarks TEXT,
  admin_remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Library System
CREATE TABLE IF NOT EXISTS library_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  isbn TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  shelf_location TEXT NOT NULL,
  total_copies INT NOT NULL DEFAULT 5,
  available_copies INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS library_borrowings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES library_books(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  issued_at DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  returned_at DATE,
  fine_amount NUMERIC(8, 2) DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Helpdesk Tickets
CREATE TABLE IF NOT EXISTS helpdesk_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('academic', 'examination', 'finance', 'hostel', 'transport', 'it_support')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS helpdesk_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Notices, Events, Course Materials, LMS & Feedback
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'examination', 'placement', 'event', 'general')),
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'faculty', 'parents')),
  is_pinned BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  unit_number INT DEFAULT 1,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  max_marks NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
  attachment_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_url TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  marks_awarded NUMERIC(5, 2),
  feedback TEXT,
  graded_by UUID REFERENCES profiles(id),
  UNIQUE (assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS feedback_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  teaching_rating INT NOT NULL CHECK (teaching_rating BETWEEN 1 AND 5),
  clarity_rating INT NOT NULL CHECK (clarity_rating BETWEEN 1 AND 5),
  pace_rating INT NOT NULL CHECK (pace_rating BETWEEN 1 AND 5),
  support_rating INT NOT NULL CHECK (support_rating BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (offering_id, student_id)
);

-- 15. Append-Only Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL, -- e.g. 'ATTENDANCE_MARKED', 'MARKS_PUBLISHED', 'FEE_PAID', 'USER_ROLE_UPDATED'
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  ip_address TEXT,
  old_state JSONB,
  new_state JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
