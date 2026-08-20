"use client";

import { useEffect, useState } from "react";

export default function EnergyTelemetryWidget() {
  const [telemetry, setTelemetry] = useState({
    solarGen: 0,
    gridLoad: 0,
    batteryLevel: 0,
    timestamp: ""
  });
  const [status, setStatus] = useState("Connecting to IoT Stream...");

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch("/api/telemetry");
        const data = await res.json();
        setTelemetry(data);
        setStatus("🟢 Live IoT Feed Active");
      } catch (err) {
        setStatus("🔴 Feed Disconnected");
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginTop: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, color: "#1e293b" }}>⚡ Live Campus Energy Telemetry</h3>
        <span style={{ fontSize: "13px", fontWeight: "bold", color: status.includes("Active") ? "#16a34a" : "#dc2626" }}>
          {status}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
        <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #16a34a" }}>
          <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "14px" }}>Solar Generation</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>{telemetry.solarGen} kW</p>
        </div>
        <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #2563eb" }}>
          <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "14px" }}>Grid Power Load</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>{telemetry.gridLoad} kW</p>
        </div>
        <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #ca8a04" }}>
          <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "14px" }}>Battery Storage</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>{telemetry.batteryLevel}%</p>
        </div>
      </div>
    </div>
  );
}
