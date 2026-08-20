'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentRiskPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [attendancePct, setAttendancePct] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetch('/api/student-risk')
      .then(res => res.json())
      .then(data => {
        setRisks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const res = await fetch('/api/student-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, rollNo, attendancePct, cgpa }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze student');

      setRisks([data, ...risks]);
      setStudentName('');
      setRollNo('');
      setAttendancePct('');
      setCgpa('');
      alert('AI predictive risk model computed successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                ACADEMIC SUCCESS & AI INSIGHTS
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Predictive Dropout & Risk Monitor</h1>
            <p className="text-xs text-slate-400">Proactively identify at-risk students using AI models evaluating attendance and CGPA metrics.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAnalyze} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🧠</span> Run AI Risk Evaluation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. David Vance" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Roll Number / ID</label>
              <input 
                type="text" 
                placeholder="e.g. CS-2026-302" 
                value={rollNo} 
                onChange={e => setRollNo(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Attendance Percentage (%)</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="e.g. 74.5" 
                value={attendancePct} 
                onChange={e => setAttendancePct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Current CGPA (0 - 10)</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="e.g. 6.5" 
                value={cgpa} 
                onChange={e => setCgpa(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={analyzing} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {analyzing ? 'Computing AI Model...' : 'Run Predictive Analysis →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Student Risk Assessments ({risks.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Roll No</th>
                  <th className="p-4 font-medium">Attendance</th>
                  <th className="p-4 font-medium">CGPA</th>
                  <th className="p-4 font-medium">Risk Level</th>
                  <th className="p-4 font-medium text-right">AI Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{r.studentName}</td>
                    <td className="p-4 font-mono text-cyan-400">{r.rollNo}</td>
                    <td className="p-4 font-mono text-slate-300">{r.attendancePct}%</td>
                    <td className="p-4 font-mono text-white">{r.cgpa}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.riskLevel === 'HIGH' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35' 
                          : r.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {r.riskLevel}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400 text-[11px] max-w-xs truncate">{r.aiReason}</td>
                  </tr>
                ))}
                {risks.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No student risk assessments found.
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
