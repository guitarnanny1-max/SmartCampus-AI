"use client";

import { RoleProvider, useRole } from "../context/RoleContext";
import Sidebar from "./Sidebar";

function DashboardContent({ schoolName, subdomain, children }: { schoolName: string; subdomain: string; children: React.ReactNode }) {
  const { role, setRole } = useRole();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "sans-serif" }}>
      <Sidebar schoolName={schoolName} subdomain={subdomain} role={role} setRole={setRole} />
      
      <main style={{ flex: 1, padding: "40px", overflowY: "auto", maxWidth: "1400px" }}>
        {role === "STUDENT" && (
          <div style={{ background: "#dbeafe", color: "#1e40af", padding: "12px 20px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold", border: "1px solid #bfdbfe" }}>
            🎓 Student Portal View: Accessing personal academic summary, grade transcripts, and campus announcements.
          </div>
        )}
        {role === "FACULTY" && (
          <div style={{ background: "#fef3c7", color: "#92400e", padding: "12px 20px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold", border: "1px solid #fde68a" }}>
            🏫 Faculty View: Active class rosters and department maintenance logging enabled.
          </div>
        )}
        {role === "ADMIN" && (
          <div style={{ background: "#e2e8f0", color: "#334155", padding: "12px 20px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold", border: "1px solid #cbd5e1" }}>
            👑 Administrator Master View: Full infrastructure telemetry, tenant settings, and incident control active.
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
}

export default function DashboardShell({ schoolName, subdomain, children }: { schoolName: string; subdomain: string; children: React.ReactNode }) {
  return (
    <RoleProvider>
      <DashboardContent schoolName={schoolName} subdomain={subdomain}>
        {children}
      </DashboardContent>
    </RoleProvider>
  );
}
