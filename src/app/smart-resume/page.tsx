'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartResumePage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [gpa, setGpa] = useState('9.0');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/smart-resume')
      .then(res => res.json())
      .then(data => {
        setResumes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/smart-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, rollNumber, targetRole, gpa, skills, projects }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate resume');

      setResumes([data, ...resumes]);
      setStudentName('');
      setRollNumber('');
      setTargetRole('');
      setSkills('');
      setProjects('');
      alert('Resume generated and optimized successfully with AI ATS Score!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/35">
                SMARTCAMPUS AI STUDENT RESUME MAKER & ATS OPTIMIZER
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">AI Career Resume Builder</h1>
            <p className="text-xs text-slate-400">Generate professional, ATS-optimized student resumes formatted for elite corporate recruitment drives.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleGenerateResume} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📄</span> Build & Optimize New Resume
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Rohan Sharma" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Roll Number / ID</label>
              <input 
                type="text" 
                placeholder="e.g. SC-2026-105" 
                value={rollNumber} 
                onChange={e => setRollNumber(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Target Job Role</label>
              <input 
                type="text" 
                placeholder="e.g. Full Stack Engineer" 
                value={targetRole} 
                onChange={e => setTargetRole(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">CGPA / GPA</label>
              <input 
                type="number" 
                step="0.1" 
                value={gpa} 
                onChange={e => setGpa(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Key Technical Skills (Comma-separated)</label>
              <input 
                type="text" 
                placeholder="React, Next.js, TypeScript, PostgreSQL" 
                value={skills} 
                onChange={e => setSkills(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">Key Projects & Achievements Description</label>
            <textarea 
              rows={3}
              placeholder="Developed an autonomous campus OS with real-time IoT grid monitoring..." 
              value={projects} 
              onChange={e => setProjects(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={generating} 
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {generating ? 'Optimizing with AI ATS...' : 'Generate & Optimize Resume →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>✨</span> Generated Student Resumes ({resumes.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Student & Target Role</th>
                  <th className="p-4 font-medium">GPA & Skills</th>
                  <th className="p-4 font-medium text-right">AI ATS Score</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.studentName}</p>
                      <p className="text-[10px] text-slate-400">{r.targetRole}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-indigo-400 font-semibold">GPA: {r.gpa}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{r.skills}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/35">
                        {r.atsScore}% ATS Match
                      </span>
                    </td>
                  </tr>
                ))}
                {resumes.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No resumes generated yet.
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
