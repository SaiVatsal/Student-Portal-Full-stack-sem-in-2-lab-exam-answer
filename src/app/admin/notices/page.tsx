"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Plus, Pin } from "lucide-react";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([
    {
      id: "not-1",
      title: "End-Semester Theory Examinations Schedule Announced",
      content: "The End-Semester Theory Examinations for B.Tech Even Semester 2024-25 commence from 24th April 2025.",
      category: "Examination",
      target: "All Students & Faculty",
      isPinned: true,
      date: "2025-03-20",
    },
    {
      id: "not-2",
      title: "NIRVANA 2025 - National Technical Symposium",
      content: "Department of CSE invites hackathon and paper presentations with prize pool of INR 5,00,000.",
      category: "Event",
      target: "Students",
      isPinned: true,
      date: "2025-03-15",
    },
  ]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Academic");
  const [content, setContent] = useState("");

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice = {
      id: `not-${Date.now()}`,
      title,
      content,
      category,
      target: "All Students",
      isPinned: false,
      date: new Date().toISOString().split("T")[0],
    };
    setNotices([newNotice, ...notices]);
    setTitle("");
    setContent("");
    alert("University notice broadcasted across portals.");
  };

  return (
    <PortalLayout role="admin" userName="Polimera Sai Vatsal" userIdentifier="2500040224">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">University Notices & Broadcast Circulars</h1>
          <p className="text-xs text-text-muted mt-1">
            Publish official announcements, academic schedules, holiday notices, and symposia bulletins
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Publish New Announcement" subtitle="Immediate broadcast to targeted roles" />
            <form onSubmit={handlePostNotice} className="space-y-4 text-xs">
              <Input
                label="Circular Title"
                placeholder="e.g. Schedule for Mid-2 Retest Examination"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div>
                <label className="block text-text-secondary font-medium mb-1">Notice Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs"
                >
                  <option value="Academic">Academic Curriculum</option>
                  <option value="Examination">Examination & Results</option>
                  <option value="Placement">Training & Placement</option>
                  <option value="Event">Technical / Cultural Event</option>
                  <option value="General">General Administrative</option>
                </select>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Official notice body..."
                  className="w-full p-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full text-xs">
                Broadcast Circular
              </Button>
            </form>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Active University Notices" subtitle="Broadcasted on student, faculty & parent dashboards" />
              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-azure-400 font-bold uppercase">{n.category}</span>
                        {n.isPinned && (
                          <span className="flex items-center gap-1 text-[10px] text-hot font-bold">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-muted">{n.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-foreground mt-1.5">{n.title}</h4>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
