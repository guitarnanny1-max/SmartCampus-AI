'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartStadiumPage() {
  const [stadiums, setStadiums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stadiumCode, setStadiumCode] = useState('');
  const [stadiumName, setStadiumName] = useState('');
  const [sportCategory, setSportCategory] = useState('FOOTBALL_TRACK');
  const [turfMoisturePct, setTurfMoisturePct] = useState('38.5');
  const [floodlightStatus, setFloodlightStatus] = useState('AUTO_DIMMED');
  const [spectatorCount, setSpectatorCount] = useState('0');
  const [aiMaintenanceStatus, setAiMaintenanceStatus] = useState('OPTIMIZED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-stadium')
      .then(res => res.json())
      .then(data => {
        setStadiums(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddStadium = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-stadium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stadiumCode, stadiumName, sportCategory, turfMoisturePct, floodlightStatus, spectatorCount, aiMaintenanceStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register stadium');

      setStadiums([data, ...stadiums]);
      setStadiumCode('');
      setStadiumName('');
      alert('Smart stadium registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                SMART STADIUM & ATHLETICS HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Athletic Stadiums & Tracks</h1>
            <p className="text-xs text-slate-400">Monitor turf moisture sensors, automated LED floodlights, spectator occupancy, and grounds maintenance in real time.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddStadium} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏟️</span> Register Stadium or Athletic Arena
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Stadium Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. STD-CRICKET-04" 
                value={stadiumCode} 
                onChange={e => setStadiumCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Stadium Name</label>
              <input 
                type="text" 
                placeholder="e.g. Varsity Cricket Ground" 
                value={stadiumName} 
                onChange={e => setStadiumName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Sport Category</label>
              <select 
                value={sportCategory} 
                onChange={e => setSportCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="FOOTBALL_TRACK">Football & Track</option>
                <option value="SOCCER">Soccer Pitch</option>
                <option value="TRACK_FIELD">Running Track</option>
                <option value="CRICKET_OVAL">Cricket Oval</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Turf Moisture (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={turfMoisturePct} 
                onChange={e => setTurfMoisturePct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Floodlights</label>
              <select 
                value={floodlightStatus} 
                onChange={e => setFloodlightStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="FULL_BRIGHTNESS">Full Brightness</option>
                <option value="AUTO_DIMMED">Auto Dimmed</option>
                <option value="STANDBY">Standby</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Spectator Count</label>
              <input 
                type="number" 
                value={spectatorCount} 
                onChange={e => setSpectatorCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Maintenance</label>
              <select 
                value={aiMaintenanceStatus} 
                onChange={e => setAiMaintenanceStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="OPTIMIZED">Optimized</option>
                <option value="IRRIGATION_SCHEDULED">Irrigation Scheduled</option>
                <option value="AERATION_REQUIRED">Aeration Required</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {adding ? 'Registering Stadium...' : 'Add Smart Stadium →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Stadiums & Athletic Arenas ({stadiums.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Stadium Code & Name</th>
                  <th className="p-4 font-medium">Turf Moisture & Lights</th>
                  <th className="p-4 font-medium">Spectators</th>
                  <th className="p-4 font-medium text-right">AI Maintenance Status</th>
                </tr>
              </thead>
              <tbody>
                {stadiums.map((s) => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{s.stadiumCode}</p>
                      <p className="text-[10px] text-slate-400">{s.stadiumName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-amber-400 font-semibold">{s.turfMoisturePct}% Moisture</p>
                      <p className="text-[10px] text-slate-400">Lights: {s.floodlightStatus}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {s.spectatorCount.toLocaleString()} attendees
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        s.aiMaintenanceStatus === 'OPTIMIZED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : s.aiMaintenanceStatus === 'IRRIGATION_SCHEDULED'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {s.aiMaintenanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {stadiums.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No smart stadiums registered.
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
