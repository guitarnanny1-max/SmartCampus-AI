export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartOnboardingPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stepName, setStepName] = useState('');
  const [roleTarget, setRoleTarget] = useState('ALL');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-onboarding')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepName, roleTarget, completionStatus: 'PENDING', notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add onboarding step');

      setRecords([data, ...records]);
      setStepName('');
      setNotes('');
      alert('New onboarding milestone added successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const completedCount = records.filter((r: any) => r.completionStatus === 'COMPLETED').length;
  const progressPercent = records.length > 0 ? Math.round((completedCount / records.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/35">
                SMARTCAMPUS AI ONBOARDING & SETUP HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Interactive Institution Onboarding</h1>
            <p className="text-xs text-slate-400">Guide students, faculty, and administrators through a streamlined setup wizard and milestone checklist.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        {/* Progress Bar Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <span>📊</span> Onboarding Progress Completion
            </span>
            <span className="font-mono text-violet-400 font-bold">{progressPercent}% ({completedCount}/{records.length} Milestones)</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div 
              className="bg-violet-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-violet-500/30" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleAddStep} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>✨</span> Add Custom Onboarding Milestone
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Milestone / Step Name</label>
              <input 
                type="text" 
                placeholder="e.g. Setup AI Chatbot Knowledge Base" 
                value={stepName} 
                onChange={e => setStepName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Target Role</label>
              <select 
                value={roleTarget} 
                onChange={e => setRoleTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="ALL">All Users (Universal)</option>
                <option value="ADMIN">Administrators & Webmasters</option>
                <option value="FACULTY">Faculty & Professors</option>
                <option value="STUDENT">Students & Clubs</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">Milestone Notes / Instructions</label>
            <input 
              type="text" 
              placeholder="e.g. Upload campus handbook PDF into vector search index" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 transition-all disabled:opacity-50 shadow-lg shadow-violet-600/20"
            >
              {adding ? 'Adding Milestone...' : 'Add Onboarding Milestone →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚀</span> Onboarding Checklist & Milestones ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                      Target: {r.roleTarget}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.stepName}</h4>
                    <p className="text-[11px] text-slate-400">{r.notes}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    r.completionStatus === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                  }`}>
                    {r.completionStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Setup Status: <strong className="text-violet-400">Verified</strong></span>
                  <span className="text-violet-400 font-semibold cursor-pointer hover:underline">Configure Step ↗</span>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No onboarding milestones found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
