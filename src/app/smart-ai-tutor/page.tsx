export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartAiTutorPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [aiQueryPrompt, setAiQueryPrompt] = useState('');
  const [proctorStatus, setProctorStatus] = useState('VERIFIED');
  const [confidenceScore, setConfidenceScore] = useState('98.5');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-ai-tutor')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, courseTitle, aiQueryPrompt, proctorStatus, confidenceScore }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record session');

      setRecords([data, ...records]);
      setStudentName('');
      setCourseTitle('');
      setAiQueryPrompt('');
      alert('AI tutoring session and proctor check recorded successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/35">
                AUTONOMOUS VIRTUAL TUTOR & EXAM PROCTORING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">AI Tutoring & Proctor Integrity Grid</h1>
            <p className="text-xs text-slate-400">Monitor student AI tutoring inquiries, academic integrity confidence scores, and automated proctor checks.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddRecord} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🤖</span> Log AI Tutor & Proctor Session
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Name</label>
              <input 
                type="text" 
                placeholder="e.g. Natasha Romanoff" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Course Title</label>
              <input 
                type="text" 
                placeholder="e.g. Artificial Intelligence & Machine Learning" 
                value={courseTitle} 
                onChange={e => setCourseTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">AI Query / Prompt</label>
            <input 
              type="text" 
              placeholder="e.g. Explain backpropagation gradient descent mathematics." 
              value={aiQueryPrompt} 
              onChange={e => setAiQueryPrompt(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Proctor Status</label>
              <select 
                value={proctorStatus} 
                onChange={e => setProctorStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="VERIFIED">Verified Secure</option>
                <option value="FLAGGED">Flagged for Review</option>
                <option value="REVIEWING">Manual Reviewing</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Confidence Score (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={confidenceScore} 
                onChange={e => setConfidenceScore(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-blue-500 text-slate-950 font-bold text-xs hover:bg-blue-400 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {adding ? 'Logging Session...' : 'Record AI Session →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> AI Tutoring & Integrity Records ({records.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Student & Course</th>
                  <th className="p-4 font-medium">AI Query Prompt</th>
                  <th className="p-4 font-medium">Confidence</th>
                  <th className="p-4 font-medium text-right">Proctor Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r: any) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.studentName}</p>
                      <p className="text-[10px] text-slate-400">{r.courseTitle}</p>
                    </td>
                    <td className="p-4 text-slate-300">
                      {r.aiQueryPrompt}
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {r.confidenceScore}% Confidence
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.proctorStatus === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : r.proctorStatus === 'FLAGGED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {r.proctorStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No AI tutoring records found.
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
