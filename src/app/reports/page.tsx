'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ESG & Carbon');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');

      setReports([data, ...reports]);
      setTitle('');
      alert('Executive compliance report compiled and signed successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                EXECUTIVE COMPLIANCE CENTER
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Institutional Audit Reports</h1>
            <p className="text-xs text-slate-400">Generate certified PDF and CSV reports for accreditation boards and regulatory bodies.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleGenerate} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📑</span> Compile New Compliance Report
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-slate-400">Report Title</label>
              <input 
                type="text" 
                placeholder="e.g. Q3 2026 Student Placement & Academic Integrity Review" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Report Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="ESG & Carbon">ESG & Carbon Sustainability</option>
                <option value="Security & Access">Security & RBAC Access</option>
                <option value="Facilities">IoT Facilities & Energy</option>
                <option value="Academic">Academic Placements</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={generating} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {generating ? 'Compiling Report...' : 'Generate Certified Report →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📂</span> Generated Report Archive ({reports.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Report Title</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Generated By</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{r.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                        {r.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{r.generatedBy}</td>
                    <td className="p-4 font-mono text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => alert(`Downloading certified audit report: "${r.title}" (PDF)`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all border border-slate-700"
                      >
                        Download PDF ↓
                      </button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No audit reports compiled.
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
