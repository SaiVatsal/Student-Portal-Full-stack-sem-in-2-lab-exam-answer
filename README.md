CREDIT BASED ACADEMIC MANAGEMENT SYSTEM
FEATURES AND OVERVIEW
Academic Management

The system follows a credit based academic structure commonly used in Indian universities.

Academic programmes are organised into departments, batches, semesters, sections and courses.

Every course follows the Indian L T P S C format, which includes lectures, tutorials, practicals, self study and credits.

Assessment and Grading System

The system follows a structured assessment process where students are evaluated throughout the semester.

The In Semester assessment carries 60 percent of the total marks.

Mid Semester Examination 1 carries 20 percent.

Mid Semester Examination 2 carries 20 percent.

Continuous Assignments carry 10 percent.

Laboratory Implementation carries 10 percent.

End Semester Examination carries 40 percent.

The system automatically calculates SGPA and CGPA using a 10 point grading scale.

Attendance and Hall Ticket Management

The system automatically tracks student attendance for every course.

Students must maintain at least 75 percent attendance to become eligible for examinations.

The system calculates how many classes a student can miss while maintaining the required attendance percentage.

Hall tickets are issued only when students have cleared all fee dues and meet the minimum attendance requirement or have received attendance condonation.

Student Features

Students can access their personal dashboard and view their academic information.

They can check real time attendance and calculate their remaining attendance allowance.

They can view upcoming examinations and download hall tickets.

They can check In Semester marks and End Semester grading sheets.

They can download fee receipts and check pending fee dues.

They can register for courses and view library borrowing details.

They can check hostel and transport information.

They can submit leave and on duty requests.

They can raise grievance tickets and track the progress of their complaints.

Staff Features

Staff members can manage their assigned courses and academic activities.

They can mark attendance using keyboard friendly input and edit attendance within the permitted 24 hour period.

They can enter In Semester marks and lock grades after completing the evaluation process.

They can view student details and distribute study materials.

They can review and approve student leave and on duty requests.

They can monitor Course Outcome achievement for their assigned subjects.

Admin Features

Administrators can manage student and staff accounts.

They can upload student lists using CSV files and receive individual error messages for incorrect rows.

They can schedule examinations and create timetables without overlapping classes.

They can process End Semester results and lock them after verification.

They can manage fee structures and reconcile online payments through Razorpay.

They can publish university circulars and announcements.

They can access read only audit logs to monitor important system activities.

Parent Features

Parents receive a separate dashboard with limited read only access to their child's academic information.

They can monitor attendance records and examination grades.

They can check pending fee dues and view the academic timetable.

Parents cannot modify academic records or perform administrative activities.

Global Search

The system includes a global search feature that can be opened using the Ctrl and K keyboard shortcut.

Users can quickly search for courses, circulars, fee details and other information based on their permissions.

SECURITY AND AUTHENTICATION
Secure Login System

Students can log in using their Student ID or registered email address.

Staff members and administrators must complete two factor authentication using a time based one time password system based on RFC 6238.

Staff and administrators are also provided with recovery keys to regain access when necessary.

Session Management

The system uses encrypted HTTP only cookies with SameSite Lax protection to maintain secure user sessions.

Sessions automatically expire after 30 minutes of inactivity or a maximum duration of 12 hours.

Sensitive operations require users to verify their identity again before proceeding.

Login Protection

The system protects against repeated login attempts.

If an account or IP address receives five consecutive failed login attempts, further login attempts are temporarily locked.

Generic error messages are displayed to prevent attackers from discovering whether an account exists.

Application Security

The application follows OWASP Top 10 security recommendations.

It includes strict Content Security Policy settings and HTTP Strict Transport Security.

Additional security measures include X Frame Options DENY, Cross Site Request Forgery protection and append only audit logs.

Database Security

The application uses Next.js Edge Middleware for route protection.

PostgreSQL Row Level Security policies are applied across all database tables to ensure users can access only the information permitted by their roles.

GETTING STARTED LOCALLY
Step 1 Install Dependencies

Open your terminal inside the project directory and run:

npm install

Step 2 Create the Environment File

Create your local environment configuration file using:

cp .env.example .env.local

Configure the required environment variables before starting the application.

If you are running the application locally without a Supabase database, standalone development mode will be enabled by default and realistic sample records will be generated.

Step 3 Run Tests and Security Checks

Execute the following command:

npm test

Step 4 Start the Development Server

Run the following command:

npm run dev

Open your browser and visit:

http://localhost:3000

TESTING ACCOUNTS

The following accounts are provided for testing different user roles.

Student Account

Username: 2500040001

Email: aditya.verma@student.nitroazard.edu.in

Password: NitroStudent2025!

Staff Account

Username: KLU1042

Email: rajesh.kumar@faculty.nitroazard.edu.in

Password: NitroFaculty2025!

MFA Code: 123456

Admin Account

Username: KLU_ADMIN_01

Email: admin.academics@nitroazard.edu.in

Password: NitroAdmin2025!

MFA Code: 123456

Parent Account

Username: suresh.verma@parents.nitroazard.edu.in

Password: NitroParent2025!

The login page also provides quick login options for testing each available user role.

These are development credentials and should never be used in a production environment.

SUPABASE DATABASE SETUP
Step 1 Create a Supabase Account

Visit https://supabase.com and create an account.

Create a new project for your academic management system.

Step 2 Run Database Migrations

Open the SQL Editor in your Supabase project and execute the following files in the given order.

First run:

supabase/migrations/20240101000000_schema.sql

This file creates the database tables and relationships required by the application.

Next run:

supabase/migrations/20240101000001_rls_policies.sql

This file configures Row Level Security policies to protect academic and personal information.

Finally run:

supabase/seed.sql

This file inserts realistic sample data representing an Indian deemed university.

Step 3 Configure Environment Variables

Add your Supabase project credentials and security settings to the .env.local file.

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

SESSION_SECRET=your-32-character-cryptographic-secret

Keep your service role key and session secret private. Never expose them in frontend code or commit them to GitHub.

VERCEL DEPLOYMENT
Step 1 Push Your Project to GitHub

Create a GitHub or GitLab repository for your project.

Upload your complete source code and push all required files to the repository.

Step 2 Import Your Project into Vercel

Visit https://vercel.com and sign in using your GitHub or GitLab account.

Select the repository containing your academic management system and import it into Vercel.

Step 3 Configure Environment Variables

Open your Vercel project settings and navigate to the Environment Variables section.

Add all required environment variables from your .env.example file.

Make sure the Supabase credentials and session secret are correctly configured.

Step 4 Deploy the Application

Once all environment variables have been configured, start the deployment process.

Vercel will automatically build and deploy the application using the Next.js App Router and Edge Middleware.

After successful deployment, you will receive a public application URL that can be used to access your academic management system from anywhere.

PROJECT OVERVIEW

This project provides a complete academic management platform designed for Indian universities.

It brings students, faculty members, parents and administrators together through a single secure platform.

By combining attendance tracking, examination management, fee processing, academic grading and role based access control, the system helps universities manage their daily academic operations more efficiently.
