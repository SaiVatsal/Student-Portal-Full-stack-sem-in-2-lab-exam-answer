import React from "react";
import { getSession } from "@/lib/security/session";
import { getDatabase } from "@/server/db";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Download, CheckCircle, FileText, Layers } from "lucide-react";

export default async function StudentCoursesPage() {
  const session = await getSession();
  const studentName = session?.fullName || "Aditya Verma";
  const identifier = session?.identifier || "2500040001";

  const store = getDatabase();
  const offerings = Array.from(store.offerings.values());
  const materials = store.materials;

  return (
    <PortalLayout role="student" userName={studentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Registered Courses & Curriculum</h1>
          <p className="text-xs text-text-muted mt-1">
            L-T-P-S Credit Structure • Course Outcomes (COs) mapped to Bloom's Taxonomy • Course Materials
          </p>
        </div>

        <div className="space-y-6">
          {offerings.map((offering) => {
            const course = offering.course;
            const courseMaterials = materials.filter((m) => m.offeringId === offering.id || m.courseCode === course.code);

            return (
              <Card key={offering.id} id={course.code} className="scroll-mt-20">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-surface-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-azure-400">
                        {course.code}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-raised border border-surface-border font-mono">
                        L: {course.lectureHours} | T: {course.tutorialHours} | P: {course.practicalHours} | S: {course.skillingHours} | C: {course.credits}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold font-display text-white mt-1">
                      {course.title}
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                      Department: {course.departmentCode} • Section: {offering.sectionName} • Room: {offering.roomNumber}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-xs min-w-[240px]">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <User className="w-4 h-4 text-azure-400" />
                      <span>{offering.facultyName}</span>
                    </div>
                    <p className="text-text-muted mt-1 text-[11px]">{offering.facultyEmail}</p>
                    <p className="text-text-muted text-[11px]">Cabin: {offering.facultyCabin}</p>
                  </div>
                </div>

                {/* Syllabus Description */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Course Syllabus Outline
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {course.syllabus}
                  </p>
                </div>

                {/* Course Outcomes (COs) */}
                <div className="mt-4 pt-4 border-t border-surface-border/60">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-azure-400" />
                    Course Outcomes (CO) Attainment Mapping
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {course.courseOutcomes.map((co) => (
                      <div
                        key={co.code}
                        className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="font-mono font-bold text-azure-400 mr-2">{co.code}:</span>
                          <span className="text-foreground">{co.desc}</span>
                        </div>
                        <Badge variant="info">{co.bloom}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Materials & Handouts */}
                <div className="mt-4 pt-4 border-t border-surface-border/60">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Course Handouts & Study Materials
                  </h4>
                  {courseMaterials.length === 0 ? (
                    <p className="text-xs text-text-muted italic">No study materials uploaded for this course yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {courseMaterials.map((mat) => (
                        <div
                          key={mat.id}
                          className="p-3 rounded-lg bg-surface-raised border border-surface-border flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-semibold text-foreground">{mat.title}</div>
                            <div className="text-[11px] text-text-muted">Unit {mat.unitNumber} • Uploaded {mat.uploadedAt}</div>
                          </div>
                          <a
                            href={mat.fileUrl}
                            download
                            className="p-2 rounded-lg bg-azure-500/10 hover:bg-azure-500/20 text-azure-400 transition-colors"
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
