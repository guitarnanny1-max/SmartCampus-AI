"use client";

import { useRole } from "../context/RoleContext";

export default function AnalyticsWidget({ students }: { students: any[] }) {
  const { role } = useRole();

  // Calculate CGPA tiers
  const excellent = students.filter(s => s.cgpa >= 3.9).length;
  const good = students.filter(s => s.cgpa >= 3.7 && s.cgpa < 3.9).length;
  const satisfactory = students.filter(s => s.cgpa < 3.7).length;
  const total = students.length || 1;

  const excPercent = Math.round((excellent / total) * 100);
  const goodPercent = Math.round((good / total) * 100);
  const satPercent = Math.round((satisfactory / total) * 100);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
      {/* Academic Performance Distribution */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "16px" }}>📊 Academic CGPA Distribution</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px", color: "#475569" }}>
              <span>Tier 1: Exceptional (3.9 - 4.0)</span>
              <span style={{ fontWeight: "bold" }}>{excellent} students ({excPercent}%)</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${excPercent}%`, height: "100%", background: "#2563eb", borderRadius: "4px" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px", color: "#475569" }}>
              <span>Tier 2: Advanced (3.7 - 3.89)</span>
              <span style={{ fontWeight: "bold" }}>{good} students ({goodPercent}%)</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${goodPercent}%`, height: "100%", background: "#38bdf8", borderRadius: "4px" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px", color: "#475569" }}>
              <span>Tier 3: Proficient (&lt; 3.7)</span>
              <span style={{ fontWeight: "bold" }}>{satisfactory} students ({satPercent}%)</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${satPercent}%`, height: "100%", background: "#94a3b8", borderRadius: "4px" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Sustainability & Grid Efficiency (Hidden for students) */}
      {role !== "STUDENT" && (
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "16px" }}>⚡ Campus Energy Efficiency Index</h3>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "16px", borderRadius: "6px", marginBottom: "15px", border: "1px solid #e2e8f0" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#64748b" }}>Renewable Energy Offset</p>
              <h4 style={{ margin: 0, fontSize: "22px", color: "#16a34a" }}>38.4%</h4>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#64748b" }}>Carbon Saved Today</p>
              <h4 style={{ margin: 0, fontSize: "22px", color: "#2563eb" }}>420 kg</h4>
            </div>
          </div>

          <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
            🌱 <strong>Smart Grid Status:</strong> Solar generation peak optimized during midday hours. Battery storage operating at optimal thermal capacity.
          </div>
        </div>
      )}
    </div>
  );
}
