"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  CalendarDays,
  Award,
  CreditCard,
  Library,
  Bus,
  FileCheck2,
  HelpCircle,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Users,
  CheckSquare,
  BarChart3,
  ShieldCheck,
  GraduationCap,
  Bell,
} from "lucide-react";
import { Logo } from "../ui/logo";
import { CommandMenu } from "./command-menu";
import { UserRole } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function PortalLayout({
  children,
  role,
  userName,
  userIdentifier,
}: {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userIdentifier: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Theme initialization
    const isDark = document.documentElement.classList.contains("dark") || !document.documentElement.classList.contains("light");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  const studentNav: NavItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Attendance", href: "/student/attendance", icon: <CalendarCheck className="w-4 h-4" /> },
    { label: "Timetable", href: "/student/timetable", icon: <CalendarDays className="w-4 h-4" /> },
    { label: "Courses", href: "/student/courses", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Course Registration", href: "/student/registration", icon: <FileCheck2 className="w-4 h-4" /> },
    { label: "Assignments", href: "/student/assignments", icon: <FileText className="w-4 h-4" /> },
    { label: "Examinations & Hall Ticket", href: "/student/exams", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Results & CGPA", href: "/student/results", icon: <Award className="w-4 h-4" /> },
    { label: "Fee Dues & Payments", href: "/student/fees", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Library", href: "/student/library", icon: <Library className="w-4 h-4" /> },
    { label: "Hostel & Transport", href: "/student/transport", icon: <Bus className="w-4 h-4" /> },
    { label: "Requests & NOC", href: "/student/requests", icon: <FileCheck2 className="w-4 h-4" /> },
    { label: "Helpdesk", href: "/student/helpdesk", icon: <HelpCircle className="w-4 h-4" /> },
    { label: "Faculty Feedback", href: "/student/feedback", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Profile", href: "/student/profile", icon: <User className="w-4 h-4" /> },
  ];

  const facultyNav: NavItem[] = [
    { label: "Dashboard", href: "/faculty/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Mark Attendance", href: "/faculty/attendance", icon: <CheckSquare className="w-4 h-4" /> },
    { label: "Enter & Publish Marks", href: "/faculty/marks", icon: <Award className="w-4 h-4" /> },
    { label: "Student Roster", href: "/faculty/students", icon: <Users className="w-4 h-4" /> },
    { label: "Course Materials", href: "/faculty/materials", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Leave & OD Approvals", href: "/faculty/requests", icon: <FileCheck2 className="w-4 h-4" /> },
    { label: "CO Attainment Report", href: "/faculty/analytics", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const adminNav: NavItem[] = [
    { label: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "User Management", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Timetable & Clash Engine", href: "/admin/timetable", icon: <CalendarDays className="w-4 h-4" /> },
    { label: "End-Sem Grades & Results", href: "/admin/grades", icon: <Award className="w-4 h-4" /> },
    { label: "Fee Structures & Collection", href: "/admin/fees", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Notices & Announcements", href: "/admin/notices", icon: <Bell className="w-4 h-4" /> },
    { label: "Academic Reports (CSV)", href: "/admin/reports", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Audit Logs Viewer", href: "/admin/audit-logs", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const parentNav: NavItem[] = [
    { label: "Ward Academic Overview", href: "/parent/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Attendance Record", href: "/parent/attendance", icon: <CalendarCheck className="w-4 h-4" /> },
    { label: "Semester Results", href: "/parent/results", icon: <Award className="w-4 h-4" /> },
    { label: "Fee Dues & Receipts", href: "/parent/fees", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Timetable", href: "/parent/timetable", icon: <CalendarDays className="w-4 h-4" /> },
  ];

  const navMap = {
    student: studentNav,
    faculty: facultyNav,
    admin: adminNav,
    parent: parentNav,
  };

  const navItems = navMap[role] || studentNav;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-azure-500/30">
      <CommandMenu role={role} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-16 border-b border-surface-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-raised"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Logo size="md" />
        </div>

        {/* Global Search shortcut trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
              );
            }}
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg bg-surface-subtle border border-surface-border text-xs text-text-muted hover:text-foreground hover:border-azure-500/40 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search courses, results, notices...</span>
            <kbd className="ml-2 font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-surface-border">
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User profile info & logout */}
          <div className="flex items-center gap-3 pl-2 border-l border-surface-border">
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-foreground leading-tight">{userName}</p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-mono text-azure-400 font-medium">
                  {role}
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  ({userIdentifier})
                </span>
              </div>
            </div>

            <Link
              href="/auth/logout"
              className="p-2 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="End session"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-30 w-64 border-r border-surface-border bg-surface flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              {role.toUpperCase()} PORTAL
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-azure-500/10 text-azure-400 border border-azure-500/20"
                      : "text-text-secondary hover:text-foreground hover:bg-surface-raised"
                  }`}
                >
                  <span className={isActive ? "text-azure-400" : "text-text-muted"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-3 border-t border-surface-border text-center">
            <p className="text-[10px] text-text-muted font-mono">
              Nitro Azard ERP v2.4 • KL Ref
            </p>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 z-20 bg-[#0B1220]/70 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-16 lg:pb-0">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-surface-border flex items-center justify-around h-14 px-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
                isActive ? "text-azure-400" : "text-text-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="mt-1 truncate max-w-[60px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
