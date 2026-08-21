export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartRadioPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stationCode, setStationCode] = useState('');
  const [stationName, setStationName] = useState('');
  const [frequencyMhz, setFrequencyMhz] = useState('91.5');
  const [broadcastPowerKw, setBroadcastPowerKw] = useState('2.5');
  const [activeListenersCount, setActiveListenersCount] = useState('1250');
  const [aiBroadcastMode, setAiBroadcastMode] = useState('AI_AUTONOMOUS_DYNAMIC_PLAYLIST');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-radio')
      .then(res => res.json())
      .then(data => {
        setStations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-radio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationCode, stationName, frequencyMhz, broadcastPowerKw, activeListenersCount, aiBroadcastMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register station');

      setStations([data, ...stations]);
      setStationCode('');
      setStationName('');
      alert('Radio station registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/35">
                SMART CAMPUS RADIO & BROADCAST HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Radio & Stream Grid</h1>
            <p className="text-xs text-slate-400">Monitor station frequencies, broadcast power, listener counts, and automated AI DJ modes.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddStation} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📻</span> Register Radio Station / Channel
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Station Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. RADIO-889" 
                value={stationCode} 
                onChange={e => setStationCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Station Name</label>
              <input 
                type="text" 
                placeholder="e.g. Campus Indie & Jazz Stream" 
                value={stationName} 
                onChange={e => setStationName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Frequency (MHz)</label>
              <input 
                type="number" 
                step="0.1" 
                value={frequencyMhz} 
                onChange={e => setFrequencyMhz(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Power (kW)</label>
              <input 
                type="number" 
                step="0.5" 
                value={broadcastPowerKw} 
                onChange={e => setBroadcastPowerKw(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Active Listeners</label>
              <input 
                type="number" 
                value={activeListenersCount} 
                onChange={e => setActiveListenersCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Broadcast Mode</label>
              <select 
                value={aiBroadcastMode} 
                onChange={e => setAiBroadcastMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="AI_AUTONOMOUS_DYNAMIC_PLAYLIST">AI Dynamic Playlist</option>
                <option value="ACADEMIC_LECTURE_STREAM_INTELLIGENCE">Academic Lecture Intelligence</option>
                <option value="EMERGENCY_BROADCAST_SAFETY_OVERRIDE">Emergency Safety Override</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-pink-500 text-slate-950 font-bold text-xs hover:bg-pink-400 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
            >
              {adding ? 'Registering Station...' : 'Add Radio Station →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📻</span> Active Radio Stations ({stations.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Station Code & Name</th>
                  <th className="p-4 font-medium">Frequency & Power</th>
                  <th className="p-4 font-medium">Active Listeners</th>
                  <th className="p-4 font-medium text-right">AI Broadcast Mode</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((s: any) => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{s.stationCode}</p>
                      <p className="text-[10px] text-slate-400">{s.stationName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-pink-400 font-semibold">{s.frequencyMhz} MHz</p>
                      <p className="text-[10px] text-slate-400">{s.broadcastPowerKw} kW Power</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {s.activeListenersCount.toLocaleString()} Listeners
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        s.aiBroadcastMode === 'AI_AUTONOMOUS_DYNAMIC_PLAYLIST'
                          ? 'bg-pink-500/10 text-pink-400 border-pink-500/35'
                          : s.aiBroadcastMode === 'ACADEMIC_LECTURE_STREAM_INTELLIGENCE'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : 'bg-red-500/10 text-red-400 border-red-500/35'
                      }`}>
                        {s.aiBroadcastMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {stations.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No radio stations registered.
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
