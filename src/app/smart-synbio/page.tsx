export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartSynBioPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [labCode, setLabCode] = useState('');
  const [labName, setLabName] = useState('');
  const [geneSynthesisRateBpPerHour, setGeneSynthesisRateBpPerHour] = useState('15000.0');
  const [biosafetyLevel, setBiosafetyLevel] = useState('3');
  const [genomeEditingPrecisionPct, setGenomeEditingPrecisionPct] = useState('99.98');
  const [aiBiosafetyContainmentMode, setAiBiosafetyContainmentMode] = useState('AUTOMATED_GENOMIC_OFF_TARGET_PREDICTION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-synbio')
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
      const res = await fetch('/api/smart-synbio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labCode, labName, geneSynthesisRateBpPerHour, biosafetyLevel, genomeEditingPrecisionPct, aiBiosafetyContainmentMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register lab');

      setLabs([data, ...labs]);
      setLabCode('');
      setLabName('');
      alert('Synthetic biology lab registered successfully.');
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
                SMART SYNTHETIC BIOLOGY & GENETICS HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Gene Synthesis & Biosafety Grid</h1>
            <p className="text-xs text-slate-400">Monitor gene synthesis rates, biosafety levels, editing precision, and AI containment modes.</p>
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
            <span>🧬</span> Register Synthetic Biology Lab
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Lab Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. SYNBIO-LAB-04" 
                value={labCode} 
                onChange={e => setLabCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Lab Name</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Genomics & Organismal Design" 
                value={labName} 
                onChange={e => setLabName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Synthesis Rate (bp/hr)</label>
              <input 
                type="number" 
                step="500.0" 
                value={geneSynthesisRateBpPerHour} 
                onChange={e => setGeneSynthesisRateBpPerHour(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Biosafety Level (BSL)</label>
              <input 
                type="number" 
                min="1" 
                max="4" 
                value={biosafetyLevel} 
                onChange={e => setBiosafetyLevel(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Precision (%)</label>
              <input 
                type="number" 
                step="0.01" 
                value={genomeEditingPrecisionPct} 
                onChange={e => setGenomeEditingPrecisionPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Containment Mode</label>
              <select 
                value={aiBiosafetyContainmentMode} 
                onChange={e => setAiBiosafetyContainmentMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="AUTOMATED_GENOMIC_OFF_TARGET_PREDICTION">Automated Off-Target Prediction</option>
                <option value="PROTEIN_FOLDING_STABILITY_MONITOR">Protein Folding Stability Monitor</option>
                <option value="AUTONOMOUS_PATHOGEN_CONTAINMENT_LOCKDOWN">Autonomous Pathogen Lockdown</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Lab...' : 'Add Synthetic Biology Lab →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🧬</span> Active Synthetic Biology Labs ({labs.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Lab Code & Name</th>
                  <th className="p-4 font-medium">Synthesis Rate & BSL</th>
                  <th className="p-4 font-medium">Editing Precision</th>
                  <th className="p-4 font-medium text-right">AI Containment Mode</th>
                </tr>
              </thead>
              <tbody>
                {labs.map((l: any) => (
                  <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{l.labCode}</p>
                      <p className="text-[10px] text-slate-400">{l.labName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">{l.geneSynthesisRateBpPerHour} bp/hr</p>
                      <p className="text-[10px] text-slate-400">BSL-{l.biosafetyLevel} Biosafety</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {l.genomeEditingPrecisionPct}% Precision
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        l.aiBiosafetyContainmentMode === 'AUTOMATED_GENOMIC_OFF_TARGET_PREDICTION'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : l.aiBiosafetyContainmentMode === 'PROTEIN_FOLDING_STABILITY_MONITOR'
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {l.aiBiosafetyContainmentMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {labs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No synthetic biology labs registered.
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
