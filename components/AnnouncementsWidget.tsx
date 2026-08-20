"use client";

import { useState, useEffect } from "react";
import { useRole } from "../context/RoleContext";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function AnnouncementsWidget({ schoolId }: { schoolId: string }) {
  const { role } = useRole();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/announcements?schoolId=${schoolId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch(err => console.error(err));
  }, [schoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId,
          title,
          content,
          author: role === "FACULTY" ? "Faculty Member" : "Administrator"
        })
      });
      if (res.ok) {
        const newItem = await res.json();
        setAnnouncements([newItem, ...announcements]);
        setTitle("");
        setContent("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginTop: "20px" }}>
      <h3 style={{ margin: "0 0 15px 0", color: "#1e293b" }}>📢 Campus Notice Board & Announcements</h3>

      {role !== "STUDENT" && (
        <form onSubmit={handleSubmit} style={{ background: "#f8fafc", padding: "15px", borderRadius: "6px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#475569" }}>Post New Announcement</h4>
          {success && <div style={{ color: "#16a34a", fontSize: "13px", marginBottom: "10px", fontWeight: "bold" }}>✅ Announcement published successfully!</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Announcement Title (e.g., Annual Sports Day Circular)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "14px" }}
              required
            />
            <textarea
              placeholder="Enter announcement details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "14px", resize: "vertical" }}
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", alignSelf: "flex-start", fontSize: "13px" }}
            >
              {loading ? "Publishing..." : "Broadcast Announcement"}
            </button>
          </div>
        </form>
      )}

      {announcements.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: "14px", fontStyle: "italic" }}>No active announcements posted yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {announcements.map((item) => (
            <div key={item.id} style={{ padding: "14px", borderRadius: "6px", background: "#f1f5f9", borderLeft: "4px solid #2563eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <h4 style={{ margin: 0, color: "#0f172a", fontSize: "15px" }}>{item.title}</h4>
                <span style={{ fontSize: "11px", color: "#64748b" }}>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: "4px 0 8px 0", color: "#334155", fontSize: "14px", lineHeight: "1.4" }}>{item.content}</p>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>Posted by: {item.author}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
