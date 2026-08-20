'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartNanotechPage() {
  const [cleanrooms, setCleanrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cleanroomCode, setCleanroomCode] = useState('');
  const [cleanroomName, setCleanroomName] = useState('');
  const [isoClass, setIsoClass] = useState('1');
  const [aldRateAngstromsPerMin, setAldRateAngstromsPerMin] = useState('12.5');
  const [assemblyPrecisionPct, setAssemblyPrecisionPct] = useState('99.99');
  const [aiDefectInspectionMode, setAiDefectInspectionMode] = useState('ATOMIC_FORCE_MICROSCOPY_NEURAL_VISION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-nanotech')
      .then(res => res.json())
      .then(data => {
        setCleanrooms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddCleanroom = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-nanotech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cleanroomCode, cleanroomName, isoClass, aldRateAngstromsPerMin, assemblyPrecisionPct, aiDefectInspectionMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register cleanroom');

      setCleanrooms([data, ...cleanrooms]);
      setCleanroomCode('');
      setCleanroomName('');
      alert('Cleanroom facility registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/35">
                SMART NANOTECHNOLOGY & MOLECULAR MANUFACTURING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Nanofabrication & Cleanroom Grid</h1>
            <p className="text-xs text-slate-400">Monitor ISO cleanroom classes, ALD deposition rates, assembly precision, and AI defect inspection.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddCleanroom} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔬</span> Register Cleanroom Facility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Cleanroom Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. NANO-ROOM-04" 
                value={cleanroomCode} 
                onChange={e => setCleanroomCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Cleanroom Name</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Nanomaterials Cleanlab" 
                value={cleanroomName} 
                onChange={e => setCleanroomName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">ISO Class</label>
              <input 
                type="number" 
                min="1" 
                max="9" 
                value={isoClass} 
                onChange={e => setIsoClass(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">ALD Rate (Å/min)</label>
              <input 
                type="number" 
                step="0.1" 
                value={aldRateAngstromsPerMin} 
                onChange={e => setAldRateAngstromsPerMin(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Precision (%)</label>
              <input 
                type="number" 
                step="0.001" 
                value={assemblyPrecisionPct} 
                onChange={e => setAssemblyPrecisionPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Inspection Mode</label>
              <select 
                value={aiDefectInspectionMode} 
                onChange={e => setAiDefectInspectionMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
              >
                <option value="ATOMIC_FORCE_MICROSCOPY_NEURAL_VISION">AFM Neural Vision</option>
                <option value="ELECTRON_BEAM_LITHOGRAPHY_FEEDBACK">E-Beam Lithography Feedback</option>
                <option value="RAMAN_SPECTROSCOPY_DEFECT_MAPPER">Raman Spectroscopy Mapper</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20"
            >
              {adding ? 'Registering Cleanroom...' : 'Add Cleanroom Facility →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔬</span> Active Cleanroom Facilities ({cleanrooms.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Cleanroom Code & Name</th>
                  <th className="p-4 font-medium">ISO Class & ALD Rate</th>
                  <th className="p-4 font-medium">Assembly Precision</th>
                  <th className="p-4 font-medium text-right">AI Inspection Mode</th>
                </tr>
              </thead>
              <tbody>
                {cleanrooms.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{c.cleanroomCode}</p>
                      <p className="text-[10px] text-slate-400">{c.cleanroomName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-teal-400 font-semibold">ISO Class {c.isoClass}</p>
                      <p className="text-[10px] text-slate-400">{c.aldRateAngstromsPerMin} Å/min Deposition</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {c.assemblyPrecisionPct}% Precision
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        c.aiDefectInspectionMode === 'ATOMIC_FORCE_MICROSCOPY_NEURAL_VISION'
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/35'
                          : c.aiDefectInspectionMode === 'ELECTRON_BEAM_LITHOGRAPHY_FEEDBACK'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {c.aiDefectInspectionMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {cleanrooms.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No cleanroom facilities registered.
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
