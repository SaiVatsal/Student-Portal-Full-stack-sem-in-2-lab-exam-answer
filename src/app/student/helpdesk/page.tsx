"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { HelpCircle, MessageSquare, Send, Plus, CheckCircle2 } from "lucide-react";

interface TicketReply {
  id: string;
  authorName: string;
  isStaff: boolean;
  message: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  category: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  replies: TicketReply[];
}

export default function StudentHelpdeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TICK-8402",
      category: "Examination",
      subject: "Discrepancy in Mid-1 Algorithms Question 4 Total",
      description: "My Mid-1 paper shows 18/20 on paper for Q4 but portal reflected 14/20. Requested faculty review.",
      priority: "high",
      status: "resolved",
      createdAt: "2025-02-20",
      replies: [
        {
          id: "r-1",
          authorName: "Dr. Rajesh Kumar (HOD CSE)",
          isStaff: true,
          message: "Verified your paper script. Discrepancy rectified from 14 to 18 on portal.",
          createdAt: "2025-02-21 09:30 AM",
        },
      ],
    },
  ]);

  const [activeTicketId, setActiveTicketId] = useState<string>("TICK-8402");
  const [replyMessage, setReplyMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("academic");
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    const newReply: TicketReply = {
      id: `rep-${Date.now()}`,
      authorName: "Aditya Verma (You)",
      isStaff: false,
      message: replyMessage,
      createdAt: "Just now",
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicketId ? { ...t, replies: [...t.replies, newReply] } : t
      )
    );
    setReplyMessage("");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newT: Ticket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      subject: newSubject,
      description: newDescription,
      priority: "medium",
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
      replies: [],
    };
    setTickets([newT, ...tickets]);
    setActiveTicketId(newT.id);
    setIsModalOpen(false);
    setNewSubject("");
    setNewDescription("");
  };

  return (
    <PortalLayout role="student" userName="Aditya Verma" userIdentifier="2500040001">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Helpdesk & Grievance Tickets</h1>
            <p className="text-xs text-text-muted mt-1">
              Direct resolution desk for Examination, Fee, Hostel, and Academic queries
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="gap-2 text-xs">
            <Plus className="w-4 h-4" /> Raise Support Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tickets List */}
          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTicketId(t.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTicket?.id === t.id
                    ? "bg-surface-raised border-azure-500 shadow-sm"
                    : "bg-surface border-surface-border hover:border-surface-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-azure-400 font-bold">{t.id}</span>
                  <Badge variant={t.status === "resolved" ? "success" : "warning"}>
                    {t.status.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground mt-2 line-clamp-1">{t.subject}</h4>
                <p className="text-[11px] text-text-muted mt-1 line-clamp-2">{t.description}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted">
                  <span>{t.category}</span>
                  <span>{t.createdAt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Threaded Replies & Response Box */}
          <div className="lg:col-span-2">
            {activeTicket ? (
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="pb-4 border-b border-surface-border flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs text-azure-400 font-bold">{activeTicket.id}</span>
                      <h2 className="text-base font-bold text-foreground mt-0.5">{activeTicket.subject}</h2>
                      <p className="text-xs text-text-muted mt-1">Category: {activeTicket.category} • Logged on {activeTicket.createdAt}</p>
                    </div>
                    <Badge variant={activeTicket.status === "resolved" ? "success" : "warning"}>
                      {activeTicket.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-3 my-4 rounded-lg bg-surface-subtle text-xs text-text-secondary leading-relaxed">
                    <strong className="text-foreground block mb-1">Original Grievance:</strong>
                    {activeTicket.description}
                  </div>

                  {/* Threaded Discussion */}
                  <div className="space-y-3 my-4">
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                      Conversation Thread
                    </span>
                    {activeTicket.replies.length === 0 ? (
                      <p className="text-xs text-text-muted italic">Ticket submitted. Awaiting staff assigned response.</p>
                    ) : (
                      activeTicket.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-3 rounded-xl border text-xs ${
                            rep.isStaff
                              ? "bg-azure-500/10 border-azure-500/30 text-foreground"
                              : "bg-surface-raised border-surface-border text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold flex items-center gap-1.5">
                              {rep.authorName}
                              {rep.isStaff && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-azure-500 text-white font-mono">
                                  STAFF
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-text-muted">{rep.createdAt}</span>
                          </div>
                          <p className="mt-1 leading-relaxed">{rep.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="mt-4 pt-4 border-t border-surface-border flex gap-2">
                  <Input
                    placeholder="Type your response or query update..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="primary" className="gap-1.5 text-xs shrink-0">
                    <Send className="w-4 h-4" /> Reply
                  </Button>
                </form>
              </Card>
            ) : null}
          </div>
        </div>

        {/* Modal for New Ticket */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Raise Grievance / Support Ticket"
          description="Directly dispatches your ticket to the responsible department head."
        >
          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div>
              <label className="block text-text-secondary font-medium mb-1">Ticket Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-10 px-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs focus:outline-none focus:border-azure-500"
              >
                <option value="Academic">Academic Curriculum</option>
                <option value="Examination">Examination & Marks</option>
                <option value="Finance">Finance & Fee Dues</option>
                <option value="Hostel">Hostel & Mess Facilities</option>
                <option value="Transport">Transport & Bus Passes</option>
                <option value="IT Support">ERP & IT Services</option>
              </select>
            </div>

            <Input
              label="Subject / Issue Summary"
              placeholder="e.g. Mid-2 Marks Tabulation Discrepancy"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              required
            />

            <div>
              <label className="block text-text-secondary font-medium mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Explain the issue with relevant details and dates..."
                className="w-full p-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs focus:outline-none focus:border-azure-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PortalLayout>
  );
}
