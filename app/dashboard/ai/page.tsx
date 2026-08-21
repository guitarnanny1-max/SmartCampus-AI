'use client';

import { useState } from "react";

interface Message {
  sender: string;
  type: string;
  text: string;
  requiresReview?: boolean;
}

export default function AIDashboardPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "AI Copilot", type: "text", text: "Hello! I am your administrative AI assistant. How can I help you manage your tenants or automate school tasks today?", requiresReview: false }
  ]);
  const [input, setInput] = useState("");
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { sender: "You", type: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg })
      });
      const data = await res.json();
      
      setMessages(prev => [
        ...prev,
        { 
          sender: "AI Copilot", 
          type: "text", 
          text: data.analysis || data.reply || "Processed request successfully.",
          requiresReview: data.requiresReview || false
        }
      ]);
      if (data.requiresReview) {
        setPendingAction(data.action);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: "AI Copilot", type: "error", text: "Failed to communicate with AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6 border-b border-slate-800 pb-4">
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
            Neural Operations Copilot
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">AI Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">Autonomous multi-tenant oversight and administrative execution.</p>
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 overflow-y-auto space-y-4 max-h-[60vh]">
          {messages.map((m, idx) => (
            <div key={idx} className={`p-4 rounded-xl text-xs ${m.sender === "You" ? "bg-indigo-600/20 border border-indigo-500/30 ml-auto max-w-[80%]" : "bg-slate-950 border border-slate-800 max-w-[80%]"}`}>
              <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1">{m.sender}</div>
              <div className="text-slate-200 leading-relaxed">{m.text}</div>
              {m.requiresReview && pendingAction && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                  <span className="text-[10px] text-amber-400 font-mono">Requires Admin Confirmation</span>
                  <div className="space-x-2">
                    <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">Approve</button>
                    <button className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[10px]">Reject</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="p-4 rounded-xl text-xs bg-slate-950 border border-slate-800 max-w-[80%] text-slate-400 animate-pulse">
              AI Copilot is thinking...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Copilot to provision schools, analyze telemetry, or generate reports..." 
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500" 
          />
          <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6 py-3 text-xs transition shadow disabled:opacity-50">
            Send Prompt
          </button>
        </form>
      </div>
    </div>
  );
}
