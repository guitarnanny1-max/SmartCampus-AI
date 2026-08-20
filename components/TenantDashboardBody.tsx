"use client";

import { useRole } from "../context/RoleContext";
import EnergyTelemetryWidget from "./EnergyTelemetryWidget";
import IncidentTicketWidget from "./IncidentTicketWidget";
import ExportButton from "./ExportButton";
import AICopilotChat from "./AICopilotChat";
import AnnouncementsWidget from "./AnnouncementsWidget";
import AnalyticsWidget from "./AnalyticsWidget";

export default function TenantDashboardBody({ school }: { school: any }) {
  const { role } = useRole();

  const avgCgpa = school.students.length > 0 
    ? (school.students.reduce((acc: number, s: any) => acc + s.cgpa, 0) / school.students.length).toFixed(2) 
    : "N/A";

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "20px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#64748b" }}>{role === "STUDENT" ? "Peer Group Size" : "Enrolled Students"}</h4>
          <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>{school.students.length}</p>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#64748b" }}>{role === "STUDENT" ? "Campus Average CGPA" : "Average CGPA"}</h4>
          <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>{avgCgpa}</p>
        </div>
        
        {role !== "STUDENT" && (
          <>
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#64748b" }}>Monitored Facilities</h4>
              <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>{school.facilities.length}</p>
            </div>
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#64748b" }}>Active Alerts</h4>
              <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#dc2626" }}>{school.alerts.length}</p>
            </div>
          </>
        )}
      </div>

      <AnalyticsWidget students={school.students} />

      {role !== "STUDENT" && (
        <div id="energy">
          <EnergyTelemetryWidget />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: role === "STUDENT" ? "1fr" : "2fr 1fr", gap: "20px", marginTop: "20px" }}>
        <div id="students" style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h3 style={{ margin: 0 }}>{role === "STUDENT" ? "🎓 Campus Student Directory" : "🎓 Enrolled Students Roster"}</h3>
            {role !== "STUDENT" && <ExportButton schoolId={school.id} />}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", color: "#475569" }}>
                <th style={{ padding: "10px" }}>Name</th>
                <th style={{ padding: "10px" }}>Roll No</th>
                <th style={{ padding: "10px" }}>CGPA</th>
              </tr>
            </thead>
            <tbody>
              {school.students.map((student: any) => (
                <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px", color: "#334155" }}>{student.name}</td>
                  <td style={{ padding: "10px", color: "#64748b" }}>{student.rollNo}</td>
                  <td style={{ padding: "10px", fontWeight: "bold", color: "#2563eb" }}>{student.cgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {role !== "STUDENT" && (
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3>🚨 Recent System Alerts</h3>
            {school.alerts.length === 0 ? (
              <p style={{ color: "#64748b" }}>No active alerts.</p>
            ) : (
              <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                {school.alerts.map((alert: any) => (
                  <li key={alert.id} style={{ marginBottom: "10px", color: "#334155", fontSize: "14px" }}>
                    <strong>{alert.title || "Alert"}</strong>: {alert.message || alert.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div id="tickets">
        <IncidentTicketWidget schoolId={school.id} />
      </div>

      <AnnouncementsWidget schoolId={school.id} />

      <AICopilotChat schoolId={school.id} />
    </>
  );
}
