export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartCareerPlacementPage() {
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [degreeMajor, setDegreeMajor] = useState('');
  const [corporatePartner, setCorporatePartner] = useState('');
  const [salaryOfferUsd, setSalaryOfferUsd] = useState('150000');
  const [aiInterviewScore, setAiInterviewScore] = useState('96.0');
  const [placementStatus, setPlacementStatus] = useState('PLACED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-career-placement')
      .then(res => res.json())
      .then(data => {
        setPlacements(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddPlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-career-placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, degreeMajor, corporatePartner, salaryOfferUsd, aiInterviewScore, placementStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record placement');

      setPlacements([data, ...placements]);
      setStudentName('');
      setDegreeMajor('');
      setCorporatePartner('');
      alert('Career placement record added successfully.');
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
                AUTONOMOUS CAREER PLACEMENT & ALUMNI NETWORK HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Career & Placement Grid</h1>
            <p className="text-xs text-slate-400">Monitor corporate recruiter offers, median salary packages, AI interview readiness, and alumni networks.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddPlacement} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💼</span> Record Student Career Placement Offer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Name</label>
              <input 
                type="text" 
                placeholder="e.g. Ananya Gupta" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Degree & Major</label>
              <input 
                type="text" 
                placeholder="e.g. B.Tech Data Science & ML" 
                value={degreeMajor} 
                onChange={e => setDegreeMajor(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Corporate Partner</label>
              <input 
                type="text" 
                placeholder="e.g. Google Cloud AI" 
                value={corporatePartner} 
                onChange={e => setCorporatePartner(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Salary Offer (USD)</label>
              <input 
                type="number" 
                value={salaryOfferUsd} 
                onChange={e => setSalaryOfferUsd(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Interview Score (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={aiInterviewScore} 
                onChange={e => setAiInterviewScore(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Placement Status</label>
              <select 
                value={placementStatus} 
                onChange={e => setPlacementStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="PLACED">Placed</option>
                <option value="OFFER_PENDING">Offer Pending</option>
                <option value="INTERVIEWING">Interviewing</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
            >
              {adding ? 'Recording Placement...' : 'Record Placement Offer →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎓</span> Career Placement Records ({placements.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Student & Major</th>
                  <th className="p-4 font-medium">Corporate Partner & Salary</th>
                  <th className="p-4 font-medium">AI Interview Score</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{p.studentName}</p>
                      <p className="text-[10px] text-slate-400">{p.degreeMajor}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-purple-400 font-semibold">{p.corporatePartner}</p>
                      <p className="text-[10px] text-slate-400">${p.salaryOfferUsd.toLocaleString()} USD</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {p.aiInterviewScore}% AI Score
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        p.placementStatus === 'PLACED'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/35'
                          : p.placementStatus === 'OFFER_PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                      }`}>
                        {p.placementStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {placements.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No career placement records found.
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
