export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartExamPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [examTitle, setExamTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [totalMarks, setTotalMarks] = useState('100');
  const [proctoringMode, setProctoringMode] = useState('AI Proctored');
  const [examStatus, setExamStatus] = useState('SCHEDULED');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/smart-exam')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/smart-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examTitle, courseName, totalMarks, proctoringMode, examStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule exam');

      setRecords([data, ...records]);
      setExamTitle('');
      setCourseName('');
      alert('Examination scheduled successfully with AI proctoring configuration.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                SMARTCAMPUS AI EXAMINATION & PROCTORING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">AI Exam Proctoring & Grading Hub</h1>
            <p className="text-xs text-slate-400">Schedule examinations, configure AI anti-cheat visual proctoring, and process automated student evaluations.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleCreateExam} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📝</span> Schedule New Examination
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Examination Title</label>
              <input 
                type="text" 
                placeholder="e.g. Machine Learning Final Examination" 
                value={examTitle} 
                onChange={e => setExamTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Course Name & Code</label>
              <input 
                type="text" 
                placeholder="e.g. CS-502 Advanced ML" 
                value={courseName} 
                onChange={e => setCourseName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Total Marks</label>
              <input 
                type="number" 
                value={totalMarks} 
                onChange={e => setTotalMarks(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Proctoring Mode</label>
              <select 
                value={proctoringMode} 
                onChange={e => setProctoringMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="AI Proctored">AI Proctored (Webcam + Audio)</option>
                <option value="Manual Proctoring">Manual Faculty Proctoring</option>
                <option value="Open Book">Open Book Assessment</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Exam Status</label>
              <select 
                value={examStatus} 
                onChange={e => setExamStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="LIVE">Live Now</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={creating} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {creating ? 'Scheduling Exam...' : 'Schedule Examination →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📚</span> Scheduled & Active Examinations ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {r.courseName}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.examTitle}</h4>
                    <p className="text-[11px] text-slate-400">Total Marks: {r.totalMarks} • Proctoring: {r.proctoringMode}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    r.examStatus === 'LIVE'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                      : r.examStatus === 'SCHEDULED'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {r.examStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                  <span>AI Proctoring Engine: <strong className="text-emerald-400">Active</strong></span>
                  <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">View Proctor Logs ↗</span>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No examinations found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
