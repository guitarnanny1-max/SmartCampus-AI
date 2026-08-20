"use client";

import { useState } from "react";

export default function AICopilotChat({ schoolId }: { schoolId: string }) {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const res = await fetch("/api/ai-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, schoolId }),
      });

      const data = await res.json();
      setReply(data.reply || data.error);
    } catch (err) {
      setReply("Failed to connect to AI Co-Pilot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
      <h3>🤖 Campus AI Co-Pilot</h3>
      <form onSubmit={handleAskAI} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about students, energy, or facilities..."
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ background: "#2563eb", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {reply && (
        <div style={{ marginTop: "15px", padding: "12px", background: "#eff6ff", borderLeft: "4px solid #2563eb", borderRadius: "4px" }}>
          <strong>AI Response:</strong> {reply}
        </div>
      )}
    </div>
  );
}
