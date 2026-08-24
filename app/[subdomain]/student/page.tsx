"use client";
export const dynamic = "force-dynamic";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentApp(props: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = use(props.params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tenantId, setTenantId] = useState("");
  const [attendances, setAttendances] = useState<any[]>([]);
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([
    { sender: "AI Tutor", text: "Hello Rahul! I'm your SmartCampus AI Study Assistant. Ask me any homework or curriculum question!" }
  ]);
  const [input, setInput] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcampus_user");
    if (!storedUser) {
      router.push(`/${subdomain}/login`);
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    async function init() {
      try {
        const res = await fetch(`/api/messages/tenant-lookup?subdomain=${subdomain}`);
        const data = await res.json();
        if (data.tenantId) {
          setTenantId(data.tenantId);
          const attRes = await fetch(`/api/attendance?tenantId=${data.tenantId}`);
          const attData = await attRes.json();
          if (attData.success && attData.attendances) {
            setAttendances(attData.attendances);
          }
        }
      } catch (e) {}
    }
    init();
  }, [subdomain, router]);

  function handleLogout() {
    localStorage.removeItem("smartcampus_user");
    router.push(`/${subdomain}/login`);
  }

  async function handleAskAI(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || asking) return;

    const userQuestion = input;
    setInput("");
    setChat((prev) => [...prev, { sender: user.name || "Rahul Gupta", text: userQuestion }]);
    setAsking(true);

    try {
      const res = await fetch("/api/ai/study-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });
      const data = await res.json();
      if (data.success) {
        setChat((prev) => [...prev, { sender: "AI Tutor", text: data.answer }]);
      } else {
        setChat((prev) => [...prev, { sender: "AI Tutor", text: "Sorry, I encountered an error answering that." }]);
      }
    } catch (e) {
      setChat((prev) => [...prev, { sender: "AI Tutor", text: "Network error connecting to AI tutor." }]);
    } finally {
      setAsking(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-xl">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Student Companion Workspace</span>
            <h1 className="text-3xl font-black mt-1">Student Portal ({subdomain})</h1>
            <p className="text-sm text-slate-400">View biometric attendance logs, academic report cards, and get 24/7 AI tutoring.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-bold uppercase">Role: {user.role} ({user.name})</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase transition cursor-pointer">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Biometric Attendance & Grades */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Biometric Attendance</h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Verified</span>
              </div>
              <div className="space-y-2.5">
                {attendances.length === 0 ? (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-slate-200">2026-08-24</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Gate Punch: 08:15 AM</p>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-mono font-bold uppercase">PRESENT</span>
                  </div>
                ) : (
                  attendances.map((att) => (
                    <div key={att.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-slate-200">{att.date}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Gate Punch: {att.punchTime}</p>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-mono font-bold uppercase">{att.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-bold text-lg">Term Gradebook Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Mathematics (10-A)</span>
                  <span className="font-bold text-cyan-400">A+ (94%)</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Physics & Lab</span>
                  <span className="font-bold text-cyan-400">A (91%)</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Computer Science</span>
                  <span className="font-bold text-cyan-400">A+ (98%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Study Assistant */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-[600px] shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg">AI Study Assistant & Tutor</h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">Active 24/7</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">Ask complex math formulas, science equations, or homework explanations.</p>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex-1 overflow-y-auto space-y-3">
              {chat.map((msg, i) => (
                <div key={i} className={`p-3.5 rounded-xl border max-w-[85%] ${msg.sender === user.name ? 'ml-auto bg-cyan-600/20 border-cyan-500/30 text-right' : 'bg-slate-900 border-slate-800'}`}>
                  <p className="text-[10px] font-bold text-cyan-400">{msg.sender}</p>
                  <p className="text-sm text-slate-200 mt-1 leading-relaxed">{msg.text}</p>
                </div>
              ))}
              {asking && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl max-w-[60%] animate-pulse">
                  <p className="text-xs text-cyan-400">AI Tutor is thinking...</p>
                </div>
              )}
            </div>

            <form onSubmit={handleAskAI} className="flex gap-2 mt-4">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question (e.g., Explain quadratic equations)..." 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" disabled={asking} className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition shadow-lg cursor-pointer disabled:opacity-50">
                Ask AI
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}