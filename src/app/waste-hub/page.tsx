'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WasteHubPage() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [binCode, setBinCode] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [wasteCategory, setWasteCategory] = useState('RECYCLABLE_PLASTIC');
  const [fillLevelPct, setFillLevelPct] = useState('40');
  const [compactedCount, setCompactedCount] = useState('10');
  const [status, setStatus] = useState('ACTIVE');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/waste-hub')
      .then(res => res.json())
      .then(data => {
        setBins(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddBin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/waste-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ binCode, zoneName, wasteCategory, fillLevelPct, compactedCount, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add smart bin');

      setBins([data, ...bins]);
      setBinCode('');
      setZoneName('');
      alert('Smart waste bin registered successfully.');
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
                SMART WASTE & RECYCLING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Smart Waste Management Command</h1>
            <p className="text-xs text-slate-400">Monitor IoT fill levels, automated solar compaction units, and campus sustainability metrics.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddBin} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>♻️</span> Register Smart Waste Bin
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Bin Identification Code</label>
              <input 
                type="text" 
                placeholder="e.g. BIN-SCIENCE-05" 
                value={binCode} 
                onChange={e => setBinCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Campus Zone Name</label>
              <input 
                type="text" 
                placeholder="e.g. Science Courtyard" 
                value={zoneName} 
                onChange={e => setZoneName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Waste Category</label>
              <select 
                value={wasteCategory} 
                onChange={e => setWasteCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="RECYCLABLE_PLASTIC">Recyclable Plastic</option>
                <option value="PAPER_CARDBOARD">Paper & Cardboard</option>
                <option value="ORGANIC_COMPOST">Organic Compost</option>
                <option value="E_WASTE">Electronic Waste</option>
                <option value="GENERAL_REFUSE">General Refuse</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Fill Level (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={fillLevelPct} 
                onChange={e => setFillLevelPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Compaction Cycles</label>
              <input 
                type="number" 
                min="0" 
                value={compactedCount} 
                onChange={e => setCompactedCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Bin...' : 'Add Smart Waste Bin →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🗑️</span> Smart Waste Collection Network ({bins.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Bin Code & Zone</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Fill Level</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {bins.map((b) => (
                  <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{b.binCode}</p>
                      <p className="text-[10px] text-slate-400">{b.zoneName}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{b.wasteCategory}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${b.fillLevelPct > 85 ? 'bg-rose-500' : b.fillLevelPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${b.fillLevelPct}%` }}
                          />
                        </div>
                        <span className="font-mono text-white text-[11px]">{b.fillLevelPct}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        b.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bins.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No smart waste bins registered.
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
