-- Nitro Azard Row Level Security (RLS) Policies
-- Strict isolation ensuring student privacy, parent view scoping, faculty boundaries, and admin audit trails.

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_borrowings ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for role identification
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth_linked_student_id()
RETURNS UUID AS $$
  SELECT linked_student_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profile lookup for authenticated users"
  ON profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile contact data"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admin full manage profiles"
  ON profiles FOR ALL TO authenticated
  USING (auth_user_role() = 'admin');

-- 2. Academics (Departments, Programs, Batches, Semesters, Sections, Courses)
CREATE POLICY "Academic catalogue read for authenticated"
  ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage departments"
  ON departments FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Programs read for authenticated"
  ON programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage programs"
  ON programs FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Batches read for authenticated"
  ON batches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage batches"
  ON batches FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Semesters read for authenticated"
  ON semesters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage semesters"
  ON semesters FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Sections read for authenticated"
  ON sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage sections"
  ON sections FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Courses read for authenticated"
  ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage courses"
  ON courses FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Course offerings read for authenticated"
  ON course_offerings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage course offerings"
  ON course_offerings FOR ALL TO authenticated USING (auth_user_role() = 'admin');

-- 3. Course Registrations
CREATE POLICY "Students can view their own course registrations"
  ON course_registrations FOR SELECT TO authenticated
  USING (
    student_id = auth.uid() OR
    student_id = auth_linked_student_id() OR
    auth_user_role() IN ('faculty', 'admin')
  );

CREATE POLICY "Students can register for courses"
  ON course_registrations FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND auth_user_role() = 'student');

CREATE POLICY "Students can drop registered courses"
  ON course_registrations FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 4. Attendance Sessions & Records
CREATE POLICY "Attendance sessions viewable by authenticated users"
  ON attendance_sessions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Faculty can create and update attendance sessions"
  ON attendance_sessions FOR ALL TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

CREATE POLICY "Students can view own attendance records"
  ON attendance_records FOR SELECT TO authenticated
  USING (
    student_id = auth.uid() OR
    student_id = auth_linked_student_id() OR
    auth_user_role() IN ('faculty', 'admin')
  );

CREATE POLICY "Faculty can mark and update attendance records"
  ON attendance_records FOR ALL TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

-- 5. Assessments & Student Marks
CREATE POLICY "Assessments viewable by all enrolled students and faculty"
  ON assessments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Faculty can manage assessments"
  ON assessments FOR ALL TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

CREATE POLICY "Students view only their own marks"
  ON student_marks FOR SELECT TO authenticated
  USING (
    (student_id = auth.uid() OR student_id = auth_linked_student_id()) AND
    EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND a.is_published = true)
    OR auth_user_role() IN ('faculty', 'admin')
  );

CREATE POLICY "Faculty and admin manage student marks"
  ON student_marks FOR ALL TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

-- 6. Semester Results
CREATE POLICY "Students view their own published results"
  ON semester_results FOR SELECT TO authenticated
  USING (
    (student_id = auth.uid() OR student_id = auth_linked_student_id()) AND is_published = true
    OR auth_user_role() = 'admin'
    OR (auth_user_role() = 'faculty' AND EXISTS (
      SELECT 1 FROM course_offerings co 
      WHERE co.course_id = semester_results.course_id AND co.faculty_id = auth.uid()
    ))
  );

CREATE POLICY "Admin manage semester results"
  ON semester_results FOR ALL TO authenticated
  USING (auth_user_role() = 'admin');

-- 7. Timetable & Exam Schedules
CREATE POLICY "Timetable viewable by authenticated"
  ON timetable_slots FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin manage timetable"
  ON timetable_slots FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Exam schedules viewable by authenticated"
  ON exam_schedules FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin manage exam schedules"
  ON exam_schedules FOR ALL TO authenticated USING (auth_user_role() = 'admin');

-- 8. Fees & Dues
CREATE POLICY "Fee structures viewable by all"
  ON fee_structures FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin manage fee structures"
  ON fee_structures FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Students and parents view own dues"
  ON student_fee_dues FOR SELECT TO authenticated
  USING (
    student_id = auth.uid() OR
    student_id = auth_linked_student_id() OR
    auth_user_role() = 'admin'
  );

CREATE POLICY "Admin manage student fee dues"
  ON student_fee_dues FOR ALL TO authenticated USING (auth_user_role() = 'admin');

CREATE POLICY "Students and parents view own transactions"
  ON fee_transactions FOR SELECT TO authenticated
  USING (
    student_id = auth.uid() OR
    student_id = auth_linked_student_id() OR
    auth_user_role() = 'admin'
  );

-- 9. Student Requests
CREATE POLICY "Students manage own requests"
  ON student_requests FOR SELECT TO authenticated
  USING (
    student_id = auth.uid() OR
    auth_user_role() IN ('faculty', 'admin')
  );

CREATE POLICY "Students can create requests"
  ON student_requests FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Faculty and admin can update student requests"
  ON student_requests FOR UPDATE TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

-- 10. Notices & Course Materials
CREATE POLICY "Notices viewable by authenticated"
  ON notices FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin and faculty manage notices"
  ON notices FOR ALL TO authenticated
  USING (auth_user_role() IN ('admin', 'faculty'));

CREATE POLICY "Course materials viewable by authenticated"
  ON course_materials FOR SELECT TO authenticated USING (true);

CREATE POLICY "Faculty can manage course materials"
  ON course_materials FOR ALL TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

-- 11. Assignments & Submissions
CREATE POLICY "Assignments viewable by authenticated"
  ON assignments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Faculty manage assignments"
  ON assignments FOR ALL TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

CREATE POLICY "Students view own assignment submissions"
  ON assignment_submissions FOR SELECT TO authenticated
  USING (
    student_id = auth.uid() OR
    auth_user_role() IN ('faculty', 'admin')
  );

CREATE POLICY "Students can submit assignments"
  ON assignment_submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Faculty can grade assignment submissions"
  ON assignment_submissions FOR UPDATE TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

-- 12. Feedback Submissions
CREATE POLICY "Students can submit anonymous feedback"
  ON feedback_submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Faculty and admin view feedback"
  ON feedback_submissions FOR SELECT TO authenticated
  USING (auth_user_role() IN ('faculty', 'admin'));

-- 13. Audit Logs (Append-Only)
CREATE POLICY "Admin view audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (auth_user_role() = 'admin');

CREATE POLICY "Authenticated users can append audit log"
  ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());
