"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Calendar, Award, CreditCard, Clock, FileText, HelpCircle, Shield, X } from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  href: string;
  keywords?: string[];
}

export function CommandMenu({ role = "student" }: { role?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const commands: CommandItem[] = [
    // Navigation
    { id: "dash", title: "Dashboard Overview", category: "Navigation", icon: <Clock className="w-4 h-4 text-azure-400" />, href: `/${role}/dashboard` },
    { id: "att", title: "Attendance & Shortage Calculator", category: "Academics", icon: <Calendar className="w-4 h-4 text-emerald-400" />, href: "/student/attendance" },
    { id: "courses", title: "Registered Courses & Outlines", category: "Academics", icon: <BookOpen className="w-4 h-4 text-azure-400" />, href: "/student/courses" },
    { id: "results", title: "In-Sem & End-Sem Exam Results", category: "Exams", icon: <Award className="w-4 h-4 text-amber-400" />, href: "/student/results" },
    { id: "hallticket", title: "Hall Ticket Download (Exam Gate)", category: "Exams", icon: <Shield className="w-4 h-4 text-azure-400" />, href: "/student/exams" },
    { id: "fees", title: "Fee Dues & Payment Receipts", category: "Finance", icon: <CreditCard className="w-4 h-4 text-hot" />, href: "/student/fees" },
    { id: "reg", title: "Semester Course Registration", category: "Academics", icon: <FileText className="w-4 h-4 text-azure-400" />, href: "/student/registration" },
    { id: "help", title: "Helpdesk & Grievance Tickets", category: "Support", icon: <HelpCircle className="w-4 h-4 text-text-muted" />, href: "/student/helpdesk" },

    // Direct Course jumps
    { id: "c-algo", title: "24CS2201 - Design and Analysis of Algorithms", category: "Courses", icon: <BookOpen className="w-4 h-4 text-azure-400" />, href: "/student/courses#24CS2201", keywords: ["algorithms", "daa"] },
    { id: "c-dbms", title: "24CS2202 - Database Management Systems", category: "Courses", icon: <BookOpen className="w-4 h-4 text-azure-400" />, href: "/student/courses#24CS2202", keywords: ["database", "sql"] },
    { id: "c-os", title: "24CS2203 - Operating Systems Principles", category: "Courses", icon: <BookOpen className="w-4 h-4 text-azure-400" />, href: "/student/courses#24CS2203", keywords: ["operating systems", "kernel"] },
    { id: "c-web", title: "24CS2204 - Full Stack Web Engineering", category: "Courses", icon: <BookOpen className="w-4 h-4 text-azure-400" />, href: "/student/courses#24CS2204", keywords: ["nextjs", "react"] },
  ];

  const filtered = query.trim() === ""
    ? commands
    : commands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase()) ||
          c.keywords?.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center px-4 py-3 border-b border-surface-border gap-3">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a course code, result, fee, or service... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-text-muted hover:text-foreground hover:bg-surface-raised"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-surface-border/50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted">
              No matching records found for "{query}".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setIsOpen(false);
                  router.push(item.href);
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-raised cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-surface-subtle group-hover:bg-azure-500/10 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-azure-400 transition-colors">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-text-muted group-hover:text-azure-400">Jump →</span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-surface-subtle border-t border-surface-border text-[11px] text-text-muted">
          <span>Navigate with mouse or Tab</span>
          <span className="font-mono">Nitro Azard Universal Command Bar</span>
        </div>
      </div>
    </div>
  );
}
