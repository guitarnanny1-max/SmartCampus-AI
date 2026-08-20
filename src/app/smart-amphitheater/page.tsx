'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartAmphitheaterPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amphitheaterCode, setAmphitheaterCode] = useState('');
  const [venueName, setVenueName] = useState('');
  const [soundDecibelLimit, setSoundDecibelLimit] = useState('85.0');
  const [acousticMode, setAcousticMode] = useState('OPEN_AIR_DIRECT');
  const [occupancyCount, setOccupancyCount] = useState('0');
  const [aiSafetyStatus, setAiSafetyStatus] = useState('OPTIMIZED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-amphitheater')
      .then(res => res.json())
      .then(data => {
        setVenues(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-amphitheater', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amphitheaterCode, venueName, soundDecibelLimit, acousticMode, occupancyCount, aiSafetyStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register venue');

      setVenues([data, ...venues]);
      setAmphitheaterCode('');
      setVenueName('');
      alert('Smart amphitheater venue registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/35">
                SMART AMPHITHEATER & ACOUSTICS HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Open-Air Auditoriums & Sound Control</h1>
            <p className="text-xs text-slate-400">Monitor decibel thresholds, acoustic beamforming arrays, seating capacities, and neighborhood noise compliance.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddVenue} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎭</span> Register Open-Air Venue or Amphitheater
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Venue Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. AMP-LAWN-04" 
                value={amphitheaterCode} 
                onChange={e => setAmphitheaterCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Venue Name</label>
              <input 
                type="text" 
                placeholder="e.g. South Green Lawn Stage" 
                value={venueName} 
                onChange={e => setVenueName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Decibel Limit (dB)</label>
              <input 
                type="number" 
                step="0.1" 
                value={soundDecibelLimit} 
                onChange={e => setSoundDecibelLimit(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Acoustic Mode</label>
              <select 
                value={acousticMode} 
                onChange={e => setAcousticMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="OPEN_AIR_DIRECT">Open Air Direct</option>
                <option value="DIRECTIONAL_ARRAY">Directional Array</option>
                <option value="SOUND_DIFFUSION">Sound Diffusion</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Occupancy</label>
              <input 
                type="number" 
                value={occupancyCount} 
                onChange={e => setOccupancyCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-medium text-slate-400">AI Safety Status</label>
              <select 
                value={aiSafetyStatus} 
                onChange={e => setAiSafetyStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="OPTIMIZED">Optimized</option>
                <option value="LIMIT_WARNING">Limit Warning</option>
                <option value="RESTRICTED_MODE">Restricted Mode</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 transition-all disabled:opacity-50 shadow-lg shadow-violet-600/20"
            >
              {adding ? 'Registering Venue...' : 'Add Open-Air Venue →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔊</span> Active Amphitheater Venues ({venues.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Venue Code & Name</th>
                  <th className="p-4 font-medium">Decibels & Acoustics</th>
                  <th className="p-4 font-medium">Audience</th>
                  <th className="p-4 font-medium text-right">AI Safety Status</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((v) => (
                  <tr key={v.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{v.amphitheaterCode}</p>
                      <p className="text-[10px] text-slate-400">{v.venueName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-violet-400 font-semibold">{v.soundDecibelLimit} dB Limit</p>
                      <p className="text-[10px] text-slate-400">{v.acousticMode}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {v.occupancyCount.toLocaleString()} attendees
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        v.aiSafetyStatus === 'OPTIMIZED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : v.aiSafetyStatus === 'LIMIT_WARNING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {v.aiSafetyStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {venues.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No amphitheater venues registered.
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
