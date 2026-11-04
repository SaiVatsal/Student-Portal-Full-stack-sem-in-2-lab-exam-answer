// Nitro Azard University ERP Core Types

export type UserRole = "student" | "faculty" | "admin" | "parent";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  identifier: string; // e.g. 2500040001 (Student ID) or KLU1042 (Employee ID)
  linkedStudentId?: string; // For parent
  avatarUrl?: string;
  forcePasswordChange: boolean;
  mfaEnabled: boolean;
  mfaSecret?: string;
  recoveryCodes?: string[];
  createdAt: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  identifier: string;
  fullName: string;
  linkedStudentId?: string;
  isMfaVerified: boolean;
  forcePasswordChange: boolean;
  createdAt: number;
  lastActiveAt: number;
  lastReauthAt: number;
}

export interface CourseOutcome {
  code: string; // CO1, CO2, etc.
  desc: string;
  bloom: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
}

export interface Course {
  id: string;
  code: string; // e.g. 24CS2201
  title: string;
  departmentCode: string;
  lectureHours: number; // L
  tutorialHours: number; // T
  practicalHours: number; // P
  skillingHours: number; // S
  credits: number; // C
  syllabus: string;
  courseOutcomes: CourseOutcome[];
  prerequisites: string[];
}

export interface CourseOffering {
  id: string;
  course: Course;
  facultyName: string;
  facultyEmail: string;
  facultyCabin: string;
  sectionName: string;
  roomNumber: string;
  capacity: number;
  enrolledCount: number;
  semesterId: string;
}

export interface AttendanceSummary {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  conductedSessions: number;
  attendedSessions: number;
  percentage: number;
  status: "eligible" | "condonation_needed" | "shortage_detained";
  shortageMargin: number; // number of classes can skip or must attend
}

export interface AttendanceDetailRecord {
  id: string;
  date: string;
  period: number;
  topic: string;
  status: "present" | "absent" | "on_duty";
  facultyName: string;
}

export interface AssessmentItem {
  id: string;
  title: string;
  category: "in_sem_mid1" | "in_sem_mid2" | "in_sem_assignment" | "in_sem_lab" | "end_sem";
  maxMarks: number;
  weightage: number;
  marksObtained: number | null;
  feedback?: string;
  coMapped: string[];
  isPublished: boolean;
}

export interface CourseResultSummary {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  inSemScore: number; // max 60
  endSemScore: number; // max 40
  totalScore: number; // max 100
  grade: "O" | "A+" | "A" | "B+" | "B" | "C" | "F" | "AB";
  gradePoints: number;
  isPublished: boolean;
  revaluationStatus: "none" | "applied" | "revised" | "rejected";
}

export interface SemesterTranscript {
  semesterNumber: number;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  results: CourseResultSummary[];
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  period: number;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseTitle: string;
  facultyName: string;
  room: string;
}

export interface ExamScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  examType: "mid1" | "mid2" | "end_sem";
  examDate: string;
  startTime: string;
  endTime: string;
  hall: string;
}

export interface FeeDue {
  id: string;
  title: string;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  status: "paid" | "partial" | "pending";
}

export interface FeeTransaction {
  id: string;
  receiptNumber: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: "success" | "failed" | "pending";
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: "academic" | "examination" | "placement" | "event" | "general";
  isPinned: boolean;
  authorName: string;
  date: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  shelfLocation: string;
  availableCopies: number;
  totalCopies: number;
}

export interface LibraryBorrowing {
  id: string;
  bookTitle: string;
  isbn: string;
  issuedAt: string;
  dueDate: string;
  fineAmount: number;
  status: "issued" | "returned" | "overdue";
}

export interface StudentRequest {
  id: string;
  requestType: "bonafide" | "transcript" | "noc" | "leave" | "on_duty";
  reason: string;
  startDate?: string;
  endDate?: string;
  supportingDocUrl?: string;
  status: "pending" | "approved_by_faculty" | "approved_by_admin" | "rejected";
  facultyRemarks?: string;
  adminRemarks?: string;
  createdAt: string;
}

export interface HelpdeskTicket {
  id: string;
  category: "academic" | "examination" | "finance" | "hostel" | "transport" | "it_support";
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  replies: Array<{
    id: string;
    authorName: string;
    isStaff: boolean;
    message: string;
    createdAt: string;
  }>;
}

export interface Assignment {
  id: string;
  offeringId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  attachmentUrl?: string;
  submission?: {
    id: string;
    fileUrl: string;
    submittedAt: string;
    marksAwarded?: number;
    feedback?: string;
  };
}

export interface CourseMaterial {
  id: string;
  offeringId: string;
  courseCode: string;
  title: string;
  description: string;
  fileUrl: string;
  unitNumber: number;
  uploadedAt: string;
}
