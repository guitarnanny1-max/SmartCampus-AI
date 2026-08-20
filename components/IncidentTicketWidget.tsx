"use client";

import { useState } from "react";

export default function IncidentTicketWidget({ schoolId, onTicketCreated }: { schoolId: string; onTicketCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, title, description, severity }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Incident ticket reported successfully!");
        setTitle("");
        setDescription("");
        if (onTicketCreated) onTicketCreated();
        window.location.reload();
      } else {
        setMessage("❌ " + (data.error || "Failed to submit ticket"));
      }
    } catch (err) {
      setMessage("❌ Network error while submitting ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginTop: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <h3 style={{ margin: "0 0 15px 0", color: "#1e293b" }}>🛠️ Report Campus Incident / Ticket</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Issue Title (e.g. AC Failure in Block B Lab 3)"
            style={{ flex: 2, padding: "10px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
            required
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #cbd5e1", background: "white" }}
          >
            <option value="LOW">Low Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="HIGH">High Severity / Urgent</option>
          </select>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of the maintenance or operational issue..."
          rows={2}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #cbd5e1", resize: "vertical" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ background: "#0f172a", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Submitting Ticket..." : "Submit Incident Ticket"}
        </button>
      </form>
      {message && <p style={{ marginTop: "10px", fontSize: "14px", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}
