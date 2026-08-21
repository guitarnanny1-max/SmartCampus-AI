export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartWasteSortingPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortingUnitCode, setSortingUnitCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [wasteDiversionRatePct, setWasteDiversionRatePct] = useState('90.0');
  const [compostOutputKg, setCompostOutputKg] = useState('500.0');
  const [recyclingPurityPct, setRecyclingPurityPct] = useState('97.0');
  const [aiSortingMode, setAiSortingMode] = useState('COMPUTER_VISION_POLYMER_SORT');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-waste-sorting')
      .then(res => res.json())
      .then(data => {
        setUnits(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-waste-sorting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortingUnitCode, facilityName, wasteDiversionRatePct, compostOutputKg, recyclingPurityPct, aiSortingMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register sorting unit');

      setUnits([data, ...units]);
      setSortingUnitCode('');
      setFacilityName('');
      alert('Smart waste sorting unit registered successfully.');
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
                SMART WASTE SORTING & CIRCULAR ECONOMY HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Autonomous Waste Diversion & Composting</h1>
            <p className="text-xs text-slate-400">Monitor diversion rates (%), organic compost output (kg), recycling purity, and AI robotic sorting modes.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddUnit} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>♻️</span> Register Sorting Facility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Sorting Unit Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. SORT-UNIT-04" 
                value={sortingUnitCode} 
                onChange={e => setSortingUnitCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Athletic Stadium Zero-Waste Hub" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Diversion Rate (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={wasteDiversionRatePct} 
                onChange={e => setWasteDiversionRatePct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Compost Output (Kg)</label>
              <input 
                type="number" 
                step="10" 
                value={compostOutputKg} 
                onChange={e => setCompostOutputKg(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Recycling Purity (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={recyclingPurityPct} 
                onChange={e => setRecyclingPurityPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Sorting Mode</label>
              <select 
                value={aiSortingMode} 
                onChange={e => setAiSortingMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="COMPUTER_VISION_POLYMER_SORT">Computer Vision Polymer Sort</option>
                <option value="SPECTRAL_GLASS_SEPARATION">Spectral Glass Separation</option>
                <option value="AI_ACCELERATED_BIO_DECOMPOSITION">AI Accelerated Bio Decomposition</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Unit...' : 'Add Sorting Facility →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>♻️</span> Active Sorting Facilities ({units.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Unit Code & Name</th>
                  <th className="p-4 font-medium">Diversion Rate & Compost</th>
                  <th className="p-4 font-medium">Recycling Purity</th>
                  <th className="p-4 font-medium text-right">AI Sorting Mode</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u: any) => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{u.sortingUnitCode}</p>
                      <p className="text-[10px] text-slate-400">{u.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">{u.wasteDiversionRatePct}% Diversion</p>
                      <p className="text-[10px] text-slate-400">{u.compostOutputKg} Kg Compost Output</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {u.recyclingPurityPct}% Purity
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        u.aiSortingMode === 'COMPUTER_VISION_POLYMER_SORT'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : u.aiSortingMode === 'SPECTRAL_GLASS_SEPARATION'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {u.aiSortingMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {units.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No sorting units registered.
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
