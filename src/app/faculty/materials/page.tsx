"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, BookOpen, FileText, Download, Plus } from "lucide-react";

export default function FacultyMaterialsPage() {
  const [materials, setMaterials] = useState([
    {
      id: "mat-1",
      course: "24CS2201",
      title: "Unit 3 Lecture Notes: Dynamic Programming & Optimal Substructure",
      unit: 3,
      date: "2025-02-14",
    },
    {
      id: "mat-2",
      course: "24CS2201",
      title: "Unit 4 Handout: Maximum Flow, Min-Cut & Ford-Fulkerson",
      unit: 4,
      date: "2025-03-02",
    },
  ]);

  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState(1);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newMat = {
      id: `mat-${Date.now()}`,
      course: "24CS2201",
      title,
      unit,
      date: new Date().toISOString().split("T")[0],
    };
    setMaterials([newMat, ...materials]);
    setTitle("");
    alert("Study material uploaded and made accessible to enrolled students.");
  };

  return (
    <PortalLayout role="faculty" userName="Dr. Rajesh Kumar" userIdentifier="KLU1042">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Course Material & Handouts Management</h1>
          <p className="text-xs text-text-muted mt-1">
            Upload unit-wise lecture notes, slide decks, lab manuals, and reference papers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <Card>
            <CardHeader title="Upload New Material" subtitle="Section 12 • 24CS2201" />
            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <Input
                label="Document Title"
                placeholder="e.g. Unit 5 Graph Algorithms Reference"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div>
                <label className="block text-text-secondary font-medium mb-1">Unit Number</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-surface-subtle border border-surface-border rounded-lg text-foreground text-xs"
                >
                  <option value={1}>Unit 1</option>
                  <option value={2}>Unit 2</option>
                  <option value={3}>Unit 3</option>
                  <option value={4}>Unit 4</option>
                  <option value={5}>Unit 5</option>
                </select>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">File Attachment (.PDF)</label>
                <input
                  type="file"
                  required
                  className="w-full text-xs text-text-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-raised file:text-foreground hover:file:bg-surface-subtle"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full gap-2 text-xs">
                <Upload className="w-4 h-4" /> Publish Material
              </Button>
            </form>
          </Card>

          {/* Published Materials List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Currently Published Documents" subtitle="Active Course Materials" />
              <div className="space-y-3">
                {materials.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-azure-400">{m.course}</span>
                        <Badge variant="info">Unit {m.unit}</Badge>
                        <span className="text-text-muted text-[11px]">• Uploaded {m.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-foreground mt-1">{m.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Simulating download of ${m.title}`)}
                        className="p-2 rounded-lg bg-surface border border-surface-border text-azure-400 hover:bg-surface-raised"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
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
