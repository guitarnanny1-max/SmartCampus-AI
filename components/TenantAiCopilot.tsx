"use client";

import { useState } from "react";

interface CopilotProps {
  subdomain: string;
  brandColor: string;
}

export default function TenantAiCopilot({ subdomain, brandColor }: CopilotProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: "AI Copilot", text: "Hello! Ask me anything about this campus's students, facilities, or live telemetry." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt("");
    setMessages((prev) => [...prev, { sender: "You", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain, prompt: userMsg })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { sender: "AI Copilot", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: "AI Copilot", text: "Sorry, I encountered an error connecting to the campus neural net." }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "AI Copilot", text: "Network error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginTop: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{ background: brandColor, color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "14px", fontWeight: "bold" }}>
          🤖 Campus Copilot
        </span>
        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "20px" }}>Tenant Intelligence Assistant</h3>
      </div>

      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", height: "220px", overflowY: "auto", padding: "16px", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ alignSelf: m.sender === "You" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            <span style={{ fontSize: "11px", color: "#64748b", display: "block", marginBottom: "2px", textAlign: m.sender === "You" ? "right" : "left" }}>
              {m.sender}
            </span>
            <div style={{ background: m.sender === "You" ? brandColor : "#e2e8f0", color: m.sender === "You" ? "white" : "#0f172a", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", lineHeight: "1.4" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic" }}>AI Copilot is analyzing tenant databases...</div>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Ask about student rosters, facilities, or energy metrics..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ background: brandColor, color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
