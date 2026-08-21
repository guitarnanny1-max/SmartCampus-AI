export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartAdmissionCrmPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicantName, setApplicantName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [entranceExamScore, setEntranceExamScore] = useState('95.0');
  const [targetProgram, setTargetProgram] = useState('');
  const [counselorName, setCounselorName] = useState('');
  const [leadStatus, setLeadStatus] = useState('NEW_LEAD');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-admission-crm')
      .then(res => res.json())
      .then(data => {
        setLeads(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-admission-crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantName, contactEmail, entranceExamScore, targetProgram, counselorName, leadStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add admission lead');

      setLeads([data, ...leads]);
      setApplicantName('');
      setContactEmail('');
      setTargetProgram('');
      setCounselorName('');
      alert('Admission lead registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/35">
                SMARTCAMPUS AI ADMISSIONS & COUNSELOR CRM HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Admissions Lead & Conversion Pipeline</h1>
            <p className="text-xs text-slate-400">Track entrance scores, counselor assignments, WhatsApp nurtures, and enrollment conversion status.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddLead} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎯</span> Register New Admission Prospect
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Applicant Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Tanvi Kulkarni" 
                value={applicantName} 
                onChange={e => setApplicantName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Contact Email</label>
              <input 
                type="email" 
                placeholder="tanvi.k@example.com" 
                value={contactEmail} 
                onChange={e => setContactEmail(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Target Degree Program</label>
              <input 
                type="text" 
                placeholder="e.g. B.Tech Computer Science" 
                value={targetProgram} 
                onChange={e => setTargetProgram(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Entrance Exam Score (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={entranceExamScore} 
                onChange={e => setEntranceExamScore(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Assigned Counselor</label>
              <input 
                type="text" 
                placeholder="e.g. Rajesh Sharma" 
                value={counselorName} 
                onChange={e => setCounselorName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">Lead Conversion Status</label>
            <select 
              value={leadStatus} 
              onChange={e => setLeadStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="NEW_LEAD">New Lead</option>
              <option value="CONTACTED">Contacted & Follow-up</option>
              <option value="COUNSELING">Counseling Scheduled</option>
              <option value="ENROLLED">Enrolled & Confirmed</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
            >
              {adding ? 'Registering Lead...' : 'Register Lead Prospect →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📋</span> Active Prospect Pipeline ({leads.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Applicant & Program</th>
                  <th className="p-4 font-medium">Exam Score & Counselor</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l: any) => (
                  <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{l.applicantName}</p>
                      <p className="text-[10px] text-slate-400">{l.targetProgram}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-purple-400 font-semibold">{l.entranceExamScore}% Score</p>
                      <p className="text-[10px] text-slate-400">Counselor: {l.counselorName}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        l.leadStatus === 'ENROLLED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : l.leadStatus === 'COUNSELING'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : l.leadStatus === 'CONTACTED'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/35'
                      }`}>
                        {l.leadStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No admission leads found.
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
