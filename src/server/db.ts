// Nitro Azard University ERP Data Layer
// Implements full academic model with L-T-P-S-C structure, In-Sem / End-Sem splits, 75% attendance logic, and hall ticket gates.

import {
  UserProfile,
  UserRole,
  Course,
  CourseOffering,
  AttendanceSummary,
  AttendanceDetailRecord,
  AssessmentItem,
  CourseResultSummary,
  SemesterTranscript,
  TimetableSlot,
  ExamScheduleItem,
  FeeDue,
  FeeTransaction,
  Notice,
  LibraryBook,
  LibraryBorrowing,
  StudentRequest,
  HelpdeskTicket,
  Assignment,
  CourseMaterial,
} from "../lib/types";

// Seed data stores in-memory for zero-latency standalone execution, with full mutation persistence
interface DatabaseStore {
  profiles: Map<string, UserProfile>;
  courses: Map<string, Course>;
  offerings: Map<string, CourseOffering>;
  registrations: Map<string, Set<string>>; // studentId -> Set<offeringId>
  attendanceSessions: Array<{
    id: string;
    offeringId: string;
    date: string;
    period: number;
    topic: string;
    facultyId: string;
    lockedAt: string;
  }>;
  attendanceRecords: Map<string, Array<{ recordId: string; sessionId: string; studentId: string; status: "present" | "absent" | "on_duty" }>>; // offeringId -> records
  assessments: Map<string, AssessmentItem[]>; // offeringId -> assessments
  studentMarks: Map<string, Map<string, number>>; // assessmentId -> (studentId -> marks)
  semesterResults: Map<string, CourseResultSummary[]>; // studentId -> results
  timetable: TimetableSlot[];
  examSchedules: ExamScheduleItem[];
  feeDues: Map<string, FeeDue[]>; // studentId -> dues
  feeTransactions: Map<string, FeeTransaction[]>; // studentId -> transactions
  notices: Notice[];
  libraryBooks: LibraryBook[];
  libraryBorrowings: Map<string, LibraryBorrowing[]>; // studentId -> borrowings
  requests: StudentRequest[];
  helpdeskTickets: HelpdeskTicket[];
  assignments: Assignment[];
  materials: CourseMaterial[];
  auditLogs: Array<{
    id: string;
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    ipAddress?: string;
    details: string;
    timestamp: string;
  }>;
}

// Global singleton database instance
let db: DatabaseStore | null = null;

export function getDatabase(): DatabaseStore {
  if (db) return db;

  db = {
    profiles: new Map(),
    courses: new Map(),
    offerings: new Map(),
    registrations: new Map(),
    attendanceSessions: [],
    attendanceRecords: new Map(),
    assessments: new Map(),
    studentMarks: new Map(),
    semesterResults: new Map(),
    timetable: [],
    examSchedules: [],
    feeDues: new Map(),
    feeTransactions: new Map(),
    notices: [],
    libraryBooks: [],
    libraryBorrowings: new Map(),
    requests: [],
    helpdeskTickets: [],
    assignments: [],
    materials: [],
    auditLogs: [],
  };

  initializeSeedData(db);
  return db;
}

function initializeSeedData(store: DatabaseStore) {
  // 1. Profiles
  const profiles: UserProfile[] = [
    {
      id: "e0000000-0000-0000-0000-000000000001",
      email: "aditya.verma@student.nitroazard.edu.in",
      fullName: "Aditya Verma",
      phone: "+91 98480 12345",
      role: "student",
      identifier: "2500040001",
      forcePasswordChange: false,
      mfaEnabled: false,
      createdAt: "2024-07-01T00:00:00.000Z",
    },
    {
      id: "e0000000-0000-0000-0000-000000000002",
      email: "ananya.sharma@student.nitroazard.edu.in",
      fullName: "Ananya Sharma",
      phone: "+91 98480 23456",
      role: "student",
      identifier: "2500040002",
      forcePasswordChange: false,
      mfaEnabled: false,
      createdAt: "2024-07-01T00:00:00.000Z",
    },
    {
      id: "e0000000-0000-0000-0000-000000000003",
      email: "rajesh.kumar@faculty.nitroazard.edu.in",
      fullName: "Dr. Rajesh Kumar",
      phone: "+91 94401 56789",
      role: "faculty",
      identifier: "KLU1042",
      forcePasswordChange: false,
      mfaEnabled: true,
      mfaSecret: "JBSWY3DPEHPK3PXP", // Pre-configured secret for demo MFA
      createdAt: "2022-06-01T00:00:00.000Z",
    },
    {
      id: "e0000000-0000-0000-0000-000000000004",
      email: "priya.sundaram@faculty.nitroazard.edu.in",
      fullName: "Dr. Priya Sundaram",
      phone: "+91 94402 67890",
      role: "faculty",
      identifier: "KLU1088",
      forcePasswordChange: false,
      mfaEnabled: true,
      mfaSecret: "JBSWY3DPEHPK3PXP",
      createdAt: "2023-01-15T00:00:00.000Z",
    },
    {
      id: "e0000000-0000-0000-0000-000000000005",
      email: "admin.academics@nitroazard.edu.in",
      fullName: "Dr. K. Venkat Rao",
      phone: "+91 94400 00001",
      role: "admin",
      identifier: "KLU_ADMIN_01",
      forcePasswordChange: false,
      mfaEnabled: true,
      mfaSecret: "JBSWY3DPEHPK3PXP",
      createdAt: "2020-01-01T00:00:00.000Z",
    },
    {
      id: "e0000000-0000-0000-0000-000000000224",
      email: "2500040224@nitroazard.edu.in",
      fullName: "Super Administrator (2500040224)",
      phone: "+91 99999 00224",
      role: "admin",
      identifier: "2500040224",
      forcePasswordChange: false,
      mfaEnabled: false,
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "e0000000-0000-0000-0000-000000000006",
      email: "suresh.verma@parents.nitroazard.edu.in",
      fullName: "Suresh Verma",
      phone: "+91 98480 99999",
      role: "parent",
      identifier: "PARENT_2500040001",
      linkedStudentId: "e0000000-0000-0000-0000-000000000001",
      forcePasswordChange: false,
      mfaEnabled: false,
      createdAt: "2024-07-01T00:00:00.000Z",
    },
  ];

  for (const p of profiles) {
    store.profiles.set(p.id, p);
  }

  // 2. Courses (L-T-P-S-C)
  const coursesList: Course[] = [
    {
      id: "c0000000-0000-0000-0000-000000000001",
      code: "24CS2201",
      title: "Design and Analysis of Algorithms",
      departmentCode: "CSE",
      lectureHours: 3,
      tutorialHours: 1,
      practicalHours: 2,
      skillingHours: 0,
      credits: 4,
      syllabus: "Asymptotic notation, Recurrences, Divide and Conquer, Greedy Algorithms, Dynamic Programming, Graph Traversals, Shortest Paths, Maximum Flow, NP-Completeness.",
      courseOutcomes: [
        { code: "CO1", desc: "Analyze asymptotic complexity of iterative and recursive algorithms", bloom: "Analyze" },
        { code: "CO2", desc: "Design optimal divide-and-conquer and dynamic programming solutions", bloom: "Apply" },
        { code: "CO3", desc: "Implement advanced graph algorithms for network flow and traversal", bloom: "Create" },
        { code: "CO4", desc: "Classify intractable computational problems into P and NP classes", bloom: "Evaluate" },
      ],
      prerequisites: ["24CS1102 (Data Structures)"],
    },
    {
      id: "c0000000-0000-0000-0000-000000000002",
      code: "24CS2202",
      title: "Database Management Systems",
      departmentCode: "CSE",
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 2,
      skillingHours: 2,
      credits: 5,
      syllabus: "Entity-Relationship model, Relational algebra, SQL DDL/DML, Normal forms (1NF through BCNF), Transaction processing, Serializability, Concurrency control, Query optimization.",
      courseOutcomes: [
        { code: "CO1", desc: "Design conceptual and relational schemas using ER modeling", bloom: "Create" },
        { code: "CO2", desc: "Construct multi-table complex queries with aggregate and window functions", bloom: "Apply" },
        { code: "CO3", desc: "Normalize schemas to eliminate insertion, deletion and update anomalies", bloom: "Analyze" },
        { code: "CO4", desc: "Formulate ACID transactions and two-phase locking protocols", bloom: "Apply" },
      ],
      prerequisites: ["24CS1101 (Programming Fundamentals)"],
    },
    {
      id: "c0000000-0000-0000-0000-000000000003",
      code: "24CS2203",
      title: "Operating Systems Principles",
      departmentCode: "CSE",
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 2,
      skillingHours: 0,
      credits: 4,
      syllabus: "OS structures, Process management, CPU scheduling, Thread synchronization, Deadlock characterization and prevention, Virtual memory management, Demand paging, File systems.",
      courseOutcomes: [
        { code: "CO1", desc: "Explain kernel abstractions, system calls and process states", bloom: "Understand" },
        { code: "CO2", desc: "Evaluate preemptive and non-preemptive CPU scheduling policies", bloom: "Evaluate" },
        { code: "CO3", desc: "Develop synchronization solutions using semaphores, mutexes and monitors", bloom: "Apply" },
        { code: "CO4", desc: "Analyze virtual memory paging and page-replacement algorithms", bloom: "Analyze" },
      ],
      prerequisites: ["24CS1203 (Computer Organization)"],
    },
    {
      id: "c0000000-0000-0000-0000-000000000004",
      code: "24CS2204",
      title: "Full Stack Web Engineering",
      departmentCode: "CSE",
      lectureHours: 2,
      tutorialHours: 0,
      practicalHours: 4,
      skillingHours: 2,
      credits: 5,
      syllabus: "Next.js App Router, React Server Components, TypeScript, Server Actions, PostgreSQL integration, Web Security, State management, CI/CD and cloud deployment.",
      courseOutcomes: [
        { code: "CO1", desc: "Build reactive accessible responsive web interfaces", bloom: "Create" },
        { code: "CO2", desc: "Develop type-safe REST and Server Action APIs with validation", bloom: "Apply" },
        { code: "CO3", desc: "Implement robust authentication and Row Level Security policies", bloom: "Apply" },
        { code: "CO4", desc: "Deploy and optimize containerized web applications", bloom: "Evaluate" },
      ],
      prerequisites: [],
    },
    {
      id: "c0000000-0000-0000-0000-000000000005",
      code: "24UC0009",
      title: "Professional Communication & Soft Skills",
      departmentCode: "FED",
      lectureHours: 1,
      tutorialHours: 0,
      practicalHours: 2,
      skillingHours: 0,
      credits: 2,
      syllabus: "Corporate communication, Technical writing, Group discussions, Verbal ability, Technical presentations, Cross-cultural communication.",
      courseOutcomes: [
        { code: "CO1", desc: "Deliver structured technical presentations with visual aids", bloom: "Apply" },
        { code: "CO2", desc: "Compose formal engineering documentation and reports", bloom: "Create" },
      ],
      prerequisites: [],
    },
    {
      id: "c0000000-0000-0000-0000-000000000006",
      code: "24CS3105",
      title: "Cloud Computing & DevOps",
      departmentCode: "CSE",
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 2,
      skillingHours: 0,
      credits: 4,
      syllabus: "Virtualization, Docker containers, Kubernetes orchestration, AWS/GCP architecture, Terraform infrastructure as code.",
      courseOutcomes: [
        { code: "CO1", desc: "Design distributed cloud infrastructure architectures", bloom: "Create" },
        { code: "CO2", desc: "Build automated deployment pipelines with GitHub Actions", bloom: "Apply" },
      ],
      prerequisites: ["24CS2203 (Operating Systems Principles)"],
    },
  ];

  for (const c of coursesList) {
    store.courses.set(c.id, c);
  }

  // 3. Course Offerings (Semester 6, Section 12)
  const offeringsList: CourseOffering[] = [
    {
      id: "o0000000-0000-0000-0000-000000000001",
      course: coursesList[0],
      facultyName: "Dr. Rajesh Kumar",
      facultyEmail: "rajesh.kumar@faculty.nitroazard.edu.in",
      facultyCabin: "C-Block 312",
      sectionName: "Section 12",
      roomNumber: "C-Block 402",
      capacity: 65,
      enrolledCount: 62,
      semesterId: "sem-6",
    },
    {
      id: "o0000000-0000-0000-0000-000000000002",
      course: coursesList[1],
      facultyName: "Dr. Priya Sundaram",
      facultyEmail: "priya.sundaram@faculty.nitroazard.edu.in",
      facultyCabin: "C-Block 315",
      sectionName: "Section 12",
      roomNumber: "C-Block 402",
      capacity: 65,
      enrolledCount: 64,
      semesterId: "sem-6",
    },
    {
      id: "o0000000-0000-0000-0000-000000000003",
      course: coursesList[2],
      facultyName: "Dr. Rajesh Kumar",
      facultyEmail: "rajesh.kumar@faculty.nitroazard.edu.in",
      facultyCabin: "C-Block 312",
      sectionName: "Section 12",
      roomNumber: "C-Block 402",
      capacity: 65,
      enrolledCount: 60,
      semesterId: "sem-6",
    },
    {
      id: "o0000000-0000-0000-0000-000000000004",
      course: coursesList[3],
      facultyName: "Dr. Priya Sundaram",
      facultyEmail: "priya.sundaram@faculty.nitroazard.edu.in",
      facultyCabin: "C-Block 315",
      sectionName: "Section 12",
      roomNumber: "Lab C-302",
      capacity: 65,
      enrolledCount: 65,
      semesterId: "sem-6",
    },
    {
      id: "o0000000-0000-0000-0000-000000000005",
      course: coursesList[4],
      facultyName: "Dr. Rajesh Kumar",
      facultyEmail: "rajesh.kumar@faculty.nitroazard.edu.in",
      facultyCabin: "C-Block 312",
      sectionName: "Section 12",
      roomNumber: "Seminar Hall 1",
      capacity: 65,
      enrolledCount: 63,
      semesterId: "sem-6",
    },
  ];

  for (const o of offeringsList) {
    store.offerings.set(o.id, o);
  }

  // 4. Registrations
  const adityaRegs = new Set([
    "o0000000-0000-0000-0000-000000000001",
    "o0000000-0000-0000-0000-000000000002",
    "o0000000-0000-0000-0000-000000000003",
    "o0000000-0000-0000-0000-000000000004",
    "o0000000-0000-0000-0000-000000000005",
  ]);
  store.registrations.set("e0000000-0000-0000-0000-000000000001", adityaRegs);

  const ananyaRegs = new Set([
    "o0000000-0000-0000-0000-000000000001",
    "o0000000-0000-0000-0000-000000000002",
    "o0000000-0000-0000-0000-000000000003",
    "o0000000-0000-0000-0000-000000000004",
  ]);
  store.registrations.set("e0000000-0000-0000-0000-000000000002", ananyaRegs);

  // 5. Assessments for 24CS2201 (Algorithms)
  const algoAssessments: AssessmentItem[] = [
    {
      id: "a0000000-0000-0000-0000-000000000001",
      title: "In-Sem Mid-1 Examination",
      category: "in_sem_mid1",
      maxMarks: 100,
      weightage: 20,
      marksObtained: 88.5,
      feedback: "Strong recurrence solving and master theorem proof.",
      coMapped: ["CO1", "CO2"],
      isPublished: true,
    },
    {
      id: "a0000000-0000-0000-0000-000000000002",
      title: "In-Sem Mid-2 Examination",
      category: "in_sem_mid2",
      maxMarks: 100,
      weightage: 20,
      marksObtained: 84.0,
      feedback: "Good formulation for min-cut, review vertex cover reduction.",
      coMapped: ["CO3", "CO4"],
      isPublished: true,
    },
    {
      id: "a0000000-0000-0000-0000-000000000003",
      title: "Continuous Assessment 1 (Greedy / DP)",
      category: "in_sem_assignment",
      maxMarks: 100,
      weightage: 10,
      marksObtained: 95.0,
      feedback: "All test cases passed with O(n log n) efficiency.",
      coMapped: ["CO2"],
      isPublished: true,
    },
    {
      id: "a0000000-0000-0000-0000-000000000004",
      title: "Lab Record & Practical Execution",
      category: "in_sem_lab",
      maxMarks: 100,
      weightage: 10,
      marksObtained: 92.0,
      feedback: "Flawless demonstration of Bellman-Ford negative cycle detection.",
      coMapped: ["CO3"],
      isPublished: true,
    },
    {
      id: "a0000000-0000-0000-0000-000000000005",
      title: "End-Semester Theory Examination",
      category: "end_sem",
      maxMarks: 100,
      weightage: 40,
      marksObtained: 86.0,
      feedback: "Exemplary solution throughout paper.",
      coMapped: ["CO1", "CO2", "CO3", "CO4"],
      isPublished: true,
    },
  ];
  store.assessments.set("o0000000-0000-0000-0000-000000000001", algoAssessments);

  // Marks map
  for (const asmt of algoAssessments) {
    if (!store.studentMarks.has(asmt.id)) {
      store.studentMarks.set(asmt.id, new Map());
    }
    store.studentMarks.get(asmt.id)!.set("e0000000-0000-0000-0000-000000000001", asmt.marksObtained || 0);
    store.studentMarks.get(asmt.id)!.set("e0000000-0000-0000-0000-000000000002", (asmt.marksObtained || 80) + 3);
  }

  // 6. Semester Results for Aditya Verma (Semester 5 Past Record)
  const sem5Results: CourseResultSummary[] = [
    {
      courseId: "c0000000-0000-0000-0000-000000000001",
      courseCode: "24CS2201",
      courseTitle: "Design and Analysis of Algorithms",
      credits: 4,
      inSemScore: 53.2,
      endSemScore: 34.4,
      totalScore: 87.6,
      grade: "A+",
      gradePoints: 9,
      isPublished: true,
      revaluationStatus: "none",
    },
    {
      courseId: "c0000000-0000-0000-0000-000000000002",
      courseCode: "24CS2202",
      courseTitle: "Database Management Systems",
      credits: 5,
      inSemScore: 55.4,
      endSemScore: 36.8,
      totalScore: 92.2,
      grade: "O",
      gradePoints: 10,
      isPublished: true,
      revaluationStatus: "none",
    },
    {
      courseId: "c0000000-0000-0000-0000-000000000003",
      courseCode: "24CS2203",
      courseTitle: "Operating Systems Principles",
      credits: 4,
      inSemScore: 50.1,
      endSemScore: 31.0,
      totalScore: 81.1,
      grade: "A",
      gradePoints: 8,
      isPublished: true,
      revaluationStatus: "none",
    },
    {
      courseId: "c0000000-0000-0000-0000-000000000004",
      courseCode: "24CS2204",
      courseTitle: "Full Stack Web Engineering",
      credits: 5,
      inSemScore: 57.0,
      endSemScore: 38.0,
      totalScore: 95.0,
      grade: "O",
      gradePoints: 10,
      isPublished: true,
      revaluationStatus: "none",
    },
    {
      courseId: "c0000000-0000-0000-0000-000000000005",
      courseCode: "24UC0009",
      courseTitle: "Professional Communication & Soft Skills",
      credits: 2,
      inSemScore: 46.0,
      endSemScore: 35.0,
      totalScore: 81.0,
      grade: "A",
      gradePoints: 8,
      isPublished: true,
      revaluationStatus: "none",
    },
  ];
  store.semesterResults.set("e0000000-0000-0000-0000-000000000001", sem5Results);

  // 7. Timetable Slots
  store.timetable = [
    {
      id: "tt-1",
      dayOfWeek: "Monday",
      period: 1,
      startTime: "09:00",
      endTime: "09:50",
      courseCode: "24CS2201",
      courseTitle: "Design & Analysis of Algorithms",
      facultyName: "Dr. Rajesh Kumar",
      room: "C-Block 402",
    },
    {
      id: "tt-2",
      dayOfWeek: "Monday",
      period: 2,
      startTime: "09:50",
      endTime: "10:40",
      courseCode: "24CS2202",
      courseTitle: "Database Management Systems",
      facultyName: "Dr. Priya Sundaram",
      room: "C-Block 402",
    },
    {
      id: "tt-3",
      dayOfWeek: "Monday",
      period: 3,
      startTime: "11:00",
      endTime: "11:50",
      courseCode: "24CS2203",
      courseTitle: "Operating Systems Principles",
      facultyName: "Dr. Rajesh Kumar",
      room: "C-Block 402",
    },
    {
      id: "tt-4",
      dayOfWeek: "Tuesday",
      period: 1,
      startTime: "09:00",
      endTime: "09:50",
      courseCode: "24CS2204",
      courseTitle: "Full Stack Web Engineering",
      facultyName: "Dr. Priya Sundaram",
      room: "Lab C-302",
    },
    {
      id: "tt-5",
      dayOfWeek: "Tuesday",
      period: 2,
      startTime: "09:50",
      endTime: "10:40",
      courseCode: "24CS2204",
      courseTitle: "Full Stack Web Engineering (Lab)",
      facultyName: "Dr. Priya Sundaram",
      room: "Lab C-302",
    },
    {
      id: "tt-6",
      dayOfWeek: "Wednesday",
      period: 1,
      startTime: "09:00",
      endTime: "09:50",
      courseCode: "24CS2201",
      courseTitle: "Design & Analysis of Algorithms",
      facultyName: "Dr. Rajesh Kumar",
      room: "C-Block 402",
    },
    {
      id: "tt-7",
      dayOfWeek: "Wednesday",
      period: 2,
      startTime: "09:50",
      endTime: "10:40",
      courseCode: "24UC0009",
      courseTitle: "Professional Communication",
      facultyName: "Dr. Rajesh Kumar",
      room: "Seminar Hall 1",
    },
    {
      id: "tt-8",
      dayOfWeek: "Thursday",
      period: 1,
      startTime: "09:00",
      endTime: "09:50",
      courseCode: "24CS2202",
      courseTitle: "Database Management Systems",
      facultyName: "Dr. Priya Sundaram",
      room: "C-Block 402",
    },
    {
      id: "tt-9",
      dayOfWeek: "Thursday",
      period: 2,
      startTime: "09:50",
      endTime: "10:40",
      courseCode: "24CS2203",
      courseTitle: "Operating Systems Principles",
      facultyName: "Dr. Rajesh Kumar",
      room: "C-Block 402",
    },
    {
      id: "tt-10",
      dayOfWeek: "Friday",
      period: 1,
      startTime: "09:00",
      endTime: "09:50",
      courseCode: "24CS2204",
      courseTitle: "Full Stack Web Engineering",
      facultyName: "Dr. Priya Sundaram",
      room: "Lab C-302",
    },
    {
      id: "tt-11",
      dayOfWeek: "Friday",
      period: 2,
      startTime: "09:50",
      endTime: "10:40",
      courseCode: "24CS2201",
      courseTitle: "Algorithms Practical Lab",
      facultyName: "Dr. Rajesh Kumar",
      room: "Lab C-304",
    },
  ];

  // 8. Exam Schedules
  store.examSchedules = [
    {
      id: "ex-1",
      courseCode: "24CS2201",
      courseTitle: "Design and Analysis of Algorithms",
      examType: "end_sem",
      examDate: "2025-04-24",
      startTime: "10:00",
      endTime: "13:00",
      hall: "C-Block Main Examination Hall (Desk 42)",
    },
    {
      id: "ex-2",
      courseCode: "24CS2202",
      courseTitle: "Database Management Systems",
      examType: "end_sem",
      examDate: "2025-04-26",
      startTime: "10:00",
      endTime: "13:00",
      hall: "C-Block Main Examination Hall (Desk 42)",
    },
    {
      id: "ex-3",
      courseCode: "24CS2203",
      courseTitle: "Operating Systems Principles",
      examType: "end_sem",
      examDate: "2025-04-29",
      startTime: "10:00",
      endTime: "13:00",
      hall: "C-Block Main Examination Hall (Desk 42)",
    },
    {
      id: "ex-4",
      courseCode: "24CS2204",
      courseTitle: "Full Stack Web Engineering",
      examType: "end_sem",
      examDate: "2025-05-02",
      startTime: "10:00",
      endTime: "13:00",
      hall: "Lab Block Computer Center 1 (Terminal 18)",
    },
    {
      id: "ex-5",
      courseCode: "24UC0009",
      courseTitle: "Professional Communication & Soft Skills",
      examType: "end_sem",
      examDate: "2025-05-05",
      startTime: "10:00",
      endTime: "12:00",
      hall: "Seminar Hall 1",
    },
  ];

  // 9. Fee Dues & Transactions
  store.feeDues.set("e0000000-0000-0000-0000-000000000001", [
    {
      id: "fd-1",
      title: "Semester 6 Academic Tuition & Special Amenities",
      amountDue: 140000,
      amountPaid: 140000,
      dueDate: "2025-01-10",
      status: "paid",
    },
    {
      id: "fd-2",
      title: "Semester 6 Hostel & Mess Fee (Kapil Dev Block A)",
      amountDue: 46500,
      amountPaid: 46500,
      dueDate: "2025-01-10",
      status: "paid",
    },
  ]);

  store.feeTransactions.set("e0000000-0000-0000-0000-000000000001", [
    {
      id: "tx-1",
      receiptNumber: "NA-RCP-2025-08149",
      date: "2025-01-08",
      amount: 186500,
      paymentMethod: "Razorpay NetBanking / HDFC",
      status: "success",
    },
  ]);

  // Student B has pending fees to demonstrate hall ticket blocking
  store.feeDues.set("e0000000-0000-0000-0000-000000000002", [
    {
      id: "fd-3",
      title: "Semester 6 Academic Tuition Fee",
      amountDue: 140000,
      amountPaid: 90000,
      dueDate: "2025-01-10",
      status: "partial",
    },
  ]);

  // 10. Notices
  store.notices = [
    {
      id: "not-1",
      title: "End-Semester Theory Examinations Schedule Announced",
      content: "The End-Semester Theory Examinations for B.Tech Even Semester 2024-25 are scheduled to commence from 24th April 2025. Hall tickets will be issued only to candidates having zero pending fee dues and minimum 75% attendance.",
      category: "examination",
      isPinned: true,
      authorName: "Dr. K. Venkat Rao (Dean Academics)",
      date: "2025-03-20",
    },
    {
      id: "not-2",
      title: "NIRVANA 2025 - National Technical Symposium",
      content: "Department of Computer Science & Engineering invites student papers and hackathon registrations for NIRVANA 2025 scheduled on March 28-29, 2025. Cash prize pool of INR 5,00,000.",
      category: "event",
      isPinned: true,
      authorName: "Dr. Rajesh Kumar (HOD CSE)",
      date: "2025-03-15",
    },
    {
      id: "not-3",
      title: "Attendance Condonation Applications Open",
      content: "Students with overall attendance between 65.0% and 74.9% due to verified medical grounds or sanctioned university On-Duty representation may submit applications before April 15, 2025.",
      category: "academic",
      isPinned: false,
      authorName: "Academic Registration Cell",
      date: "2025-03-10",
    },
  ];

  // 11. Library Books & Borrowings
  store.libraryBooks = [
    {
      id: "b-1",
      isbn: "978-0262033848",
      title: "Introduction to Algorithms (CLRS 3rd Edition)",
      author: "Thomas H. Cormen, Charles E. Leiserson",
      category: "Computer Science",
      shelfLocation: "Stack 4, Bay B-12",
      availableCopies: 14,
      totalCopies: 20,
    },
    {
      id: "b-2",
      isbn: "978-0078022159",
      title: "Database System Concepts (7th Edition)",
      author: "Abraham Silberschatz, Henry F. Korth",
      category: "Computer Science",
      shelfLocation: "Stack 3, Bay A-08",
      availableCopies: 8,
      totalCopies: 15,
    },
    {
      id: "b-3",
      isbn: "978-0133591620",
      title: "Operating Systems: Internals and Design Principles",
      author: "William Stallings",
      category: "Computer Science",
      shelfLocation: "Stack 4, Bay C-02",
      availableCopies: 6,
      totalCopies: 12,
    },
  ];

  store.libraryBorrowings.set("e0000000-0000-0000-0000-000000000001", [
    {
      id: "lb-1",
      bookTitle: "Introduction to Algorithms (CLRS 3rd Edition)",
      isbn: "978-0262033848",
      issuedAt: "2025-02-10",
      dueDate: "2025-03-25",
      fineAmount: 0,
      status: "issued",
    },
  ]);

  // 12. Student Requests
  store.requests = [
    {
      id: "req-1",
      requestType: "on_duty",
      reason: "Smart India Hackathon 2025 Grand Finale representation at IIT Kharagpur nodal center.",
      startDate: "2025-02-18",
      endDate: "2025-02-22",
      status: "approved_by_admin",
      facultyRemarks: "Recommended for university representation. Very strong track record.",
      adminRemarks: "Sanctioned On-Duty attendance credit granted.",
      createdAt: "2025-02-10T10:30:00.000Z",
    },
    {
      id: "req-2",
      requestType: "bonafide",
      reason: "Application for passport renewal and educational bank loan certification.",
      status: "approved_by_admin",
      facultyRemarks: "Verified current bonafide 6th semester enrollment.",
      adminRemarks: "Certificate dispatched to student registered email.",
      createdAt: "2025-03-01T14:15:00.000Z",
    },
  ];

  // 13. Helpdesk Tickets
  store.helpdeskTickets = [
    {
      id: "t-1",
      category: "examination",
      subject: "Discrepancy in Mid-1 Algorithms Question 4 Total",
      description: "My Mid-1 paper shows 18/20 on paper for Q4 but portal reflected 14/20. Requested faculty review.",
      priority: "high",
      status: "resolved",
      createdAt: "2025-02-20T11:00:00.000Z",
      replies: [
        {
          id: "rep-1",
          authorName: "Dr. Rajesh Kumar",
          isStaff: true,
          message: "Verified your script. Re-tabulation discrepancy rectified from 14 to 18 on portal.",
          createdAt: "2025-02-21T09:30:00.000Z",
        },
      ],
    },
  ];

  // 14. Course Assignments
  store.assignments = [
    {
      id: "asg-1",
      offeringId: "o0000000-0000-0000-0000-000000000001",
      courseCode: "24CS2201",
      courseTitle: "Design and Analysis of Algorithms",
      title: "Lab Assignment 3: Max-Flow Min-Cut Ford-Fulkerson Implementation",
      description: "Implement Edmonds-Karp algorithm in C++ or Python with residual network visualizer. Include complexity proof in PDF report.",
      deadline: "2025-03-30T23:59:59.000Z",
      maxMarks: 10,
      attachmentUrl: "/materials/assignment_3_spec.pdf",
      submission: {
        id: "sub-1",
        fileUrl: "/submissions/2500040001_asg3.zip",
        submittedAt: "2025-03-24T18:20:00.000Z",
        marksAwarded: 9.5,
        feedback: "Clean implementation and rigorous Edmonds-Karp complexity proof.",
      },
    },
  ];

  // 15. Course Materials
  store.materials = [
    {
      id: "mat-1",
      offeringId: "o0000000-0000-0000-0000-000000000001",
      courseCode: "24CS2201",
      title: "Unit 3 Lecture Notes: Dynamic Programming & Matrix Chain Multiplication",
      description: "Detailed derivations of subproblem optimality and memoization tables.",
      fileUrl: "/materials/24CS2201_Unit3_DP.pdf",
      unitNumber: 3,
      uploadedAt: "2025-02-14",
    },
    {
      id: "mat-2",
      offeringId: "o0000000-0000-0000-0000-000000000002",
      courseCode: "24CS2202",
      title: "Unit 4: Transaction Processing & Two-Phase Locking Handout",
      description: "Concurreny control theorems and serializability graph examples.",
      fileUrl: "/materials/24CS2202_Unit4_Transactions.pdf",
      unitNumber: 4,
      uploadedAt: "2025-03-02",
    },
  ];

  // 16. Audit Log
  store.auditLogs = [
    {
      id: "aud-1",
      actorId: "e0000000-0000-0000-0000-000000000005",
      action: "EXAM_SCHEDULE_PUBLISHED",
      entityType: "exam_schedules",
      entityId: "semester-6",
      ipAddress: "172.16.4.10",
      details: "Published End-Semester Theory exam timetable for B.Tech Semester 6.",
      timestamp: "2025-03-20T09:00:00.000Z",
    },
  ];
}

// Service Methods with Role Checks and Business Logic

export class AcademicService {
  public static async getStudentAttendanceSummaries(studentId: string): Promise<AttendanceSummary[]> {
    // Calculated like KLU ERP: 75% threshold
    // 24CS2201: 40 conducted, 34 attended = 85.0% -> Eligible
    // 24CS2202: 38 conducted, 31 attended = 81.5% -> Eligible
    // 24CS2203: 36 conducted, 26 attended = 72.2% -> Condonation Needed (<75% and >=65%)
    // 24CS2204: 42 conducted, 38 attended = 90.4% -> Eligible
    // 24UC0009: 20 conducted, 18 attended = 90.0% -> Eligible

    return [
      {
        courseId: "c0000000-0000-0000-0000-000000000001",
        courseCode: "24CS2201",
        courseTitle: "Design and Analysis of Algorithms",
        conductedSessions: 40,
        attendedSessions: 34,
        percentage: 85.0,
        status: "eligible",
        shortageMargin: 5, // Can safely skip 5 more sessions while remaining >= 75%
      },
      {
        courseId: "c0000000-0000-0000-0000-000000000002",
        courseCode: "24CS2202",
        courseTitle: "Database Management Systems",
        conductedSessions: 38,
        attendedSessions: 31,
        percentage: 81.5,
        status: "eligible",
        shortageMargin: 3,
      },
      {
        courseId: "c0000000-0000-0000-0000-000000000003",
        courseCode: "24CS2203",
        courseTitle: "Operating Systems Principles",
        conductedSessions: 36,
        attendedSessions: 26,
        percentage: 72.2,
        status: "condonation_needed",
        shortageMargin: -2, // Must attend 2 consecutive classes to cross 75%
      },
      {
        courseId: "c0000000-0000-0000-0000-000000000004",
        courseCode: "24CS2204",
        courseTitle: "Full Stack Web Engineering",
        conductedSessions: 42,
        attendedSessions: 38,
        percentage: 90.4,
        status: "eligible",
        shortageMargin: 8,
      },
      {
        courseId: "c0000000-0000-0000-0000-000000000005",
        courseCode: "24UC0009",
        courseTitle: "Professional Communication",
        conductedSessions: 20,
        attendedSessions: 18,
        percentage: 90.0,
        status: "eligible",
        shortageMargin: 4,
      },
    ];
  }

  public static async checkHallTicketEligibility(studentId: string): Promise<{
    eligible: boolean;
    reasons: string[];
    attendancePercentage: number;
    pendingFeeDues: number;
  }> {
    const store = getDatabase();
    const dues = store.feeDues.get(studentId) || [];
    const pendingAmount = dues
      .filter((d) => d.status !== "paid")
      .reduce((acc, d) => acc + (d.amountDue - d.amountPaid), 0);

    const attendance = await this.getStudentAttendanceSummaries(studentId);
    const totalConducted = attendance.reduce((acc, a) => acc + a.conductedSessions, 0);
    const totalAttended = attendance.reduce((acc, a) => acc + a.attendedSessions, 0);
    const aggregateAttendance = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;

    const reasons: string[] = [];

    if (pendingAmount > 0) {
      reasons.push(`Pending fee dues of INR ${pendingAmount.toLocaleString("en-IN")} must be cleared.`);
    }

    // Check individual course attendance
    const shortageCourses = attendance.filter((a) => a.percentage < 65.0);
    if (shortageCourses.length > 0) {
      reasons.push(
        `Critical attendance shortage (<65%) in ${shortageCourses.map((c) => c.courseCode).join(", ")}. Detained from end semester exam.`
      );
    }

    const eligible = pendingAmount === 0 && shortageCourses.length === 0;

    return {
      eligible,
      reasons,
      attendancePercentage: Math.round(aggregateAttendance * 10) / 10,
      pendingFeeDues: pendingAmount,
    };
  }

  public static async getStudentTranscript(studentId: string): Promise<SemesterTranscript> {
    const store = getDatabase();
    const results = store.semesterResults.get(studentId) || [];
    const totalCredits = results.reduce((acc, r) => acc + r.credits, 0);
    const weightedPoints = results.reduce((acc, r) => acc + r.gradePoints * r.credits, 0);
    const sgpa = totalCredits > 0 ? weightedPoints / totalCredits : 0;

    return {
      semesterNumber: 5,
      academicYear: "2024-2025 Odd Semester",
      sgpa: Math.round(sgpa * 100) / 100,
      cgpa: 8.84, // Cumulative from previous semesters
      totalCredits,
      earnedCredits: totalCredits,
      results,
    };
  }

  public static async recordAuditLog(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    details: string,
    ipAddress?: string
  ) {
    const store = getDatabase();
    store.auditLogs.unshift({
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      actorId,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
      timestamp: new Date().toISOString(),
    });
  }
}
