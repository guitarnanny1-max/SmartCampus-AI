export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartBiologicalPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilityCode, setFacilityCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [genomicSequencingSpeedGbps, setGenomicSequencingSpeedGbps] = useState('100.0');
  const [bioSampleCount, setBioSampleCount] = useState('2000');
  const [aiResearchOptimizationMode, setAiResearchOptimizationMode] = useState('CRISPR_PREDICTIVE_MODELING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-biological')
      .then(res => res.json())
      .then(data => {
        setLabs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddLab = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-biological', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facilityCode, facilityName, genomicSequencingSpeedGbps, bioSampleCount, aiResearchOptimizationMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register lab');

      setLabs([data, ...labs]);
      setFacilityCode('');
      setFacilityName('');
      alert('Biological research lab registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                SMART BIOLOGICAL RESEARCH & GENETIC HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Bio-Sequencing & Research Grid</h1>
            <p className="text-xs text-slate-400">Monitor sequencing throughput (Gbps), sample storage, and AI-driven genetic modeling.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddLab} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🧬</span> Register Research Lab
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. BIO-LAB-04" 
                value={facilityCode} 
                onChange={e => setFacilityCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Genomics Sequencing Core" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Sequencing Speed (Gbps)</label>
              <input 
                type="number" 
                step="0.1" 
                value={genomicSequencingSpeedGbps} 
                onChange={e => setGenomicSequencingSpeedGbps(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Bio-Samples Count</label>
              <input 
                type="number" 
                value={bioSampleCount} 
                onChange={e => setBioSampleCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="block text-xs font-medium text-slate-400">AI Research Mode</label>
              <select 
                value={aiResearchOptimizationMode} 
                onChange={e => setAiResearchOptimizationMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="CRISPR_PREDICTIVE_MODELING">CRISPR Predictive Modeling</option>
                <option value="DEEP_LEARNING_PROTEIN_DYNAMICS">Deep Learning Protein Dynamics</option>
                <option value="AUTOMATED_EPIDEMIOLOGICAL_MODELING">Automated Epidemiological Modeling</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Lab...' : 'Add Research Lab →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🧬</span> Active Research Labs ({labs.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Facility Code & Name</th>
                  <th className="p-4 font-medium">Sequencing & Samples</th>
                  <th className="p-4 font-medium text-right">AI Research Mode</th>
                </tr>
              </thead>
              <tbody>
                {labs.map((l: any) => (
                  <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{l.facilityCode}</p>
                      <p className="text-[10px] text-slate-400">{l.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">{l.genomicSequencingSpeedGbps} Gbps</p>
                      <p className="text-[10px] text-slate-400">{l.bioSampleCount.toLocaleString()} Active Bio-Samples</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        l.aiResearchOptimizationMode === 'CRISPR_PREDICTIVE_MODELING'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : l.aiResearchOptimizationMode === 'DEEP_LEARNING_PROTEIN_DYNAMICS'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {l.aiResearchOptimizationMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {labs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No research labs registered.
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
