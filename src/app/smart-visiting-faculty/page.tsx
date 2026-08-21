export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartVisitingFacultyPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facultyName, setFacultyName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [homeInstitution, setHomeInstitution] = useState('');
  const [schedulePeriod, setSchedulePeriod] = useState('Fall Semester 2026');
  const [status, setStatus] = useState('ACTIVE');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/smart-visiting-faculty')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/smart-visiting-faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facultyName, expertise, homeInstitution, schedulePeriod, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add visiting faculty');

      setRecords([data, ...records]);
      setFacultyName('');
      setExpertise('');
      setHomeInstitution('');
      alert('Visiting faculty member registered successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/35">
                SMARTCAMPUS AI VISITING FACULTY HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Visiting & Adjunct Professors</h1>
            <p className="text-xs text-slate-400">Manage guest lecturers, international researchers, and adjunct faculty schedules and course assignments.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddFaculty} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>👨‍🏫</span> Register Visiting Professor / Guest Lecturer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Faculty Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Geoffrey Hinton" 
                value={facultyName} 
                onChange={e => setFacultyName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Home Institution</label>
              <input 
                type="text" 
                placeholder="e.g. University of Toronto / Google" 
                value={homeInstitution} 
                onChange={e => setHomeInstitution(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Expertise / Department</label>
              <input 
                type="text" 
                placeholder="e.g. Neural Networks" 
                value={expertise} 
                onChange={e => setExpertise(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Schedule Period</label>
              <input 
                type="text" 
                placeholder="e.g. Fall Semester 2026" 
                value={schedulePeriod} 
                onChange={e => setSchedulePeriod(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="ACTIVE">Active Visiting</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed Term</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={submitting} 
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {submitting ? 'Registering Faculty...' : 'Register Visiting Faculty →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌐</span> Visiting & Guest Faculty Roster ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      {r.homeInstitution}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.facultyName}</h4>
                    <p className="text-[11px] text-slate-400">Expertise: {r.expertise}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    r.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      : r.status === 'SCHEDULED'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Period: <strong className="text-white">{r.schedulePeriod}</strong></span>
                  <span className="text-indigo-400 font-semibold cursor-pointer hover:underline">View Schedule ↗</span>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No visiting faculty records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
