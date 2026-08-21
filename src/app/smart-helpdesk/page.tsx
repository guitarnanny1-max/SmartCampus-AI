export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartHelpdeskPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Student');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/smart-helpdesk')
      .then(res => res.json())
      .then(data => setTickets(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/smart-helpdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName || 'Campus User', userRole, query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTickets([data, ...tickets]);
      setQuery('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090616] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#130d2a]/80 border border-purple-900/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800">
              AI ASSISTANT & HELPDESK 🤖
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">SmartCampus Virtual Helpdesk</h1>
            <p className="text-xs text-purple-200/70">Ask any question regarding admissions, academics, finance, or campus wellness.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-semibold border border-purple-800 transition-all"
          >
            ← Back to Portal
          </Link>
        </div>

        {/* Query Input Form */}
        <form onSubmit={handleSubmitQuery} className="bg-[#130d2a]/60 border border-purple-900/50 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Your Full Name" 
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
              className="bg-[#0b0718] border border-purple-900/60 rounded-xl px-4 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500"
            />
            <select 
              value={userRole}
              onChange={e => setUserRole(e.target.value)}
              className="bg-[#0b0718] border border-purple-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty & Staff</option>
              <option value="Administrator">Administrator</option>
              <option value="Parent">Parent / Visitor</option>
            </select>
          </div>

          <textarea 
            rows={3}
            placeholder="Ask AI Assistant anything (e.g., How do I check my fee extension or staff health step sync?)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
            className="w-full bg-[#0b0718] border border-purple-900/60 rounded-xl p-4 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500"
          />

          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing AI Answer...' : 'Ask AI Assistant →'}
            </button>
          </div>
        </form>

        {/* Ticket & Chat History */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>💬</span> Recent Helpdesk & AI Conversations ({tickets.length})
          </h3>

          <div className="space-y-4">
            {tickets.map((t: any) => (
              <div key={t.id} className="bg-[#130d2a]/70 border border-purple-900/50 rounded-2xl p-6 space-y-3 shadow-lg">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{t.userName}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] border border-purple-800">{t.userRole}</span>
                  </div>
                  <span className="text-[10px] text-purple-300/50 font-mono">{new Date(t.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="bg-purple-950/40 border border-purple-900/60 rounded-xl p-3.5 text-xs text-purple-200">
                  <span className="font-bold text-purple-400">Q:</span> {t.query}
                </div>

                <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-3.5 text-xs text-indigo-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-400 text-[11px]">
                    <span>🤖</span> SmartCampus AI Response:
                  </div>
                  <p>{t.aiResponse}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
