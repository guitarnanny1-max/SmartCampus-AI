export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FireSafetyPage() {
  const [systems, setSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelCode, setPanelCode] = useState('');
  const [locationName, setLocationName] = useState('');
  const [smokePpm, setSmokePpm] = useState('0.05');
  const [sprinklerPsi, setSprinklerPsi] = useState('120.0');
  const [temperatureC, setTemperatureC] = useState('22.0');
  const [alarmStatus, setAlarmStatus] = useState('NORMAL');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/fire-safety')
      .then(res => res.json())
      .then(data => {
        setSystems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/fire-safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panelCode, locationName, smokePpm, sprinklerPsi, temperatureC, alarmStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register fire safety system');

      setSystems([data, ...systems]);
      setPanelCode('');
      setLocationName('');
      alert('Fire safety system registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/35">
                FIRE & LIFE SAFETY COMMAND HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Fire Suppression & Smoke Alarms</h1>
            <p className="text-xs text-slate-400">Monitor optical smoke density, sprinkler water pressure (PSI), and thermal fire control panels across campus.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddSystem} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚨</span> Register Fire Safety Panel
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Fire Panel Code</label>
              <input 
                type="text" 
                placeholder="e.g. FIRE-AUD-05" 
                value={panelCode} 
                onChange={e => setPanelCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Location / Zone Name</label>
              <input 
                type="text" 
                placeholder="e.g. Main Auditorium & Stage Wing" 
                value={locationName} 
                onChange={e => setLocationName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Smoke Density (PPM)</label>
              <input 
                type="number" 
                step="0.01" 
                value={smokePpm} 
                onChange={e => setSmokePpm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Sprinkler Pressure (PSI)</label>
              <input 
                type="number" 
                step="0.1" 
                value={sprinklerPsi} 
                onChange={e => setSprinklerPsi(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Temperature (°C)</label>
              <input 
                type="number" 
                step="0.1" 
                value={temperatureC} 
                onChange={e => setTemperatureC(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Alarm Status</label>
              <select 
                value={alarmStatus} 
                onChange={e => setAlarmStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="NORMAL">Normal</option>
                <option value="CAUTION">Caution</option>
                <option value="ALERT">Active Fire Alert</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-400 transition-all disabled:opacity-50 shadow-lg shadow-rose-500/20"
            >
              {adding ? 'Registering System...' : 'Add Fire Safety Panel →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Campus Fire & Life Safety Network ({systems.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Panel Code & Location</th>
                  <th className="p-4 font-medium">Smoke Density</th>
                  <th className="p-4 font-medium">Sprinkler PSI</th>
                  <th className="p-4 font-medium text-right">Thermal & Status</th>
                </tr>
              </thead>
              <tbody>
                {systems.map((s: any) => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{s.panelCode}</p>
                      <p className="text-[10px] text-slate-400">{s.locationName}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {s.smokePpm} PPM
                    </td>
                    <td className="p-4 font-mono text-cyan-400 font-bold">
                      {s.sprinklerPsi} PSI
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono text-slate-400">{s.temperatureC}°C</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          s.alarmStatus === 'NORMAL'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/35 animate-pulse'
                        }`}>
                          {s.alarmStatus}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {systems.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No fire safety systems registered.
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
