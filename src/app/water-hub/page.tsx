export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WaterHubPage() {
  const [reservoirs, setReservoirs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservoirName, setReservoirName] = useState('');
  const [location, setLocation] = useState('');
  const [capacityLtrs, setCapacityLtrs] = useState('50000');
  const [fillLevelPct, setFillLevelPct] = useState('85');
  const [tdsPpm, setTdsPpm] = useState('140');
  const [phLevel, setPhLevel] = useState('7.2');
  const [pumpStatus, setPumpStatus] = useState('AUTO_RUNNING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/water-hub')
      .then(res => res.json())
      .then(data => {
        setReservoirs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddReservoir = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/water-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservoirName, location, capacityLtrs, fillLevelPct, tdsPpm, phLevel, pumpStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add reservoir');

      setReservoirs([data, ...reservoirs]);
      setReservoirName('');
      setLocation('');
      alert('Smart water reservoir registered successfully.');
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
                SMART WATER & HYDRATION HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Water Reservoir & Quality Command</h1>
            <p className="text-xs text-slate-400">Monitor real-time tank storage levels, pH/TDS purity metrics, and automated filtration pumps.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddReservoir} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💧</span> Register Water Tank / Reservoir
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Reservoir / Tank Name</label>
              <input 
                type="text" 
                placeholder="e.g. Innovation Block Cistern" 
                value={reservoirName} 
                onChange={e => setReservoirName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Location</label>
              <input 
                type="text" 
                placeholder="e.g. Basement Level 2" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Capacity (Liters)</label>
              <input 
                type="number" 
                value={capacityLtrs} 
                onChange={e => setCapacityLtrs(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">TDS Purity (PPM)</label>
              <input 
                type="number" 
                value={tdsPpm} 
                onChange={e => setTdsPpm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">pH Level</label>
              <input 
                type="number" 
                step="0.1" 
                value={phLevel} 
                onChange={e => setPhLevel(e.target.value)} 
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
              {adding ? 'Registering Reservoir...' : 'Add Water Reservoir →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌊</span> Active Water Storage & Quality Network ({reservoirs.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Reservoir & Location</th>
                  <th className="p-4 font-medium">Storage Level</th>
                  <th className="p-4 font-medium">Purity (TDS / pH)</th>
                  <th className="p-4 font-medium text-right">Pump Status</th>
                </tr>
              </thead>
              <tbody>
                {reservoirs.map((res: any) => (
                  <tr key={res.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{res.reservoirName}</p>
                      <p className="text-[10px] text-slate-400">{res.location}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-white">{res.fillLevelPct}% Full</p>
                      <p className="text-[10px] text-slate-400">Cap: {res.capacityLtrs.toLocaleString()} L</p>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {res.tdsPpm} PPM | pH {res.phLevel}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        res.pumpStatus === 'AUTO_RUNNING'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {res.pumpStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {reservoirs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No water reservoirs registered.
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
