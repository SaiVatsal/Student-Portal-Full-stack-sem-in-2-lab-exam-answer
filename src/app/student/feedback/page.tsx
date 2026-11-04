"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function StudentFeedbackPage() {
  const [courses, setCourses] = useState([
    {
      id: "c-1",
      code: "24CS2201",
      title: "Design and Analysis of Algorithms",
      faculty: "Dr. Rajesh Kumar",
      submitted: false,
    },
    {
      id: "c-2",
      code: "24CS2202",
      title: "Database Management Systems",
      faculty: "Dr. Priya Sundaram",
      submitted: true,
    },
  ]);

  const [activeCourseId, setActiveCourseId] = useState("c-1");
  const [q1, setQ1] = useState(5);
  const [q2, setQ2] = useState(5);
  const [q3, setQ3] = useState(4);
  const [q4, setQ4] = useState(5);
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCourses((prev) =>
      prev.map((c) => (c.id === activeCourseId ? { ...c, submitted: true } : c))
    );
    alert("Anonymous feedback submitted securely. Your identity is cryptographically unlinked.");
  };

  const activeCourse = courses.find((c) => c.id === activeCourseId);

  return (
    <PortalLayout role="student" userName="Aditya Verma" userIdentifier="2500040001">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Course & Faculty Feedback</h1>
          <p className="text-xs text-text-muted mt-1">
            End-Semester Academic Quality Assurance • 100% Anonymous • Exactly One Evaluation Per Registered Course
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses List */}
          <div className="space-y-3">
            {courses.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveCourseId(c.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeCourseId === c.id
                    ? "bg-surface-raised border-azure-500 shadow-sm"
                    : "bg-surface border-surface-border hover:border-surface-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-azure-400">{c.code}</span>
                  <Badge variant={c.submitted ? "success" : "warning"}>
                    {c.submitted ? "Evaluated" : "Pending"}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground mt-2">{c.title}</h4>
                <p className="text-[11px] text-text-muted mt-0.5">Faculty: {c.faculty}</p>
              </div>
            ))}
          </div>

          {/* Feedback Form */}
          <div className="lg:col-span-2">
            {activeCourse ? (
              <Card>
                <div className="pb-4 border-b border-surface-border flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-azure-400 font-bold">{activeCourse.code}</span>
                    <h2 className="text-base font-bold text-foreground mt-0.5">{activeCourse.title}</h2>
                    <p className="text-xs text-text-muted mt-0.5">Instructor: {activeCourse.faculty}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" /> Anonymous Evaluation
                  </div>
                </div>

                {activeCourse.submitted ? (
                  <div className="py-12 text-center text-xs text-text-muted">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-foreground">Feedback Already Recorded</p>
                    <p className="mt-1">Thank you. Your evaluation contributes to university academic audit reports.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 my-4 text-xs">
                    <div>
                      <label className="block text-foreground font-semibold mb-1.5">
                        1. Pace of Syllabus Coverage & Conceptual Depth (1 to 5 Stars)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setQ1(star)}
                            className={`p-2 rounded-lg border text-sm font-bold transition-all ${
                              q1 >= star
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                : "bg-surface-subtle text-text-muted border-surface-border"
                            }`}
                          >
                            ★ {star}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-foreground font-semibold mb-1.5">
                        2. Clarity of Mathematical Derivations & Code Demonstrations
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setQ2(star)}
                            className={`p-2 rounded-lg border text-sm font-bold transition-all ${
                              q2 >= star
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                : "bg-surface-subtle text-text-muted border-surface-border"
                            }`}
                          >
                            ★ {star}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-foreground font-semibold mb-1.5">
                        3. Promptness & Transparency in Continuous Assessment Grading
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setQ3(star)}
                            className={`p-2 rounded-lg border text-sm font-bold transition-all ${
                              q3 >= star
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                : "bg-surface-subtle text-text-muted border-surface-border"
                            }`}
                          >
                            ★ {star}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-foreground font-semibold mb-1.5">
                        Constructive Qualitative Feedback (Optional & Anonymous)
                      </label>
                      <textarea
                        rows={3}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Suggestions for laboratory exercises, textbook references, or pacing..."
                        className="w-full p-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs focus:outline-none focus:border-azure-500"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" variant="primary">
                        Submit Anonymous Evaluation
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
