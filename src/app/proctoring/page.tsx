export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProctoringPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [examTitle, setExamTitle] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [totalStudents, setTotalStudents] = useState('60');
  const [flaggedIncidentsCount, setFlaggedIncidentsCount] = useState('0');
  const [invigilatorName, setInvigilatorName] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/proctoring')
      .then(res => res.json())
      .then(data => {
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/proctoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examTitle, roomNumber, totalStudents, flaggedIncidentsCount, invigilatorName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize session');

      setSessions([data, ...sessions]);
      setExamTitle('');
      setRoomNumber('');
      setInvigilatorName('');
      alert('Examination proctoring session initialized.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                AI EXAM PROCTORING & SURVEILLANCE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Smart Proctoring Command Center</h1>
            <p className="text-xs text-slate-400">Monitor active test sessions, review AI-flagged anomaly logs, and ensure academic integrity.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddSession} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>👁️</span> Initialize Exam Proctoring Room
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Exam Title / Subject</label>
              <input 
                type="text" 
                placeholder="e.g. Data Structures Final Exam" 
                value={examTitle} 
                onChange={e => setExamTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Room / Hall Number</label>
              <input 
                type="text" 
                placeholder="e.g. Lab Hall 4C" 
                value={roomNumber} 
                onChange={e => setRoomNumber(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Total Students</label>
              <input 
                type="number" 
                min="1" 
                value={totalStudents} 
                onChange={e => setTotalStudents(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Initial Flagged Incidents</label>
              <input 
                type="number" 
                min="0" 
                value={flaggedIncidentsCount} 
                onChange={e => setFlaggedIncidentsCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Invigilator Name</label>
              <input 
                type="text" 
                placeholder="e.g. Prof. Alan Turing" 
                value={invigilatorName} 
                onChange={e => setInvigilatorName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {adding ? 'Initializing Session...' : 'Start Proctoring Session →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Proctoring Registry ({sessions.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Exam & Room</th>
                  <th className="p-4 font-medium">Invigilator</th>
                  <th className="p-4 font-medium">Students</th>
                  <th className="p-4 font-medium">AI Flags</th>
                  <th className="p-4 font-medium text-right">AI Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((ses: any) => (
                  <tr key={ses.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{ses.examTitle}</p>
                      <p className="text-[10px] text-slate-400">Room: {ses.roomNumber}</p>
                    </td>
                    <td className="p-4 text-slate-300">{ses.invigilatorName}</td>
                    <td className="p-4 font-mono text-slate-300">{ses.totalStudents}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ses.flaggedIncidentsCount > 0 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/35' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/35'
                      }`}>
                        {ses.flaggedIncidentsCount} Flagged
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        ses.aiStatus === 'SECURE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : ses.aiStatus === 'REVIEW_REQUIRED'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35 animate-pulse'
                      }`}>
                        {ses.aiStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No proctoring sessions active.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
