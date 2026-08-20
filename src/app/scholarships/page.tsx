'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ScholarshipsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [scholarshipName, setScholarshipName] = useState('');
  const [fundCategory, setFundCategory] = useState('MERIT_BASED');
  const [amountRequested, setAmountRequested] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/scholarships')
      .then(res => res.json())
      .then(data => {
        setApplications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, rollNo, scholarshipName, fundCategory, amountRequested }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');

      setApplications([data, ...applications]);
      setStudentName('');
      setRollNo('');
      setScholarshipName('');
      setAmountRequested('');
      alert('Scholarship application submitted successfully.');
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
                FINANCIAL AID OFFICE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Scholarships & Grants Portal</h1>
            <p className="text-xs text-slate-400">Process student financial aid applications, merit-based scholarships, and track disbursements.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleApply} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎓</span> New Scholarship Application
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Name</label>
              <input 
                type="text" 
                placeholder="e.g. Isaac Newton" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Roll / ID No.</label>
              <input 
                type="text" 
                placeholder="e.g. CS-2025-099" 
                value={rollNo} 
                onChange={e => setRollNo(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Scholarship / Grant Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dean's List Award" 
                value={scholarshipName} 
                onChange={e => setScholarshipName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Funding Category</label>
              <select 
                value={fundCategory} 
                onChange={e => setFundCategory(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="MERIT_BASED">Merit Based</option>
                <option value="NEED_BASED">Need Based</option>
                <option value="ATHLETIC">Athletic Scholarship</option>
                <option value="DEPARTMENTAL">Departmental Grant</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Requested Amount ($)</label>
              <input 
                type="number" 
                placeholder="e.g. 5000" 
                value={amountRequested} 
                onChange={e => setAmountRequested(e.target.value)} 
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
              {adding ? 'Submitting Application...' : 'Submit Application →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📑</span> Active Applications Directory ({applications.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Applicant</th>
                  <th className="p-4 font-medium">Fund Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{app.studentName}</p>
                      <p className="text-[10px] text-slate-500">{app.rollNo}</p>
                    </td>
                    <td className="p-4 text-cyan-400">{app.scholarshipName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {app.fundCategory.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-emerald-400">${app.amountRequested?.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        app.status === 'APPROVED' || app.status === 'DISBURSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No scholarship applications found.
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
