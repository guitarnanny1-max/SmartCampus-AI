'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CounselingPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [counselorName, setCounselorName] = useState('Dr. Evelyn Vance, PsyD');
  const [issueCategory, setIssueCategory] = useState('ACADEMIC_STRESS');
  const [sessionDate, setSessionDate] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/counseling')
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
      const res = await fetch('/api/counseling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, counselorName, issueCategory, sessionDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule session');

      setSessions([data, ...sessions]);
      setStudentName('');
      setSessionDate('');
      alert('Confidential wellness counseling session successfully booked.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                STUDENT WELLNESS & SUPPORT
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Counseling & Mental Health Portal</h1>
            <p className="text-xs text-slate-400">Manage confidential mental health support sessions, wellness appointments, and psychological care coordination.</p>
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
            <span>🧠</span> Schedule Confidential Counseling Session
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Name</label>
              <input 
                type="text" 
                placeholder="e.g. Jessica Taylor" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Assigned Counselor</label>
              <select 
                value={counselorName} 
                onChange={e => setCounselorName(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Dr. Evelyn Vance, PsyD">Dr. Evelyn Vance, PsyD</option>
                <option value="Mark Sterling, LCSW">Mark Sterling, LCSW</option>
                <option value="Dr. Rachel Green, Ph.D">Dr. Rachel Green, Ph.D</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Issue Category / Support Focus</label>
              <select 
                value={issueCategory} 
                onChange={e => setIssueCategory(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="ACADEMIC_STRESS">ACADEMIC STRESS & EXAMS</option>
                <option value="ANXIETY_MANAGEMENT">ANXIETY & DEPRESSION SUPPORT</option>
                <option value="CAREER_BURNOUT">CAREER & MAJOR BURNOUT</option>
                <option value="ADJUSTMENT_SUPPORT">CAMPUS LIFE ADJUSTMENT</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Session Date & Time</label>
              <input 
                type="text" 
                placeholder="e.g. 2026-08-25 11:00 AM" 
                value={sessionDate} 
                onChange={e => setSessionDate(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Booking Session...' : 'Schedule Session →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📋</span> Wellness Counseling Registry ({sessions.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Counselor</th>
                  <th className="p-4 font-medium">Focus Category</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{s.studentName}</td>
                    <td className="p-4 text-cyan-400">{s.counselorName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {s.issueCategory}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{s.sessionDate}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        s.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No counseling sessions scheduled.
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
