import React from "react";
import { getSession } from "@/lib/security/session";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Home, MapPin, Phone, ShieldCheck, Clock } from "lucide-react";

export default async function StudentTransportPage() {
  const session = await getSession();
  const studentName = session?.fullName || "Aditya Verma";
  const identifier = session?.identifier || "2500040001";

  const busStops = [
    { stop: "Vijayawada Benz Circle", time: "07:30 AM" },
    { stop: "PVP Square Mall", time: "07:42 AM" },
    { stop: "Varadhi Junction", time: "07:55 AM" },
    { stop: "Tadepalli Highway Crossing", time: "08:10 AM" },
    { stop: "University Main Gate", time: "08:35 AM" },
  ];

  return (
    <PortalLayout role="student" userName={studentName} userIdentifier={identifier}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Transport & Hostel Amenities</h1>
          <p className="text-xs text-text-muted mt-1">
            RFID Bus Pass Allotment • Hostel Room Allocation & Warden Details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hostel Allotment Card */}
          <Card>
            <CardHeader
              title="Hostel Allotment Details"
              subtitle="Residential Services & Room Allocation"
            />
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-azure-400" />
                    <span className="font-bold text-sm text-foreground">Kapil Dev Hostel (Block A)</span>
                  </div>
                  <Badge variant="success">Allotted</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-text-muted">Room Number:</span>
                    <p className="font-bold text-foreground text-sm font-mono mt-0.5">A-304 (AC 3-Sharing)</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Bed Allotment:</span>
                    <p className="font-bold text-foreground text-sm font-mono mt-0.5">Bed #2 (Window Side)</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Chief Warden:</span>
                    <p className="font-semibold text-foreground mt-0.5">Prof. M. Venkateswarlu</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Warden Helpline:</span>
                    <p className="font-mono text-azure-400 font-semibold mt-0.5">+91 94400 55102</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Transport Bus Pass Card */}
          <Card>
            <CardHeader
              title="University Bus Pass"
              subtitle="Daily Scheduled Fleet Route & Timings"
            />
            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-azure-400" />
                  <span className="font-bold text-sm text-foreground">Route 14 (Vijayawada Express)</span>
                </div>
                <Badge variant="success">Active Pass</Badge>
              </div>

              <div className="mt-3 text-xs space-y-1 text-text-muted">
                <p>Driver: <strong>Mr. K. Narayana</strong> • Bus Reg: <strong>AP 16 TE 4821</strong></p>
                <p>Driver Contact: <strong className="font-mono text-azure-400">+91 98492 88124</strong></p>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border">
                <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block mb-2">
                  Scheduled Boarding Stops & Timings
                </span>
                <div className="space-y-2">
                  {busStops.map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-surface-border/40 last:border-0">
                      <span className="text-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-hot" /> {st.stop}
                      </span>
                      <span className="font-mono text-azure-400 font-semibold">{st.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
